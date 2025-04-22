from pathlib import Path

import numpy as np
from flask import Flask, jsonify, request, Response, render_template
import os
import json
from dotenv import load_dotenv
import logging
import pandas as pd
from flask_cors import CORS

from utils import is_favorable, get_range_with_step

app = Flask(__name__,
            static_folder='dist/static',
            template_folder='dist')

load_dotenv()

# environment_configuration = os.environ['CONFIGURATION_SETUP']
print("Loaded CONFIGURATION_SETUP:", os.getenv("CONFIGURATION_SETUP"))  # Debugging
environment_configuration = os.getenv('CONFIGURATION_SETUP')  # Use os.getenv instead of os.environ.get
if not environment_configuration:
    raise RuntimeError("CONFIGURATION_SETUP is not set!")

app.config.from_object(environment_configuration)

CORS(app)

# Setup logging
logging.basicConfig(level=logging.DEBUG)
path = os.path.join(os.path.dirname(__file__), app.config['WORKFLOW_OUTPUT_DATA'], 'Rings.xlsx')
data = pd.read_excel(path, engine="openpyxl", index_col=0)

data['ring_id'] = data.index
print(data['experimental_method'].value_counts())


def application(environ, start_response):
    return app(environ, start_response)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/api/get_pdb_ids', methods=['GET'])
def get_pdb_ids():
    pdb_ids = data['pdb_id'].unique().tolist()
    return jsonify(pdb_ids), 200


@app.route('/api/get_ccd_ids', methods=['GET'])
def get_ccd_ids():
    ccd_ids = data['ccd_id'].unique().tolist()
    return jsonify(ccd_ids), 200


def apply_filters(df, filters):
    non_empty_filters = [f for f in filters if f.get('value')]

    for f in non_empty_filters:
        handler = FILTER_HANDLERS.get(f['id'])
        if handler:
            df = handler(df, f['value'])
    return df


def filter_ring_type(df, value):
    return df[df['ring_type'].isin(value)]

def filter_conformation(df, value):
    selected = value.get('selectedValues', [])
    show_fav = value.get('showFavorable', True)
    show_unfav = value.get('showUnfavorable', True)

    if selected:
        df = df[df['conformation'].isin(selected)]

    if not (show_fav and show_unfav):
        df = df[
            df.apply(lambda row:
                     (is_favorable(row['ring_type'], row['conformation']) and show_fav) or
                     (not is_favorable(row['ring_type'], row['conformation']) and show_unfav),
                     axis=1)
        ]
    return df

def filter_in(col):
    return lambda df, val: df[df[col].isin(val)]

def filter_range(col, scale=1):
    return lambda df, val: df[(df[col] * scale >= val[0]) & (df[col] * scale <= val[1])]



FILTER_HANDLERS = {
    'ring_type': filter_ring_type,
    'conformation': filter_conformation,
    'experimental_method': filter_in('experimental_method'),
    'pdb_id': filter_in('pdb_id'),
    'ccd_id': filter_in('ccd_id'),
    'resolution': filter_range('resolution'),
    'ring_coverage': filter_range( 'ring_coverage_float', scale=100),
    'rsr': filter_range('rsr'),
    'rscc': filter_range('rscc'),
}

def apply_sorting(df, sorting):
    if not sorting:
        return df

    sort_column = sorting[0].get('id')
    sort_desc = sorting[0].get('desc', False)

    try:
        if sort_column == 'ring_coverage':
            df = df.copy()
            df['ring_coverage_float'] = pd.to_numeric(df['ring_coverage_float'], errors='coerce')
            return df.sort_values('ring_coverage_float', ascending=not sort_desc)
        return df.sort_values(sort_column, ascending=not sort_desc)
    except Exception as e:
        logging.warning(f"Sorting failed on column {sort_column}: {e}")
        return df


def apply_pagination(df, page_index, page_size):
    start = (page_index - 1) * page_size
    end = start + page_size
    return df.iloc[start:end].fillna('N/A')


def calculate_filter_ranges(df):
    return {
        'resolution': get_range_with_step(df['resolution']),
        'ring_coverage': get_range_with_step(df['ring_coverage_float'] * 100),
        'rsr': get_range_with_step(df['rsr']),
        'rscc': get_range_with_step(df['rscc']),
    }


@app.route('/api/data', methods=['POST'])
def get_paginated_data():
    received_data = request.get_json()

    page_index = int(received_data.get('pageIndex', 1))
    page_size = int(received_data.get('pageSize', 10))
    filters = received_data.get('filters', [])
    sorting = received_data.get('sorting', [])

    # Filter the data
    filtered_data = apply_filters(data, filters)
    data_for_ranges = filtered_data.copy()

    # Sort the data
    sorted_data = apply_sorting(filtered_data, sorting)

    # Paginate the data
    paginated_data = apply_pagination(sorted_data, page_index, page_size)

    # Compute filter ranges
    filters_value_range = calculate_filter_ranges(data_for_ranges)

    return jsonify({
        'rows': paginated_data.to_dict(orient='records'),
        'totalRows': len(filtered_data),
        'filtersValueRange': filters_value_range
    })


@app.route('/api/get_row_data', methods=['GET'])
def get_row_data():
    ring_id = request.args.get('ringID')

    print(ring_id)
    print(data.head())

    if not ring_id:
        return jsonify({"error": "ringID parameter is required"}), 400

    if ring_id not in data.index:
        return jsonify({"error": "Ring ID not found"}), 404

    row_data = data.loc[ring_id].to_json()
    return Response(status=200, mimetype="application/json", response=row_data)


print(f"Environment: {app.config['ENV']}")
print(f"Debug: {app.config['DEBUG']}")

if __name__ == "__main__":
    app.run()
