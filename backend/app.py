from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Lexplain backend is running 🚀"})

# --- Upload endpoint ---
@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    return jsonify({"message": "File uploaded successfully", "filename": file.filename})

# --- Summary endpoint (dummy for now) ---
@app.route("/summary", methods=["POST"])
def summary():
    data = request.get_json()
    filename = data.get("filename", "unknown document")

    # Later: run Document AI / Gemini here
    dummy_summary = [
        {"clause": "Clause 1", "explanation": "This clause defines parties involved."},
        {"clause": "Clause 2", "explanation": "This clause specifies payment terms."},
    ]

    return jsonify({"filename": filename, "summary": dummy_summary})

# --- Q&A endpoint (dummy for now) ---
@app.route("/qa", methods=["POST"])
def qa():
    data = request.get_json()
    question = data.get("question", "")

    # Later: RAG pipeline
    dummy_answer = f"This is a placeholder answer for: '{question}'"

    return jsonify({"answer": dummy_answer})

if __name__ == "__main__":
    app.run(debug=True)
