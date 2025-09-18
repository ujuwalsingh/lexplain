import { useContext } from 'react';
import { AnalysisContext } from '../context/AnalysisContext';

const formatNumber = (num) => new Intl.NumberFormat('en-IN').format(num);

const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return '#e57373';
      case 'medium': return '#ffb74d';
      case 'low': return '#81c784';
      default: return '#bdbdbd';
    }
};

function SummaryAnalysis() {
    const { docData } = useContext(AnalysisContext);

    if (!docData) return null;

    const wordCount = docData.originalText?.split(/\s+/).length || 0;
    const clauseCount = docData.clauses?.length || 0;
    const highRiskCount = docData.clauses?.filter(c => c.riskLevel?.toLowerCase() === 'high').length || 0;

    return (
        <>
            <div className="analysis-card stats-card">
                <div className="stat-item">
                    <span className="stat-value">{formatNumber(wordCount)}</span>
                    <span className="stat-label">Words</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{clauseCount}</span>
                    <span className="stat-label">Clauses Identified</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value" style={{ color: getRiskColor('high') }}>{highRiskCount}</span>
                    <span className="stat-label">High-Risk Clauses</span>
                </div>
            </div>
            <div className="analysis-card">
                <h3>AI Summary</h3>
                <ul>{docData.summary?.map((item, index) => <li key={index}>{item}</li>)}</ul>
            </div>
        </>
    );
}

export default SummaryAnalysis;