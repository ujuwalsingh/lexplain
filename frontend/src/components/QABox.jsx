import { useState } from 'react';

function QABox({ docText }) { 
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setAnswer('');

    try {
      const response = await fetch('http://127.0.0.1:5001/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question,
          textContent: docText
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get an answer.');
      }
      
      const data = await response.json();
      setAnswer(data.answer);

    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qa-container">
      <div className="qa-input-container">
        <textarea
          className="qa-input"
          placeholder="e.g., What is the termination clause?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
        />
        <button 
          className="qa-button"
          onClick={handleAskQuestion} 
          disabled={loading || !question.trim()}
        >
          {loading ? '...' : 'Ask'}
        </button>
      </div>
      
      {error && <p className="upload-error" style={{marginTop: '10px'}}>{error}</p>}

      {answer && (
        <div className="qa-answer">
          <h4>Answer:</h4>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default QABox;