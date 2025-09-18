import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null); // Clear previous errors
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadResponse = await fetch('http://127.0.0.1:5001/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        // Try to get a specific error message from the backend
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'File upload failed.');
      }

      const uploadResult = await uploadResponse.json();
      
      const searchParams = new URLSearchParams({
        gcs_uri: uploadResult.gcs_uri,
        mime_type: uploadResult.mime_type
      });
      navigate(`/dashboard?${searchParams.toString()}`);

    } catch (err) {
      // Now, this will display either our custom error or a default one
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h2>Upload Your Document</h2>
        <p>Select a PDF or Word document to begin the analysis.</p>
        <div className="upload-input-area">
          <input type="file" id="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
          <label htmlFor="file" className="upload-label">
            {file ? file.name : 'Choose a file...'}
          </label>
        </div>
        <button onClick={handleUpload} disabled={loading || !file} className="upload-button">
          {loading ? 'Processing...' : 'Analyze Document'}
        </button>
        {error && <p className="upload-error">{error}</p>}
      </div>
    </div>
  );
}

export default Upload;