import os
import uuid
from flask import Blueprint, request, jsonify
from google.cloud import storage
from werkzeug.utils import secure_filename

# --- CONFIGURATION ---
GCP_PROJECT_ID = os.environ.get("GCP_PROJECT_ID", "lexplain-472504")
GCS_BUCKET_NAME = os.environ.get("GCS_BUCKET_NAME", "lexplain-storage")

# --- INITIALIZE SERVICES ---
storage_client = storage.Client(project=GCP_PROJECT_ID)

# --- BLUEPRINT SETUP ---
upload_bp = Blueprint('upload', __name__)

def upload_to_gcs(file_obj, filename, content_type):
    """Core logic to upload a file object to a GCS bucket."""
    bucket = storage_client.get_bucket(GCS_BUCKET_NAME)
    blob = bucket.blob(filename)
    blob.upload_from_file(file_obj, content_type=content_type)
    return f"gs://{GCS_BUCKET_NAME}/{filename}", content_type

@upload_bp.route("/", methods=["POST"])
def upload_file():
    """Handles file uploads, creating a secure, unique filename."""
    if "file" not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected for uploading"}), 400

    try:
        # Secure the filename and make it unique to prevent overwrites
        original_filename = secure_filename(file.filename)
        file_extension = os.path.splitext(original_filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"

        gcs_uri, mime_type = upload_to_gcs(file, unique_filename, file.content_type)
        
        return jsonify({
            "message": "File uploaded successfully to GCS.",
            "gcs_uri": gcs_uri,
            "mime_type": mime_type
        })
    except Exception as e:
        print(f"An error occurred during upload: {str(e)}")
        return jsonify({"error": "An internal server error occurred during file upload."}), 500
