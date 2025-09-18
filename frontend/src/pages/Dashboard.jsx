import { useEffect, useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnalysisContext } from '../context/AnalysisContext';
import QABox from '../components/QABox';
import ClauseAnalysis from '../components/ClauseAnalysis';
import SummaryAnalysis from '../components/SummaryAnalysis';

function Dashboard() {
  const [searchParams] = useSearchParams();
  const { setDocData, setLoading, setError, docData, loading, error } = useContext(AnalysisContext);
  const [activeTab, setActiveTab] = useState('summary'); // Controls which view is visible

  const gcsUri = searchParams.get('gcs_uri');
  const mimeType = searchParams.get('mime_type');

  useEffect(() => {
    // Only fetch data if we have a new document and no data is loaded yet
    if (gcsUri && !docData) {
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
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to analyze document.');
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
    } else if (!gcsUri) {
        setLoading(false);
    }
  }, [gcsUri, mimeType, setDocData, setLoading, setError, docData]);

  if (loading) {
    return (
      <div className="page-container loader-container">
        <div className="loader"></div>
        <p>Analyzing document with AI... This may take a moment.</p>
      </div>
    );
  }

  if (error) {
    return <div className="page-container"><p className="upload-error">Error: {error}</p></div>;
  }
  
  if (!gcsUri || !docData) {
    return (
      <div className="page-container">
        <div className="page-header">
            <h1>Dashboard</h1>
            <p>Please upload a document to begin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
        <div className="page-header">
            <div>
                <h1>Document Analysis</h1>
                <p>Showing results for: <strong>{gcsUri.split('/').pop()}</strong></p>
            </div>
        </div>
        <div className="dashboard-layout">
            <div className="dashboard-panel">
                <h2>Original Document</h2>
                <pre className="original-text-panel">{docData.originalText}</pre>
            </div>

            <div className="dashboard-panel">
                <div className="tabs">
                    <button onClick={() => setActiveTab('summary')} className={activeTab === 'summary' ? 'active' : ''}>Summary</button>
                    <button onClick={() => setActiveTab('clauses')} className={activeTab === 'clauses' ? 'active' : ''}>Clause Analysis</button>
                    <button onClick={() => setActiveTab('qa')} className={activeTab === 'qa' ? 'active' : ''}>Q&A</button>
                </div>

                <div className="tab-content">
                    {activeTab === 'summary' && <SummaryAnalysis />}
                    {activeTab === 'clauses' && <ClauseAnalysis />}
                    {activeTab === 'qa' && <QABox docText={docData.originalText} />}
                </div>
            </div>
        </div>
    </div>
  );
}

export default Dashboard;