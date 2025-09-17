import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import QABox from '../components/QABox';

function Dashboard() {
  const [searchParams] = useSearchParams();
  const [docData, setDocData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openClauseId, setOpenClauseId] = useState(null);

  const gcsUri = searchParams.get('gcs_uri');
  const mimeType = searchParams.get('mime_type');

  useEffect(() => {
    if (!gcsUri || !mimeType) {
      setLoading(false);
      return;
    }

    const analyzeDocument = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://127.0.0.1:5001/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gcs_uri: gcsUri, mime_type: mimeType }),
        });

        if (!response.ok) {
          throw new Error('Failed to analyze document.');
        }
        
        const data = await response.json();
        setDocData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    analyzeDocument();
  }, [gcsUri, mimeType]);

  const handleClauseToggle = (clauseId) => {
    setOpenClauseId(prevId => (prevId === clauseId ? null : clauseId));
  };

  if (loading) {
    return <div className="page-container"><p>Analyzing document with AI...</p></div>;
  }

  if (error) {
    return <div className="page-container"><p className="upload-error">Error: {error}</p></div>;
  }
  
  if (!gcsUri) {
    return (
      <div className="page-container">
        <div className="page-header">
            <h1>Dashboard</h1>
            <p>Please upload a document first to see the analysis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Document Analysis</h1>
        <p>Showing results for: {gcsUri.split('/').pop()}</p>
      </div>

      <div className="dashboard-layout">
        <div className="dashboard-panel">
          <h2>Original Document</h2>
          <pre className="original-text-panel">{docData?.originalText}</pre>
        </div>

        <div className="dashboard-panel">
          <div className="analysis-card">
            <h3>Summary</h3>
            <ul>{docData?.summary.map((item, index) => <li key={index}>{item}</li>)}</ul>
          </div>
          
          <div className="analysis-card">
            <h3>Clause-by-Clause</h3>
            {docData?.clauses.map(clause => (
              <div key={clause.id} className="clause-item">
                <p className="clause-title" onClick={() => handleClauseToggle(clause.id)}>
                  {openClauseId === clause.id ? '▼' : '►'} {clause.title}
                </p>
                {openClauseId === clause.id && <p className="clause-explanation">{clause.explanation}</p>}
              </div>
            ))}
          </div>
          
          <div className="analysis-card">
            <h3>Ask a Question</h3>
            <QABox docId={gcsUri} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;