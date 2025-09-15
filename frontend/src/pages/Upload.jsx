// In frontend/src/pages/Upload.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleUpload = async () => navigate('/dashboard?docId=new-doc-123');

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
          {loading ? 'Analyzing...' : 'Analyze Document'}
        </button>
        {error && <p className="upload-error">{error}</p>}
      </div>
    </div>
  );
}

export default Upload;