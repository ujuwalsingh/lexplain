from flask import Blueprint, request, jsonify
from google.cloud import translate_v2 as translate

translate_bp = Blueprint('translate', __name__)
translate_client = translate.Client()

@translate_bp.route('/', methods=['POST'])
def translate_text():
    data = request.get_json()
    texts_to_translate = data.get("texts")
    target_language = data.get("target")

    if not texts_to_translate or not target_language:
        return jsonify({"error": "A list of texts and a target language are required"}), 400

    try:
        result = translate_client.translate(texts_to_translate, target_language=target_language)
        translated_texts = [item['translatedText'] for item in result]
        return jsonify({"translated_texts": translated_texts})
    except Exception as e:
        print(f"An error occurred during /translate: {e}")
        return jsonify({"error": "An internal server error occurred during translation."}), 500
