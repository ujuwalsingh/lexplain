from flask import Blueprint, request, jsonify

qa_bp = Blueprint("qa", __name__)

@qa_bp.route("/qa", methods=["POST"])
def qa():
    data = request.json
    question = data.get("question", "")
    # TODO: connect to embeddings + Gemini
    return jsonify({"answer": f"Mock answer to: {question}"})
