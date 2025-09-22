/**
 * This file centralizes all API communication for the Lexplain frontend.
 * It uses environment variables to dynamically set the backend URL,
 * ensuring it works seamlessly in both local development and production on Vercel.
 */

// --- CONFIGURATION ---

/**
 * The base URL for the backend API.
 * It reads the VITE_API_URL from Vite's environment variables.
 * If not found, it defaults to the local development server.
 *
 * *** THIS IS THE CORRECTED LINE FOR VITE ***
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// --- HELPER FUNCTION FOR API CALLS ---

/**
 * A generic helper to handle fetch requests and errors.
 * @param {string} endpoint - The API endpoint to call (e.g., '/api/upload').
 * @param {object} options - The options for the fetch request (method, headers, body).
 * @returns {Promise<any>} The JSON response from the server.
 */
const apiFetch = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    // Try to parse a JSON error message from the backend, otherwise use the status text.
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(errorData.error || 'An unknown API error occurred.');
  }

  // Handle cases where the response might not have a body (like a 204 No Content)
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  }
  // For file downloads or other non-json responses
  return response;
};


// --- API SERVICE FUNCTIONS ---

/**
 * Uploads a document to the backend.
 * @param {File} file - The file object to be uploaded.
 * @returns {Promise<{message: string, gcs_uri: string, mime_type: string}>}
 */
export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/upload/`, { // Added trailing slash for consistency
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'File upload failed.' }));
    throw new Error(errorData.error);
  }
  return response.json();
};

/**
 * Sends the GCS URI to the backend for full analysis.
 * @param {string} gcs_uri - The GCS URI returned from the upload step.
 * @param {string} mime_type - The mime type of the uploaded file.
 * @returns {Promise<object>} The full analysis object (summary, clauses, etc.).
 */
export const analyzeDocument = async (gcs_uri, mime_type) => {
  return apiFetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gcs_uri, mime_type }),
  });
};

/**
 * Asks a question about the document text.
 * @param {string} question - The user's question.
 * @param {string} textContent - The full text of the document.
 * @returns {Promise<{answer: string}>}
 */
export const askQuestion = async (question, textContent) => {
  return apiFetch('/api/qa/', { // Added trailing slash for consistency
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, textContent }),
  });
};

/**
 * Translates a list of texts to a target language.
 * @param {string[]} texts - An array of strings to translate.
 * @param {string} target - The target language code (e.g., 'es', 'fr', 'hi').
 * @returns {Promise<{translated_texts: string[]}>}
 */
export const translateTexts = async (texts, target) => {
  return apiFetch('/api/translate/', { // Added trailing slash for consistency
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texts, target }),
  });
};

/**
 * Requests the checklist for the document and triggers a download.
 * @param {string} textContent - The full text of the document.
 */
export const exportChecklist = async (textContent) => {
  try {
    const response = await apiFetch('/api/export/checklist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ textContent }),
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "Lexplain-Checklist.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to export checklist:", error);
    throw error;
  }
};