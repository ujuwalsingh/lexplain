from flask import Blueprint, request, jsonify
from google.cloud import storage

GCP_PROJECT_ID = "lexplain-472504"
GCS_BUCKET_NAME = "lexplain-storage"
storage_client = storage.Client(project=GCP_PROJECT_ID)

upload_bp = Blueprint('upload_bp', __name__)

def upload_to_gcs(file_obj, filename, content_type):
    """Core upload logic."""
    bucket = storage_client.get_bucket(GCS_BUCKET_NAME)
    blob = bucket.blob(filename)
    blob.upload_from_file(file_obj)
    return f"gs://{GCS_BUCKET_NAME}/{filename}", content_type

@upload_bp.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    try:
        gcs_uri, mime_type = upload_to_gcs(file, file.filename, file.content_type)
        return jsonify({
            "message": "File uploaded successfully to GCS.",
            "gcs_uri": gcs_uri,
            "mime_type": mime_type
        })
    except Exception as e:
        print(f"An error occurred during upload: {str(e)}")
        return jsonify({"error": f"An error occurred during upload: {str(e)}"}), 500
