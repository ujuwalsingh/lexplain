from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import PyPDF2
import docx

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


# ========== File Parsing Helpers ==========
def extract_text_from_pdf(filepath):
    text = ""
    with open(filepath, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            text += page.extract_text() or ""
    return text


def extract_text_from_docx(filepath):
    doc = docx.Document(filepath)
    return "\n".join([para.text for para in doc.paragraphs])


def extract_text_from_txt(filepath):
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()


# ========== Routes ==========
@app.route("/")
def home():
    return jsonify({"message": "Lexplain backend running 🚀"})


@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No filename provided"}), 400

    filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(filepath)

    # Extract text based on file type
    ext = file.filename.lower().split(".")[-1]
    extracted_text = ""

    if ext == "pdf":
        extracted_text = extract_text_from_pdf(filepath)
    elif ext == "docx":
        extracted_text = extract_text_from_docx(filepath)
    elif ext == "txt":
        extracted_text = extract_text_from_txt(filepath)
    else:
        return jsonify({"error": "Unsupported file type"}), 400

    return jsonify({
        "filename": file.filename,
        "extracted_text": extracted_text[:500]  # Preview first 500 chars
    })


# ✅ Start Flask server
if __name__ == "__main__":
    app.run(debug=True)
