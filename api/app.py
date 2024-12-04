import os
import logging
from flask.cli import load_dotenv
import numpy as np
import pandas as pd

from flask import Flask, Response, jsonify, request
from data_manager import DataManager
from utils import get_range_with_step
from flask_cors import CORS


load_dotenv()

app = Flask(__name__)
environment_configuration = os.environ['CONFIGURATION_SETUP']
app.config.from_object(environment_configuration)

CORS(app)

# Setup logging
logging.basicConfig(level=logging.DEBUG)

# Initialize the DataManager
with app.app_context():
    data_manager = DataManager()
    # print(data_manager.data[:10].to_json)


@app.route('/api/get_pdb_ids', methods=['GET'])
def get_pdb_ids():
    pdb_ids = data_manager.data['pdb_id'].unique().tolist()
    return jsonify(pdb_ids), 200


@app.route('/api/get_ccd_ids', methods=['GET'])
def get_ccd_ids():
    ccd_ids = data_manager.data['ccd_id'].unique().tolist()
    return jsonify(ccd_ids), 200


@app.route('/api/data', methods=['POST'])
def get_paginated_data():
    received_data = request.json
    current_data = data_manager.data

    page_index = int(received_data.get('pageIndex', 1))
    page_size = int(received_data.get('pageSize', 10))

    start_idx = (page_index - 1) * page_size
    end_idx = start_idx + page_size

    filters = received_data.get('filters', [])
    filtered_data = current_data

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

    data_for_calc_ranges = filtered_data
    for filter in non_empty_filters:
        if filter['id'] == 'resolution':
            filtered_data = filtered_data[
                (filtered_data['resolution'] >= filter['value'][0]) &
                (filtered_data['resolution'] <= filter['value'][1])
            ]

    sorting = received_data.get('sorting', [])
    sorted_data = filtered_data

    if sorting:
        sort_column = sorting[0].get('id')
        sort_order_desc = sorting[0].get('desc')
        try:
            if sort_column == 'ring_coverage':
                sorted_data['ring_coverage_float'] = pd.to_numeric(
                    sorted_data['ring_coverage_float'],
                    errors='coerce'
                ).astype('object')
                sorted_data = sorted_data.sort_values(
                    'ring_coverage_float',
                    ascending=(not sort_order_desc)
                )
            else:
                sorted_data = sorted_data.sort_values(
                    sort_column,
                    ascending=(not sort_order_desc)
                )
        except Exception as e:
            logging.error(f'Error occurred while sorting: {e}')

    paginated_data = sorted_data.iloc[start_idx:end_idx].fillna('N/A')
    print(paginated_data)

    filters_value_range = {
        'resolution': get_range_with_step(data_for_calc_ranges['resolution']),
        'ring_coverage': get_range_with_step(
            sorted_data['ring_coverage'].str.replace('%', '').astype(float)
        ),
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
    current_data = data_manager.data

    if not ring_id:
        return jsonify({"error": "ringID parameter is required"}), 400

    if ring_id not in current_data.index:
        return jsonify({"error": "Ring ID not found"}), 404

    row_data = current_data.loc[ring_id].to_json()
    return Response(status=200, mimetype="application/json", response=row_data)


print(f"Environment: {app.config['ENV']}")
print(f"Debug: {app.config['DEBUG']}")

if __name__ == "__main__":
    app.run()
