import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import QABox from '../components/QABox';
import { analyzeDocument, translateTexts, exportChecklist as apiExportChecklist } from '../lib/api'; // Import API functions

const getRiskColor = (riskLevel) => {
  switch (riskLevel?.toLowerCase()) {
    case 'high': return '#e57373';
    case 'medium': return '#ffb74d';
    case 'low': return '#81c784';
    default: return '#bdbdbd';
  }
};

function Dashboard() {
  const [searchParams] = useSearchParams();
  const [originalDocData, setOriginalDocData] = useState(null);
  const [displayDocData, setDisplayDocData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openClauseId, setOpenClauseId] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const gcsUri = searchParams.get('gcs_uri');
  const mimeType = searchParams.get('mime_type');

  useEffect(() => {
    if (!gcsUri) {
      setLoading(false);
      return;
    }

    const doAnalyzeDocument = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await analyzeDocument(gcsUri, mimeType); // Use the imported function
        setOriginalDocData(data);
        setDisplayDocData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    doAnalyzeDocument();
  }, [gcsUri, mimeType]);

  const handleLanguageChange = async (e) => {
    const targetLang = e.target.value;
    if (targetLang === 'en') {
      setDisplayDocData(originalDocData);
      return;
    }
    if (!originalDocData) return;

    setIsTranslating(true);
    setError(null);

    try {
      const textsToTranslate = [
        ...originalDocData.summary,
        ...originalDocData.clauses.map(c => c.title),
        ...originalDocData.clauses.map(c => c.explanation),
        ...originalDocData.clauses.map(c => c.riskJustification)
      ];

      const { translated_texts } = await translateTexts(textsToTranslate, targetLang); // Use the imported function

      let currentIndex = 0;
      const translatedSummary = translated_texts.slice(currentIndex, currentIndex + originalDocData.summary.length);
      currentIndex += originalDocData.summary.length;
      
      const translatedClauses = originalDocData.clauses.map((clause) => {
        const title = translated_texts[currentIndex];
        const explanation = translated_texts[currentIndex + originalDocData.clauses.length];
        const riskJustification = translated_texts[currentIndex + (originalDocData.clauses.length * 2)];
        currentIndex++;
        return { ...clause, title, explanation, riskJustification };
      });
      
      setDisplayDocData({
        ...originalDocData,
        summary: translatedSummary,
        clauses: translatedClauses,
      });

    } catch (err) {
      setError(`Translation Error: ${err.message}`);
    } finally {
      setIsTranslating(false);
    }
  };
  
  const handleClauseToggle = (clauseId) => {
    setOpenClauseId(prevId => (prevId === clauseId ? null : clauseId));
  };

  const handleExportChecklist = async () => {
    if (!originalDocData?.originalText) return;
    try {
      await apiExportChecklist(originalDocData.originalText); 
    } catch (err) {
      setError(`Export failed: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="loader-container"><div className="loader"></div><p>Analyzing document...</p></div>;
  }
  
  if (error) {
    return <div className="page-container dashboard-page-container"><p className="upload-error">Error: {error}</p></div>;
  }
  
  if (!gcsUri || !displayDocData) {
    return (
      <div className="page-container dashboard-page-container">
        <div className="page-header"><h1>Dashboard</h1><p>Please upload a document to begin.</p></div>
      </div>
    );
  }

  return (
    <div className="page-container dashboard-page-container">
      <div className="page-header">
        <div>
          <h1>Document Analysis</h1>
          <p>Showing results for: <strong>{gcsUri.split('/').pop()}</strong></p>
        </div>
        <div className="header-controls">
          <select onChange={handleLanguageChange} disabled={isTranslating} className="language-selector">
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
          <button onClick={handleExportChecklist} className="export-button">
            Export Checklist
          </button>
        </div>
      </div>

      {isTranslating && <div className="translating-indicator">Translating...</div>}

      <div className="analysis-card">
        <h3>Summary</h3>
        <ul>{displayDocData.summary?.map((item, index) => <li key={index}>{item}</li>)}</ul>
      </div>
      
      <div className="analysis-card">
        <h3>Clause-by-Clause Analysis</h3>
        {displayDocData.clauses?.map(clause => (
          <div key={clause.id} className="clause-item">
            <div className="clause-title-container" onClick={() => handleClauseToggle(clause.id)}>
              <span className="clause-toggle-icon">{openClauseId === clause.id ? '▼' : '►'}</span>
              <span className="risk-indicator" style={{ backgroundColor: getRiskColor(clause.riskLevel) }}></span>
              <p className="clause-title">{clause.title}</p>
            </div>
            {openClauseId === clause.id && (
              <div className="clause-details">
                <p className="clause-explanation">{clause.explanation}</p>
                <p className="clause-justification"><strong>Risk Analysis:</strong> {clause.riskJustification}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="analysis-card">
        <h3>Ask a Question</h3>
        <QABox docText={originalDocData.originalText} />
      </div>
    </div>
  );
}

export default Dashboard;