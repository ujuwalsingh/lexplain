// In frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';
import Summary from './pages/Summary';
import QA from './pages/QA';
import AppLayout from './components/AppLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/qa" element={<QA />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;