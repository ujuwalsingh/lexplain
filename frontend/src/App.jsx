import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Upload from "./pages/Upload";
import Summary from "./pages/Summary";
import QA from "./pages/QA";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <nav style={{ padding: "1rem", background: "#eee" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>Dashboard</Link>
        <Link to="/upload" style={{ marginRight: "1rem" }}>Upload</Link>
        <Link to="/summary" style={{ marginRight: "1rem" }}>Summary</Link>
        <Link to="/qa">Q&A</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/qa" element={<QA />} />
      </Routes>
    </Router>
  );
}

export default App;
