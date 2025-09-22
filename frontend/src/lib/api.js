/**
 * This file centralizes all API communication for the Lexplain frontend.
 * It uses environment variables to dynamically set the backend URL,
 * ensuring it works seamlessly in both local development and production on Vercel.
 */

// --- CONFIGURATION ---

/**
 * The base URL for the backend API.
 * 1. It first tries to read the environment variable `VITE_API_URL` which you set on Vercel.
 * 2. If it's not found (meaning we are likely in a local development environment),
 * it defaults to 'http://localhost:5000'.
 *
 * IMPORTANT: If you used a different framework (like Next.js), change the variable name accordingly
 * (e.g., process.env.NEXT_PUBLIC_API_URL).
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

  // Note: We use fetch directly here because apiFetch is tailored for JSON.
  // The browser automatically sets the correct 'Content-Type' for FormData.
  const response = await fetch(`${API_BASE_URL}/api/upload`, {
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
  return apiFetch('/api/qa', {
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
  return apiFetch('/api/translate', {
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
    // *** THIS IS THE CORRECTED LINE ***
    const response = await apiFetch('/api/export/checklist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ textContent }),
    });

    // The response body is the text file content itself.
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "Lexplain-Checklist.txt"; // The filename for the download
    document.body.appendChild(a);
    a.click();
    a.remove(); // Clean up the DOM
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to export checklist:", error);
    // You might want to show an error message to the user here.
    throw error;
  }
};