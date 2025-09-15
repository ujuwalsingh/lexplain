// In frontend/src/components/QABox.jsx
import { useState } from 'react';

function QABox({ docId }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAsk = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    setAnswer(null);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockAnswer = {
        answer: `This is the AI's answer to your question: "${question}".`,
        citations: [{ text: "This is the original text from the document used for the answer." }]
      };
      setAnswer(mockAnswer);
    } catch (err) {
      setError('Failed to get an answer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Type your question..."
        className="qabox-input"
        disabled={loading}
      />
      <button onClick={handleAsk} disabled={loading} className="qabox-button">
        {loading ? '...' : 'Ask'}
      </button>

      {error && <p className="upload-error">{error}</p>}

      {answer && (
        <div className="qabox-answer">
          <p>{answer.answer}</p>
          <div className="qabox-source">
            <p><strong>Source:</strong> "{answer.citations[0].text}"</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default QABox;