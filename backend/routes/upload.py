from flask import Blueprint, request, jsonify
from services import storage, docai

upload_bp = Blueprint("upload", __name__)

@upload_bp.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    filename = file.filename

    # Save to Cloud Storage
    gcs_path = storage.upload_file(file, filename)

    # Call Document AI
    parsed_text = docai.parse_document(gcs_path)

    return jsonify({
        "message": "File uploaded & parsed",
        "gcs_path": gcs_path,
        "parsed_text": parsed_text
    })
