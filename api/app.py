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

mapping_methods = {
    'X-RAY DIFFRACTION': 'X-ray diffraction',
    'SOLUTION NMR': 'Solution NMR',
    'ELECTRON MICROSCOPY': 'Electron microscopy',
    'ELECTRON CRYSTALLOGRAPHY': 'Electron crystallography',
    'SOLID-STATE NMR': 'Solid-state NMR',
    'SOLUTION SCATTERING': 'Solution scattering',
    'NEUTRON DIFFRACTION': 'Neutron diffraction',
}

data = pd.read_excel(Path(app.config['WORKFLOW_OUTPUT_DATA']) / "Rings.xlsx", index_col=0)
data['ring_coverage'] = data['ring_coverage'].replace(np.nan, 'N/A')
data['rsr'] = data['rsr'].replace(np.nan, 'N/A')
data['rscc'] = data['rscc'].replace(np.nan, 'N/A')
data['resolution'] = data['resolution'].replace(np.nan, 'N/A')
data['ring_id'] = data.index
data['conformation'] = data['conformation'].str.replace('_', ' ').str.capitalize()
data['conformation'] = data['conformation'].replace({
    'Tw boat left': 'Twist boat',
    'Tw boat right': 'Twist boat'
})
data['experimental_method'] = data['experimental_method'].replace(mapping_methods)

print(data['experimental_method'].value_counts())

# conformation_mapping = {
#     'Twist boat': ['Tw boat left', 'Tw boat right']
# }

# data['mapped_conformation'] = data['conformation'].map(
#     lambda x: next((key for key, values in conformation_mapping.items() if x in values), None)
# )


@app.route('/api/data', methods=['POST'])
def get_paginated_data():
    received_data = request.json

    page_index = received_data.get('pageIndex', 1)
    page_size = received_data.get('pageSize', 10)

    try:
        page_index = int(page_index)
        page_size = int(page_size)
    except (ValueError, TypeError):
        page_index = 1
        page_size = 10

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

    paginated_data = filtered_data.iloc[start_idx:end_idx]
    response = {
        'rows': paginated_data.to_dict(orient='records'),
        'totalRows': len(filtered_data)
    }
    print(paginated_data)

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
