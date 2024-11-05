from pathlib import Path

import numpy as np
from flask import Flask, jsonify, request
import os
from dotenv import load_dotenv
import logging
import pandas as pd
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
environment_configuration = os.environ['CONFIGURATION_SETUP']
app.config.from_object(environment_configuration)

CORS(app)

# Setup logging
logging.basicConfig(level=logging.DEBUG)

data = pd.read_excel(Path(app.config['WORKFLOW_OUTPUT_DATA']) / "Rings.xlsx", index_col=0)
data['ring_id'] = data.index
print(data['experimental_method'].value_counts())


def get_range_with_step(data_series):
    """Calculate min, max, and step while handling NaN values."""
    min_value = data_series.min()
    max_value = data_series.max()

    if np.isnan(min_value) or np.isnan(max_value):
        return {}
    else:
        step = 0.01
        return {'min': min_value, 'max': max_value, 'step': step}


@app.route('/api/get_pdb_ids', methods=['GET'])
def get_pdb_ids():
    pdb_ids = data['pdb_id'].unique().tolist()
    return jsonify(pdb_ids), 200


@app.route('/api/get_ccd_ids', methods=['GET'])
def get_ccd_ids():
    ccd_ids = data['ccd_id'].unique().tolist()
    return jsonify(ccd_ids), 200


@app.route('/api/data', methods=['POST'])
def get_paginated_data():
    received_data = request.json

    page_index = received_data.get('pageIndex', 1)
    page_size = received_data.get('pageSize', 10)

    page_index = int(page_index)
    page_size = int(page_size)

    start_idx = (page_index - 1) * page_size
    end_idx = start_idx + page_size

    filters = received_data.get('filters', [])
    filtered_data = data

    non_empty_filters = [filter for filter in filters if filter['value']]
    for filter in non_empty_filters:
        if filter['id'] == 'ring_type':
            filtered_data = filtered_data[filtered_data['ring_type'].isin(filter['value'])]
        elif filter['id'] == 'conformation':
            filtered_data = filtered_data[filtered_data['conformation'].isin(filter['value'])]
        elif filter['id'] == 'experimental_method':
            filtered_data = filtered_data[filtered_data['experimental_method'].isin(filter['value'])]
        elif filter['id'] == 'pdb_id':
            filtered_data = filtered_data[filtered_data['pdb_id'].isin(filter['value'])]
        elif filter['id'] == 'ccd_id':
            filtered_data = filtered_data[filtered_data['ccd_id'].isin(filter['value'])]

    sorting = received_data.get('sorting', [])
    sorted_data = filtered_data

    if sorting:
        sort_column = sorting[0].get('id')
        sort_order_desc = sorting[0].get('desc')
        try:
            if sort_column == 'ring_coverage':
                sorted_data['ring_coverage_float'] = pd.to_numeric(sorted_data['ring_coverage_float'],
                                                                   errors='coerce').astype('object')
                sorted_data = sorted_data.sort_values('ring_coverage_float', ascending=(not sort_order_desc))
                sorted_data['ring_coverage_float'] = sorted_data['ring_coverage_float']
            else:
                sorted_data = sorted_data.sort_values(sort_column, ascending=(not sort_order_desc))
        except Exception as e:
            print('Error occurred while sorting: ', e)

    paginated_data = sorted_data.iloc[start_idx:end_idx].fillna('N/A')
    print(paginated_data)

    filters_value_range = {
        'resolution': get_range_with_step(sorted_data['resolution']),
        'ring_coverage': get_range_with_step(sorted_data['ring_coverage'].str.replace('%', '').astype(float)),
        # 'ligand_coverage': {},
        'rsr': get_range_with_step(sorted_data['rsr']),
        'rscc': get_range_with_step(sorted_data['rscc']),
    }

    response = {
        'rows': paginated_data.to_dict(orient='records'),
        'totalRows': len(filtered_data),
        'filtersValueRange': filters_value_range
    }

    return jsonify(response)


@app.route('/api/get_row_data', methods=['GET'])
def get_row_data():
    ring_id = request.args.get('ringID')

    print(ring_id)
    print(data.head())

    if not ring_id:
        return jsonify({"error": "ringID parameter is required"}), 400

    if ring_id not in data.index:
        return jsonify({"error": "Ring ID not found"}), 404

    row_data = data.loc[ring_id].to_dict()

    return jsonify(row_data), 200


print(f"Environment: {app.config['ENV']}")
print(f"Debug: {app.config['DEBUG']}")

if __name__ == "__main__":
    app.run()
