// In frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import QABox from '../components/QABox'; // We are bringing the QABox back

function Dashboard() {
  const [searchParams] = useSearchParams();
  const [docData, setDocData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openClauseId, setOpenClauseId] = useState(null);

  const docId = searchParams.get('docId');

  useEffect(() => {
    if (!docId) {
      // If no docId, show a helpful message instead of an error
      setLoading(false);
      return;
    }

    const fetchDocumentData = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network
        const mockData = {
          summary: ["This is a summary bullet point.", "The agreement is effective for two years.", "Penalties for late payment are 5%."],
          originalText: "Clause 1: Introduction...\n\nClause 2: Definitions...\n\nClause 3: Term of Agreement...\n\n... (rest of the document text)",
          clauses: [
            { id: 'c1', title: 'Clause 1: Introduction', explanation: 'This section introduces the parties involved.' },
            { id: 'c2', title: 'Clause 2: Definitions', explanation: 'This section defines key terms used in the document.' },
            { id: 'c3', title: 'Clause 3: Term of Agreement', explanation: 'This explains how long the agreement lasts.' },
          ]
        };
        setDocData(mockData);
      } catch (err) {
        setError('Failed to fetch document data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentData();
  }, [docId]);

  const handleClauseToggle = (clauseId) => {
    setOpenClauseId(prevId => (prevId === clauseId ? null : clauseId));
  };

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading document analysis...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <p className="upload-error">Error: {error}</p>
      </div>
    );
  }
  
  if (!docId) {
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
        <p>Showing results for document: {docId}</p>
      </div>

      <div className="dashboard-layout">
        {/* Left Pane: Original Document */}
        <div className="dashboard-panel">
          <h2>Original Document</h2>
          <pre className="original-text-panel">
            {docData?.originalText}
          </pre>
        </div>

        {/* Right Pane: AI Summary & Q&A */}
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
            <QABox docId={docId} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;