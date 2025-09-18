from flask import Blueprint, request, jsonify
from google.cloud import storage
import os

# --- CONFIGURATION ---
# It's better to get these from a central config, but for now, this works.
GCP_PROJECT_ID = "svsgs"
GCS_BUCKET_NAME = "sggwg"

# Initialize Google Cloud Storage client
storage_client = storage.Client(project=GCP_PROJECT_ID)

upload_bp = Blueprint('upload_bp', __name__)

@upload_bp.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    try:
        bucket = storage_client.get_bucket(GCS_BUCKET_NAME)
        blob = bucket.blob(file.filename)
        
        # Upload the file from the request's file stream
        blob.upload_from_file(file)
        
        gcs_uri = f"gs://{GCS_BUCKET_NAME}/{file.filename}"
        
        return jsonify({
            "message": "File uploaded successfully to GCS.",
            "gcs_uri": gcs_uri,
            "mime_type": file.content_type
        })

    except Exception as e:
        print(f"An error occurred during upload: {str(e)}")
        return jsonify({"error": f"An error occurred during upload: {str(e)}"}), 500