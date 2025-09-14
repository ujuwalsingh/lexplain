function Dashboard() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>📊 Dashboard</h2>
      <p>Overview of uploaded documents and their simplified summaries.</p>
      <ul>
        <li>Contract_1.pdf – summarized ✅</li>
        <li>Agreement_2.pdf – pending ❌</li>
      </ul>
    </div>
  );
}

export default Dashboard;
