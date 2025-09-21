from flask import Blueprint, jsonify
# You’ll likely want to use embedding_service later
# from ml.embedding_service import generate_summary_with_gemini

summarize_bp = Blueprint("summarize", __name__)

def summarize_text(text):
    """Core summarization logic (currently mocked)."""
    # return generate_summary_with_gemini(text)
    return "This is a mock summary for now."

@summarize_bp.route("/summarize", methods=["GET"])
def summarize():
    # Later: accept input, right now it’s just mock
    return jsonify({"summary": summarize_text("dummy text")})
