from pathlib import Path

import numpy as np
from flask import Flask, jsonify
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


def rename_headers(df):
    df = df.rename(columns={
        'Ligand_name': 'ligand_name',
        'Ring_ID': 'ring_id',
        'BOAT': 'boat',
        'CHAIR': 'chair',
        'FLAT': 'flat',
        'HALF_CHAIR': 'half_chair',
        'TW_BOAT_LEFT': 'tw_boat_left',
        'TW_BOAT_RIGHT': 'tw_boat_right',
        'MinValue': 'min_value',
        'Conformation': 'conformation',
        'Entry ID': 'entry_id',
        'Experimental Method': 'experimental_method',
        'Release Date': 'release_date',
        'Resolution (A)': 'resolution',
        'Coverage': 'coverage'
    })
    return df


@app.route('/api/data', methods=['GET'])
def get_results():
    data_file = Path(app.config['DATA']) / "result_summary.xlsx"
    df = pd.read_excel(data_file, sheet_name="Summary")
    df = rename_headers(df)
    # replace NaN values with None in column 'B' only
    df['coverage'] = df['coverage'].replace(np.nan, None)
    print("DataFrame after renaming headers:\n", df)
    data = df.to_dict(orient='records')
    return jsonify(rows=data)


print(f"Environment: {app.config['ENV']}")
print(f"Debug: {app.config['DEBUG']}")

if __name__ == "__main__":
    app.run()
