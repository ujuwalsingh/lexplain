from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from google.cloud import documentai, storage
import vertexai
from vertexai.generative_models import GenerativeModel, Part

app = Flask(__name__)
CORS(app)

# --- CONFIGURATION ---
GCP_PROJECT_ID = "abc"
GCS_BUCKET_NAME = "abc"
DOCAI_PROCESSOR_ID = "abc"
DOCAI_LOCATION = "us"

# Initialize Google Cloud clients
storage_client = storage.Client(project=GCP_PROJECT_ID)
docai_client = documentai.DocumentProcessorServiceClient(
    client_options={"api_endpoint": f"{DOCAI_LOCATION}-documentai.googleapis.com"}
)

# Initialize Vertex AI
vertexai.init(project=GCP_PROJECT_ID, location=DOCAI_LOCATION)

# ------------------------------
# Helpers
# ------------------------------
def analyze_document_with_docai(gcs_uri, mime_type):
    """Processes a document using the Document AI API."""
    processor_name = docai_client.processor_path(
        GCP_PROJECT_ID, DOCAI_LOCATION, DOCAI_PROCESSOR_ID
    )
    request = documentai.ProcessRequest(
        name=processor_name,
        gcs_document=documentai.GcsDocument(gcs_uri=gcs_uri, mime_type=mime_type),
    )
    result = docai_client.process_document(request=request)
    return result.document.text

def generate_summary_with_gemini(text_content):
    """Generates a summary using the Gemini 1.5 Flash model."""
    model = GenerativeModel("gemini-1.5-flash-001")
    prompt = f"""
    You are an expert legal assistant. Provide a clear, concise, and easy-to-understand summary of the following legal document.
    Generate the summary as a list of key bullet points.

    **Document Text:**
    ---
    {text_content}
    ---

    **Summary (as bullet points):**
    """
    response = model.generate_content(prompt)
    summary_text = response.text.strip()
    summary_points = [point.strip().replace("* ", "") for point in summary_text.split('\n') if point.strip()]
    return summary_points

def generate_clause_explanations_with_gemini(text_content):
    """Identifies clauses and generates explanations for each using Gemini."""
    model = GenerativeModel("gemini-1.5-flash-001")
    
    prompt = f"""
    You are a specialized AI legal assistant. Your task is to analyze the provided legal document text, identify distinct clauses, and explain each one in simple, easy-to-understand language.

    **Instructions:**
    1.  Read through the entire document text.
    2.  Identify each individual clause or numbered section. A clause typically starts with a number, a roman numeral, or a heading like "Clause X:".
    3.  For each clause, provide a short, simple explanation of what it means.
    4.  Return the output as a single, valid JSON object. The object should have a single key "clauses" which is an array of objects.
    5.  Each object in the array must have three keys: "id" (a unique string, e.g., "c1", "c2"), "title" (the original title of the clause, e.g., "Clause 1: Definitions"), and "explanation" (your simplified explanation).

    **Example Output Format:**
    ```json
    {{
      "clauses": [
        {{
          "id": "c1",
          "title": "Clause 1: Introduction",
          "explanation": "This section introduces the parties involved in the agreement."
        }},
        {{
          "id": "c2",
          "title": "Clause 2: Term of Agreement",
          "explanation": "This explains how long the agreement will last."
        }}
      ]
    }}
    ```

    **Document Text to Analyze:**
    ---
    {text_content}
    ---

    **JSON Output:**
    """

    response = model.generate_content(prompt)
    
    # Clean up the response to extract only the JSON part
    response_text = response.text.strip()
    json_start = response_text.find('{')
    json_end = response_text.rfind('}') + 1
    json_string = response_text[json_start:json_end]
    
    try:
        data = json.loads(json_string)
        return data.get("clauses", [])
    except json.JSONDecodeError:
        # Handle cases where the model's output is not perfect JSON
        print("Error: Failed to decode JSON from Gemini response.")
        return [
            {"id": "error", "title": "Error Processing Clauses", "explanation": "The AI could not correctly parse the clauses from the document."}
        ]


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
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400
    try:
        bucket = storage_client.get_bucket(GCS_BUCKET_NAME)
        blob = bucket.blob(file.filename)
        blob.upload_from_string(file.read(), content_type=file.content_type)
        gcs_uri = f"gs://{GCS_BUCKET_NAME}/{file.filename}"
        return jsonify({"message": "File uploaded successfully.", "gcs_uri": gcs_uri, "mime_type": file.content_type})
    except Exception as e:
        return jsonify({"error": f"An error occurred during upload: {str(e)}"}), 500

@app.route("/analyze", methods=["POST"])
def analyze_document():
    data = request.get_json()
    gcs_uri = data.get("gcs_uri")
    mime_type = data.get("mime_type")

    if not gcs_uri or not mime_type:
        return jsonify({"error": "gcs_uri and mime_type are required"}), 400

    try:
        # Step 1: Extract text with Document AI
        extracted_text = analyze_document_with_docai(gcs_uri, mime_type)

        # Step 2: Generate a summary with Gemini
        summary_points = generate_summary_with_gemini(extracted_text)
        
        # Step 3: Generate clause-by-clause explanations with Gemini
        clauses = generate_clause_explanations_with_gemini(extracted_text)
        
        dashboard_data = {
          "summary": summary_points,
          "originalText": extracted_text,
          "clauses": clauses
        }
        
        return jsonify(dashboard_data)

    except Exception as e:
        # It's helpful to print the error to the backend console for debugging
        print(f"An error occurred during /analyze: {e}") 
        return jsonify({"error": f"An error occurred during analysis: {str(e)}"}), 500

# ------------------------------
# Run
# ------------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5001)