function Summary() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>📝 AI-Generated Summary</h2>
      <p>
        This is where the simplified plain-language version of your uploaded
        legal document will appear.
      </p>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          marginTop: "1rem",
          borderRadius: "8px",
        }}
      >
        <p><strong>Clause 1:</strong> Example simplified explanation…</p>
        <p><strong>Clause 2:</strong> Example simplified explanation…</p>
      </div>
    </div>
  );
}

export default Summary;
