from flask import Blueprint, request, jsonify
from google.cloud import translate_v2 as translate

translate_bp = Blueprint('translate_bp', __name__)
translate_client = translate.Client()

def translate_texts(texts_to_translate, target_language):
    """Core translation logic."""
    result = translate_client.translate(texts_to_translate, target_language=target_language)
    return [item['translatedText'] for item in result]

@translate_bp.route('/translate', methods=['POST'])
def translate_text():
    data = request.get_json()
    texts_to_translate = data.get("texts")  # list of strings
    target_language = data.get("target")

    if not texts_to_translate or not target_language:
        return jsonify({"error": "A list of texts and a target language are required"}), 400

    try:
        translated_texts = translate_texts(texts_to_translate, target_language)
        return jsonify({"translated_texts": translated_texts})
    except Exception as e:
        print(f"An error occurred during /translate: {e}")
        return jsonify({"error": f"An error occurred during translation: {str(e)}"}), 500
