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


@app.route('/api/data', methods=['GET'])
def get_results():
    data_file = Path(app.config['DATA']) / "test_data.xlsx"
    df = pd.read_excel(data_file)
    df['ligand_coverage'] = df['ligand_coverage'].apply(lambda x: f"{x:.0%}")
    df['ring_coverage'] = df['ring_coverage'].replace(np.nan, 'NaN')
    print("DataFrame after renaming headers:\n", df)
    data = df.to_dict(orient='records')
    return jsonify(rows=data)


print(f"Environment: {app.config['ENV']}")
print(f"Debug: {app.config['DEBUG']}")

if __name__ == "__main__":
    app.run()
