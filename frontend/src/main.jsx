import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AnalysisProvider } from './context/AnalysisContext.jsx'; // Import the provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AnalysisProvider>
      <App />
    </AnalysisProvider>
  </React.StrictMode>,
)