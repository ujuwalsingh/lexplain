import { useState } from "react";

function QA() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);

  const handleAsk = () => {
    if (!question.trim()) return;
    // Later: Call backend Q&A endpoint
    setAnswer(`Dummy AI answer for: "${question}"`);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>❓ Ask Questions About the Document</h2>
      <input
        type="text"
        placeholder="Type your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{ width: "60%", padding: "0.5rem", marginRight: "1rem" }}
      />
      <button onClick={handleAsk}>Ask</button>

      {answer && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <p><strong>Answer:</strong> {answer}</p>
        </div>
      )}
    </div>
  );
}

export default QA;
