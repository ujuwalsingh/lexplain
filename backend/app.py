from flask import Flask, jsonify, request
from flask_cors import CORS
from google.cloud import documentai
from routes.export import export_bp
from routes.translate import translate_bp

# Import blueprints from your routes
from routes.upload import upload_bp
from routes.qa import qa_bp

# Import ML services
from ml.embedding_service import (
    generate_summary_with_gemini, 
    generate_clause_explanations_with_gemini,
    generate_risk_scores_with_gemini
)

app = Flask(__name__)
CORS(app)

# --- CONFIGURATION ---
# We no longer need to initialize Vertex AI here
GCP_PROJECT_ID = "lexplain-472504" # Your new project ID
GCS_BUCKET_NAME = "lexplain-storage"
DOCAI_PROCESSOR_ID = "19531a9534629747"
DOCAI_LOCATION = "us" 


# --- INITIALIZE SERVICES ---
docai_client = documentai.DocumentProcessorServiceClient()


# --- REGISTER ROUTES (Blueprints) ---
app.register_blueprint(upload_bp)
app.register_blueprint(qa_bp)
app.register_blueprint(export_bp)
app.register_blueprint(translate_bp)


# --- CORE ANALYSIS ROUTE ---
@app.route("/analyze", methods=["POST"])
def analyze_document():
    data = request.get_json()
    gcs_uri = data.get("gcs_uri")
    mime_type = data.get("mime_type")

    if not gcs_uri or not mime_type:
        return jsonify({"error": "gcs_uri and mime_type are required"}), 400

    try:
        # Step 1: Extract text with Document AI
        processor_name = docai_client.processor_path(GCP_PROJECT_ID, DOCAI_LOCATION, DOCAI_PROCESSOR_ID)
        docai_request = documentai.ProcessRequest(
            name=processor_name,
            gcs_document=documentai.GcsDocument(gcs_uri=gcs_uri, mime_type=mime_type),
        )
        result = docai_client.process_document(request=docai_request)
        extracted_text = result.document.text

        # Step 2: Generate summary and clauses
        summary_points = generate_summary_with_gemini(extracted_text)
        clauses = generate_clause_explanations_with_gemini(extracted_text)
        
        # Step 3: Generate risk scores for the clauses
        clauses_with_risk = generate_risk_scores_with_gemini(clauses)
        
        dashboard_data = {
          "summary": summary_points,
          "originalText": extracted_text,
          "clauses": clauses_with_risk
        }
        
        return jsonify(dashboard_data)

    except Exception as e:
        print(f"An error occurred during /analyze: {e}") 
        return jsonify({"error": f"An error occurred during analysis: {str(e)}"}), 500


# --- RUN APPLICATION ---
if __name__ == "__main__":
    app.run(debug=True, port=5001)