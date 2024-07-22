from pathlib import Path

from flask import Flask, jsonify, request, make_response, send_from_directory
import os
from dotenv import load_dotenv
import logging
import pandas as pd
from flask_cors import CORS, cross_origin

load_dotenv()

app = Flask(__name__)
environment_configuration = os.environ['CONFIGURATION_SETUP']
app.config.from_object(environment_configuration)

CORS(app)

# Setup logging
logging.basicConfig(level=logging.DEBUG)

# Sample data for the jobID "1234job"
sample_data = {
    "tablejson": [
        {'Ligand_name': 'S02', 'Ring_ID': 'S02_1cs7_4', 'CHAIR': 0.243, 'FLAT': 0.009, 'MinValue': 0.009,
         'Conformation': 'FLAT', 'Entry ID': '1CS7', 'Experimental Method': 'X-RAY DIFFRACTION', 'Release Date': 2001,
         'Resolution (A)': 3.2, 'Coverage': 'nan'},
    ]
}


@app.route('/api/conf-comparer/results/<job_id>', methods=['GET'])
def get_results(job_id):
    if job_id == "1234job":
        path = Path(app.config['EXCEL_FILE_PATH']) / "cyclohex_result_summary.xlsx"
        df = pd.read_excel(str(path), sheet_name='Summary')
        columns = df.columns.tolist()
        data = df.to_dict(orient='records')
        result = {
            "columns": columns,
            "tablejson": data
        }
        return jsonify(sample_data)
    else:
        return jsonify({"error": "Job ID not found"}), 404


@app.route("/")
def get_hello_world():
    logging.info('GET request received at /')
    return {'hello': 'world'}


@cross_origin()
@app.route('/download-excel', methods=['GET'])
def download_excel():
    try:
        excel_file_path = app.config['EXCEL_FILE_PATH']
        return send_from_directory(excel_file_path, "cyclohex_result_summary.xlsx", as_attachment=True, max_age=0)

    except FileNotFoundError:
        logging.error("Excel file not found")
        return jsonify({'error': 'Excel file not found'}), 404

    except Exception as e:
        logging.error(f"Failed to download Excel file: {str(e)}")
        return jsonify({'error': 'Failed to download Excel file'}), 500


print(f"Environment: {app.config['ENV']}")
print(f"Debug: {app.config['DEBUG']}")

if __name__ == "__main__":
    app.run()
