from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import PyPDF2
import docx

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ------------------------------
# Helpers
# ------------------------------
def extract_text_from_pdf(filepath):
    text = ""
    with open(filepath, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    return text.strip()

def extract_text_from_docx(filepath):
    doc = docx.Document(filepath)
    return "\n".join([p.text for p in doc.paragraphs if p.text.strip()])

def extract_text(filepath):
    if filepath.endswith(".pdf"):
        return extract_text_from_pdf(filepath)
    elif filepath.endswith(".docx"):
        return extract_text_from_docx(filepath)
    elif filepath.endswith(".txt"):
        with open(filepath, "r", encoding="utf-8") as f:
            return f.read()
    else:
        return None

# ------------------------------
# Routes
# ------------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Lexplain backend running 🚀"})

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    text = extract_text(filepath)
    if not text:
        return jsonify({"error": "Unsupported file type"}), 400

    return jsonify({"filename": file.filename, "extracted_text": text[:500] + "..."})

@app.route("/summary", methods=["POST"])
def summarize():
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Placeholder: just return first 3 sentences
    summary = " ".join(text.split(".")[:3]) + "..."
    return jsonify({"summary": summary})

@app.route("/qa", methods=["POST"])
def qa():
    data = request.get_json()
    question = data.get("question", "")
    text = data.get("text", "")

    if not question or not text:
        return jsonify({"error": "Question and text are required"}), 400

    # Placeholder: always return same canned response
    answer = f"For now, I can't fully answer '{question}', but soon this will use ML."
    return jsonify({"answer": answer})

# ------------------------------
# Run
# ------------------------------
if __name__ == "__main__":
    app.run(debug=True)
