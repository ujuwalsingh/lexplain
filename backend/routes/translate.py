from flask import Blueprint, request, jsonify
from google.cloud import translate_v2 as translate
import os

translate_bp = Blueprint('translate_bp', __name__)

# Initialize the Translation client
# This will automatically use the same GOOGLE_APPLICATION_CREDENTIALS key you have set
translate_client = translate.Client()

@translate_bp.route('/translate', methods=['POST'])
def translate_text():
    data = request.get_json()
    texts_to_translate = data.get("texts") # We expect a list of strings
    target_language = data.get("target")

    if not texts_to_translate or not target_language:
        return jsonify({"error": "A list of texts and a target language are required"}), 400

    try:
        # The API can translate a list of strings in a single, efficient call
        result = translate_client.translate(texts_to_translate, target_language=target_language)
        
        # The result is a list of dictionaries, we just want the translated text from each
        translated_texts = [item['translatedText'] for item in result]
        
        return jsonify({"translated_texts": translated_texts})

    except Exception as e:
        print(f"An error occurred during /translate: {e}")
        return jsonify({"error": f"An error occurred during translation: {str(e)}"}), 500