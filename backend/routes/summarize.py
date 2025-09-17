from flask import Blueprint, jsonify

summarize_bp = Blueprint("summarize", __name__)

@summarize_bp.route("/summarize", methods=["GET"])
def summarize():
    # TODO: connect to Gemini summarization
    return jsonify({"summary": "This is a mock summary for now."})
