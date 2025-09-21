import os
import google.generativeai as genai
import json
import re

# --- CONFIGURATION ---
# The library will automatically look for the API key in this environment variable.
# Ensure GEMINI_API_KEY is set in your Render environment.
try:
    genai.configure(api_key=os.environ["GEMINI_API_KEY"])
except KeyError:
    print("FATAL: GEMINI_API_KEY environment variable not set.")
    # You might want to exit or handle this more gracefully depending on your setup
    # For now, subsequent calls will fail, which is informative enough.

MODEL_NAME = "gemini-1.5-flash-latest"

# --- CORE FUNCTIONS ---

def generate_summary_with_gemini(text_content):
    """Generates a summary using the Gemini model with robust cleaning and error handling."""
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = f"""
        You are an expert legal assistant. Provide a clear, concise summary of the following legal document as 3 to 5 key bullet points. Do not use markdown formatting like asterisks for bolding.
        **Document Text:**
        ---
        {text_content}
        ---
        **Summary (as bullet points):**
        """
        response = model.generate_content(prompt)
        summary_text = response.text.strip()
        
        summary_points = []
        for point in summary_text.split('\n'):
            if point.strip():
                cleaned_point = re.sub(r'^\s*[\*\-\•]+\s*', '', point).strip().strip('*').strip()
                if cleaned_point:
                    summary_points.append(cleaned_point)
        return summary_points
    except Exception as e:
        print(f"Error generating summary with Gemini: {e}")
        return ["Error: Could not generate summary due to an API or processing issue."]


def generate_clause_explanations_with_gemini(text_content):
    """Generates clause explanations, ensuring output is valid JSON."""
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = f"""
        You are a specialized AI legal assistant. Analyze the provided legal document text, identify distinct clauses, and explain each one in simple language.
        Return the output as a single, valid JSON object with a single key "clauses" which is an array of objects.
        Each object must have "id", "title", and "explanation" keys.
        **Document Text to Analyze:**
        ---
        {text_content}
        ---
        **JSON Output:**
        """
        response = model.generate_content(prompt)
        response_text = response.text.strip().lstrip("```json").rstrip("```")
        data = json.loads(response_text)
        return data.get("clauses", [])
    except (json.JSONDecodeError, Exception) as e:
        print(f"Error decoding or getting clauses from Gemini: {e}")
        return [{"id": "error", "title": "Error Processing Clauses", "explanation": "Could not parse clauses from the model's response."}]


def generate_risk_scores_with_gemini(clauses):
    """Generates risk scores for a list of clauses."""
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        clauses_text_for_prompt = ""
        for clause in clauses:
            clauses_text_for_prompt += f"Clause ID: {clause['id']}\nTitle: {clause['title']}\n\n"

        prompt = f"""
        You are a legal risk assessment expert. For each clause in the provided list, assess its potential risk.
        **Instructions:**
        1. For each clause, assign a risk level: "Low", "Medium", or "High".
        2. For each clause, provide a brief, one-sentence justification.
        3. Return the output as a single, valid JSON object with a key "risk_assessments", which is an array of objects.
        4. Each object in the array must have three keys: "id", "risk_level", and "justification".
        **Clauses to Analyze:**
        ---
        {clauses_text_for_prompt}
        ---
        **JSON Output:**
        """
        response = model.generate_content(prompt)
        response_text = response.text.strip().lstrip("```json").rstrip("```")
        risk_data = json.loads(response_text)
        risk_assessments = {item['id']: item for item in risk_data.get('risk_assessments', [])}

        for clause in clauses:
            assessment = risk_assessments.get(clause['id'])
            if assessment:
                clause['riskLevel'] = assessment.get('risk_level', 'Unknown')
                clause['riskJustification'] = assessment.get('justification', 'No justification provided.')
            else:
                clause['riskLevel'] = 'Unknown'
                clause['riskJustification'] = 'Assessment not returned.'
        return clauses
    except (json.JSONDecodeError, Exception) as e:
        print(f"Error processing risk for clauses: {e}")
        for clause in clauses:
            clause['riskLevel'] = 'Error'
            clause['riskJustification'] = 'Failed to analyze risk due to an API or processing issue.'
        return clauses


def generate_answer_with_gemini(text_content, question):
    """Answers a question based on the provided text."""
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = f"""
        You are a helpful legal assistant. Answer a specific question based ONLY on the provided legal document text.
        If the answer is not found in the text, state that clearly. Provide a concise answer.
        **Document Text:**
        ---
        {text_content}
        ---
        **Question:**
        {question}
        **Answer:**
        """
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error generating answer with Gemini: {e}")
        return "Error: Could not get an answer due to an API issue."


def generate_checklist_with_gemini(text_content):
    """Generates a checklist from the text using the Gemini API."""
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = f"""
        You are an AI assistant specializing in legal document analysis. Your task is to extract an action checklist from the provided document text.
        **Instructions:**
        1.  Read the document and identify all key obligations, responsibilities, deadlines, and penalties.
        2.  Format these items into a clear, actionable checklist.
        3.  Group items by the responsible party if possible.
        **Document Text to Analyze:**
        ---
        {text_content}
        ---
        **Checklist:**
        """
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error generating checklist with Gemini: {e}")
        return "Error: Could not generate checklist due to an API issue."
