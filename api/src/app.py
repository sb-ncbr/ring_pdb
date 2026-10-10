from flask import Flask, jsonify, request, Response, render_template, send_file
import os
import logging
from flask_cors import CORS
from src.data_manager import DataManager
import io

from src.utils import get_range_with_step, apply_filters, prepare_filtered_and_sorted_data

app = Flask(__name__,
            static_folder='dist/static',
            template_folder=os.path.join(os.path.dirname(__file__), "templates"))

CORS(app)

# Setup logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)s] %(message)s'
)

# Initialise the DataManager
with app.app_context():
    data_manager = DataManager()

def application(environ, start_response):
    return app(environ, start_response)


def detect_missing_values(df, field: str):
    """
    Detect missing values for a specific field in the DataFrame.
    Returns a tuple: (clean_values, error_info or None)
    """
    missing_mask = df[field].isna()
    missing_count = missing_mask.sum()

    valid_values = df.loc[~missing_mask, field].unique().tolist()
    error_info = None

    if missing_count > 0:
        error_message = f'{missing_count} record(s) missing {field} value.'
        logging.error(error_message)

        error_info = {
            'code': 'MISSING_VALUE',
            'field': field,
            'message': error_message
        }

    return valid_values, error_info


def build_response(payload: dict, error: dict | None = None):
    """
    Builds a consistent API response structure.
    """
    response = dict(payload)
    if error:
        response['error'] = error
    return jsonify(response), 200


def get_filtered_field(field_name: str):
    """
    Generic handler for routes that return a filtered field.
    """
    received_data = request.get_json()
    other_filters = received_data.get('otherFilters', {})

    filtered_data = apply_filters(data_manager.data, other_filters)

    field_data, error_info = detect_missing_values(filtered_data, field_name)

    return build_response({'payload': field_data}, error_info)


@app.route('/api/get_pdb_ids', methods=['POST'])
def get_pdb_ids():
    return get_filtered_field('extended_PDB_ID')


@app.route('/api/get_ccd_ids', methods=['POST'])
def get_ccd_ids():
    return get_filtered_field('ccd_id')


@app.route('/api/get_methods', methods=['POST'])
def get_methods():
    return get_filtered_field('experimental_method')


@app.route('/api/data', methods=['POST'])
def get_paginated_data():
    received_data = request.get_json()

    page_index = int(received_data.get('pageIndex', 1))
    page_size = int(received_data.get('pageSize', 10))

    start_idx = (page_index - 1) * page_size
    end_idx = start_idx + page_size

    current_data = data_manager.data
    filters = received_data.get('filters', [])
    sorting = received_data.get('sorting', [])

    data_for_calc_ranges, sorted_data = prepare_filtered_and_sorted_data(current_data, filters, sorting)

    paginated_data = sorted_data.iloc[start_idx:end_idx].fillna('N/A')

    filters_value_range = {
        'resolution': get_range_with_step(data_for_calc_ranges['resolution']),
        'ring_coverage': get_range_with_step(data_for_calc_ranges['ring_coverage_percent'], 'ring_coverage_float')
    }

    response = {
        'rows': paginated_data.to_dict(orient='records'),
        'totalRows': len(sorted_data),
        'filtersValueRange': filters_value_range
    }

    return jsonify(response)

@app.route('/api/get_row_data', methods=['GET'])
def get_row_data():
    ring_id = request.args.get('ringID')
    current_data = data_manager.data

    if not ring_id:
        return jsonify({'error': 'ringID parameter is required'}), 400

    if ring_id not in current_data.index:
        return jsonify({'error': 'Ring ID not found'}), 404

    row_data = current_data.loc[ring_id].to_json()
    return Response(status=200, mimetype='application/json', response=row_data)


@app.route('/api/export-data', methods=['POST'])
def export_data():
    request_data = request.get_json()

    current_data = data_manager.data
    filters = request_data.get('filters', [])
    sorting = request_data.get('sorting', [])

    _, sorted_data = prepare_filtered_and_sorted_data(current_data, filters, sorting)

    export_data = sorted_data.drop(['ring_coverage_float', 'ring_coverage_percent', 'ring_coverage_counts', 'is_favorable'], axis=1).fillna('N/A')
    ring_id = export_data.pop("ring_id")
    export_data.insert(0, "ring_id", ring_id)

    csv_string = export_data.to_csv(index=False)
    csv_bytes = io.BytesIO(csv_string.encode('utf-8'))
    csv_bytes.seek(0)

    return send_file(
        csv_bytes,
        mimetype='text/csv',
        as_attachment=True,
        download_name='export.csv'
    )


if __name__ == '__main__':
    app.run()
