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
data['ring_coverage'] = data['ring_coverage'].replace(np.nan, 'NaN')
data['rsr'] = data['rsr'].replace(np.nan, 'NaN')
data['rscc'] = data['rscc'].replace(np.nan, 'NaN')
data['resolution'] = data['resolution'].replace(np.nan, 'NaN')
data['ring_id'] = data.index


@app.route('/api/data', methods=['GET'])
def get_paginated_data():
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('pageSize', 10))

    # Calculate start and end indices for the page
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size

    paginated_data = data.iloc[start_idx:end_idx]
    response = {
        'rows': paginated_data.to_dict(orient='records'),
        'totalRows': len(data)
    }
    print(data)

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
