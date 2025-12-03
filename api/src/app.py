from flask import Flask, jsonify, request, Response, render_template, send_file
import os
from flask.cli import load_dotenv
import logging
import pandas as pd
from flask_cors import CORS
from data_manager import DataManager
import io

from utils import is_favorable, get_range_with_step, filter_by_conf, apply_filters
from config import DevelopmentConfig, ProductionConfig

app = Flask(__name__,
            static_folder='dist/static',
            template_folder=os.path.join(os.path.dirname(__file__), "templates"))

config_map = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
}

flask_env = os.getenv("FLASK_ENV")
config_class = config_map.get(flask_env)

app.config.from_object(config_class)

CORS(app)

# Setup logging
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

# Initialize the DataManager
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
        debug_cols = ['pdb_id', 'ccd_id', 'chain_id'] 
        missing_rows = df.loc[missing_mask, debug_cols]

        error_message = f"{missing_count} record(s) missing {field} value."
        logging.error(error_message)

        error_info = {
            "code": "MISSING_VALUE",
            "field": field,
            "message": error_message
        }

    return valid_values, error_info


def build_response(payload: dict, error: dict | None = None):
    """
    Builds a consistent API response structure.
    """
    response = payload
    if error:
        response["error"] = error
    return jsonify(response), 200


def get_filtered_field(field_name: str):
    """
    Generic handler for routes that return a filtered field.
    """
    received_data = request.get_json()
    other_filters = received_data.get("otherFilters", {})

    filtered_data = apply_filters(data_manager.data, other_filters)

    field_data, error_info = detect_missing_values(filtered_data, field_name)

    return build_response({'payload': field_data}, error_info)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/api/get_pdb_ids', methods=['POST'])
def get_pdb_ids():
    return get_filtered_field('pdb_id')


@app.route('/api/get_ccd_ids', methods=['POST'])
def get_ccd_ids():
    return get_filtered_field('ccd_id')


@app.route('/api/get_methods', methods=['POST'])
def get_methods():
    return get_filtered_field('experimental_method')


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
            filtered_data = filter_by_conf(filter['value'], filtered_data)

        elif filter['id'] == 'experimental_method':
            filtered_data = filtered_data[filtered_data['experimental_method'].isin(filter['value'])]
        elif filter['id'] == 'pdb_id':
            filtered_data = filtered_data[filtered_data['pdb_id'].isin(filter['value'])]
        elif filter['id'] == 'ccd_id':
            filtered_data = filtered_data[filtered_data['ccd_id'].isin(filter['value'])]

    data_for_calc_ranges = filtered_data
    for filter in non_empty_filters:
        if filter['id'] == 'resolution':
            filtered_data = filtered_data[(filtered_data['resolution'] >= filter['value'][0]) &
                                          (filtered_data['resolution'] <= filter['value'][1])]
        elif filter['id'] == 'ring_coverage':
            filtered_data = filtered_data[(filtered_data['ring_coverage_float']*100 >= filter['value'][0]) &
                                          (filtered_data['ring_coverage_float']*100 <= filter['value'][1])]
        elif filter['id'] == 'rsr':
            filtered_data = filtered_data[(filtered_data['rsr'] >= filter['value'][0]) &
                                          (filtered_data['rsr'] <= filter['value'][1])]
        elif filter['id'] == 'rscc':
            filtered_data = filtered_data[(filtered_data['rscc'] >= filter['value'][0]) &
                                          (filtered_data['rscc'] <= filter['value'][1])]

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
            logging.error(f'Error occurred while sorting: {e}')

    paginated_data = sorted_data.iloc[start_idx:end_idx].fillna('N/A')

    filters_value_range = {
        'resolution': get_range_with_step(data_for_calc_ranges['resolution']),
        'ring_coverage': get_range_with_step(data_for_calc_ranges['ring_coverage_float'] * 100, 'ring_coverage_float'),
        # 'ligand_coverage': {},
        'rsr': get_range_with_step(data_for_calc_ranges['rsr']),
        'rscc': get_range_with_step(data_for_calc_ranges['rscc']),
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


@app.route('/api/export-data', methods=['POST'])
def export_data():
    # refactor later
    request_data = request.get_json()
    filters = request_data.get('filters', [])
    sorting = request_data.get('sorting', [])
    current_data = data_manager.data

    filtered_data = current_data

    non_empty_filters = [filter for filter in filters if filter['value']]
    for filter in non_empty_filters:
        if filter['id'] == 'ring_type':
            filtered_data = filtered_data[filtered_data['ring_type'].isin(filter['value'])]

        elif filter['id'] == 'conformation':
            selected_values = filter['value'].get('selectedValues', [])
            show_favorable = filter['value'].get('showFavorable', True)
            show_unfavorable = filter['value'].get('showUnfavorable', True)

            if selected_values:
                filtered_data = filtered_data[filtered_data['conformation'].isin(selected_values)]

            if not (show_favorable and show_unfavorable):
                filtered_data = filtered_data[
                    filtered_data.apply(
                        lambda row: (is_favorable(row['ring_type'], row['conformation']) and show_favorable) or
                                    (not is_favorable(row['ring_type'], row['conformation']) and show_unfavorable),
                        axis=1
                    )
                ]

        elif filter['id'] == 'experimental_method':
            filtered_data = filtered_data[filtered_data['experimental_method'].isin(filter['value'])]
        elif filter['id'] == 'pdb_id':
            filtered_data = filtered_data[filtered_data['pdb_id'].isin(filter['value'])]
        elif filter['id'] == 'ccd_id':
            filtered_data = filtered_data[filtered_data['ccd_id'].isin(filter['value'])]


    for filter in non_empty_filters:
        if filter['id'] == 'resolution':
            filtered_data = filtered_data[(filtered_data['resolution'] >= filter['value'][0]) &
                                          (filtered_data['resolution'] <= filter['value'][1])]
        elif filter['id'] == 'ring_coverage':
            filtered_data = filtered_data[(filtered_data['ring_coverage_float'] * 100 >= filter['value'][0]) &
                                          (filtered_data['ring_coverage_float'] * 100 <= filter['value'][1])]
        elif filter['id'] == 'rsr':
            filtered_data = filtered_data[(filtered_data['rsr'] >= filter['value'][0]) &
                                          (filtered_data['rsr'] <= filter['value'][1])]
        elif filter['id'] == 'rscc':
            filtered_data = filtered_data[(filtered_data['rscc'] >= filter['value'][0]) &
                                          (filtered_data['rscc'] <= filter['value'][1])]

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
            logging.error(f'Error occurred while sorting: {e}')

    sorted_data.fillna('N/A')
    export_data = sorted_data.drop(['ring_coverage_float', 'ring_coverage_counts'], axis=1)

    csv_string = export_data.to_csv(index=False)
    csv_bytes = io.BytesIO(csv_string.encode('utf-8'))
    csv_bytes.seek(0)

    return send_file(
        csv_bytes,
        mimetype='text/csv',
        as_attachment=True,
        download_name='export.csv'
    )


print(f"Environment: {app.config['ENV']}")
print(f"Debug: {app.config['DEBUG']}")

if __name__ == "__main__":
    app.run()
