from flask import Flask, request, jsonify

app = Flask(__name__)

# Health check
@app.route("/")
def home():
    return jsonify({"message": "Lexplain backend is running 🚀"})

# Upload endpoint (for legal documents)
@app.route("/upload", methods=["POST"])
def upload():
    # for now, just return a dummy response
    return jsonify({"status": "success", "message": "File received"})

# Summarization endpoint
@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.json
    text = data.get("text", "")
    # placeholder
    summary = "This is where the simplified summary will go."
    return jsonify({"summary": summary})

# Q&A endpoint
@app.route("/qa", methods=["POST"])
def qa():
    data = request.json
    question = data.get("question", "")
    # placeholder
    answer = f"Answer for: {question}"
    return jsonify({"answer": answer})

if __name__ == "__main__":
    app.run(debug=True)
