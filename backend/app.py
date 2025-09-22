import os
import re
from flask import Flask, jsonify, request
from flask_cors import CORS
from google.cloud import documentai

# --- IMPORT BLUEPRINTS ---
# Only import the blueprint objects you will actually use.
# summarize_bp is removed because its logic is now inside the /api/analyze route.
from routes.export import export_bp
from routes.translate import translate_bp
from routes.upload import upload_bp
from routes.qa import qa_bp

# --- IMPORT ML SERVICES ---
from ml.embedding_service import (
    generate_summary_with_gemini,
    generate_clause_explanations_with_gemini,
    generate_risk_scores_with_gemini
)

# --- FLASK APP SETUP ---
app = Flask(__name__)

# --- CORS CONFIGURATION ---
# This is a critical security change.
# It restricts access to your Vercel frontend and common local development servers.
origins_regex = re.compile(r"https?://(localhost:\d+|lexplain-three\.vercel\.app|.*--lexplain-three\.vercel\.app)")
CORS(app, origins=origins_regex, supports_credentials=True)

# --- GCP CONFIGURATION ---
# This is a critical production change.
# It loads configuration from secure environment variables instead of hardcoding them.
GCP_PROJECT_ID = os.environ.get("GCP_PROJECT_ID", "lexplain-472504")
DOCAI_PROCESSOR_ID = os.environ.get("DOCAI_PROCESSOR_ID", "19531a9534629747")
DOCAI_LOCATION = os.environ.get("DOCAI_LOCATION", "us")

# --- INITIALIZE GOOGLE CLOUD SERVICES ---
docai_client = documentai.DocumentProcessorServiceClient()

# --- REGISTER BLUEPRINTS WITH /api PREFIX ---
# This is a critical routing change for consistency.
# It makes all your API endpoints start with /api (e.g., /api/upload, /api/qa).
app.register_blueprint(upload_bp, url_prefix='/api/upload')
app.register_blueprint(qa_bp, url_prefix='/api/qa')
app.register_blueprint(export_bp, url_prefix='/api/export')
app.register_blueprint(translate_bp, url_prefix='/api/translate')


# --- HEALTH CHECK ROUTE ---
@app.route("/")
def home():
    """A simple route to confirm the backend is running."""
    return "Lexplain Backend is running!"


# --- CORE DOCUMENT ANALYSIS ROUTE ---
@app.route("/api/analyze", methods=["POST"])
def analyze_document():
    """Main endpoint to process a document from GCS and return a full analysis."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON in request body"}), 400

    gcs_uri = data.get("gcs_uri")
    mime_type = data.get("mime_type")

    if not gcs_uri or not mime_type:
        return jsonify({"error": "gcs_uri and mime_type are required fields"}), 400

    try:
        # Step 1: Extract document text with Document AI
        processor_name = docai_client.processor_path(GCP_PROJECT_ID, DOCAI_LOCATION, DOCAI_PROCESSOR_ID)
        docai_request = documentai.ProcessRequest(
            name=processor_name,
            gcs_document=documentai.GcsDocument(gcs_uri=gcs_uri, mime_type=mime_type),
        )
        result = docai_client.process_document(request=docai_request)
        extracted_text = result.document.text

        # Step 2: Generate summary and clause explanations with Gemini
        summary_points = generate_summary_with_gemini(extracted_text)
        clauses = generate_clause_explanations_with_gemini(extracted_text)

        # Step 3: Generate risk scores for each clause
        clauses_with_risk = generate_risk_scores_with_gemini(clauses)

        dashboard_data = {
            "summary": summary_points,
            "originalText": extracted_text,
            "clauses": clauses_with_risk
        }

        return jsonify(dashboard_data)

    except Exception as e:
        # This is a critical error handling change.
        # It logs the real error for you but sends a generic, safe message to the user.
        print(f"An error occurred during /api/analyze: {e}")
        return jsonify({"error": "An internal server error occurred during analysis."}), 500

# --- MAIN EXECUTION BLOCK ---
if __name__ == "__main__":
    # This is needed for deployment platforms like Render.
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

