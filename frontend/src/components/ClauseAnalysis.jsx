import { useContext, useState } from 'react';
import { AnalysisContext } from '../context/AnalysisContext';

const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return '#e57373';
      case 'medium': return '#ffb74d';
      case 'low': return '#81c784';
      default: return '#bdbdbd';
    }
};

function ClauseAnalysis() {
    const { docData } = useContext(AnalysisContext);
    const [openClauseId, setOpenClauseId] = useState(null);

    const handleClauseToggle = (clauseId) => {
        setOpenClauseId(prevId => (prevId === clauseId ? null : clauseId));
    };

    if (!docData) return null;

    return (
        <div className="analysis-card">
            <h3>Clause-by-Clause Analysis</h3>
            {docData.clauses?.map(clause => (
              <div key={clause.id} className="clause-item">
                <div className="clause-title-container" onClick={() => handleClauseToggle(clause.id)}>
                  <span className="clause-toggle-icon">
                    {openClauseId === clause.id ? '▼' : '►'}
                  </span>
                  <span 
                    className="risk-indicator" 
                    style={{ backgroundColor: getRiskColor(clause.riskLevel) }}
                    title={`Risk Level: ${clause.riskLevel}`}
                  ></span>
                  <p className="clause-title">{clause.title}</p>
                </div>
                
                {openClauseId === clause.id && (
                  <div className="clause-details">
                    <p className="clause-explanation">{clause.explanation}</p>
                    <p className="clause-justification">
                      <strong>Risk Analysis:</strong> {clause.riskJustification}
                    </p>
                  </div>
                )}
              </div>
            ))}
        </div>
    );
}

export default ClauseAnalysis;