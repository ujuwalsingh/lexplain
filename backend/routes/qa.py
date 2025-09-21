from flask import Blueprint, request, jsonify
from ml.embedding_service import generate_answer_with_gemini

qa_bp = Blueprint('qa_bp', __name__)

def answer_question(text_content, question):
    """Core logic to answer a question from given text."""
    return generate_answer_with_gemini(text_content, question)

@qa_bp.route('/qa', methods=['POST'])
def qa():
    data = request.get_json()
    question = data.get("question")
    text_content = data.get("textContent")

    if not question or not text_content:
        return jsonify({"error": "A question and the document text are required"}), 400

    try:
        answer = answer_question(text_content, question)
        return jsonify({"answer": answer})
    except Exception as e:
        print(f"An error occurred during /qa: {e}")
        return jsonify({"error": f"An error occurred while getting the answer: {str(e)}"}), 500
