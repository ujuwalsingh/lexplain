from flask import Blueprint, request, jsonify, Response
from ml.embedding_service import generate_checklist_with_gemini

export_bp = Blueprint('export_bp', __name__)

def generate_checklist(text_content):
    """Core checklist generation logic."""
    return generate_checklist_with_gemini(text_content)

@export_bp.route('/export-checklist', methods=['POST'])
def export_checklist():
    data = request.get_json()
    text_content = data.get("textContent")

    if not text_content:
        return jsonify({"error": "Document text is required"}), 400

    try:
        checklist_text = generate_checklist(text_content)
        return Response(
            checklist_text,
            mimetype="text/plain",
            headers={"Content-disposition": "attachment; filename=checklist.txt"}
        )
    except Exception as e:
        print(f"An error occurred during /export-checklist: {e}")
        return jsonify({"error": f"An error occurred while generating the checklist: {str(e)}"}), 500
