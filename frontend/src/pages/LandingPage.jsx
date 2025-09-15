// In frontend/src/pages/LandingPage.jsx
import React from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom'; // Import Router Link for the button

// --- ABOUT US SECTION ---
const AboutSection = () => (
  <div id="about" className="section">
    <div className="section-content">
      <h2 className="section-title">About Lexplain</h2>
      <p className="section-subtitle">Powered by Google's Advanced AI</p>
      <p className="about-text">
        At the heart of Lexplain is a large language model, trained by Google. My core purpose is to read, analyze, and deconstruct complex legal language. I can identify key clauses, summarize critical information, and rephrase dense text into plain, simple English. Think of me as your personal guide, empowering you to navigate your legal documents with confidence and clarity.
      </p>
    </div>
  </div>
);

// --- FEATURES SECTION ---
const FeaturesSection = () => {
    const features = [
    { title: "Instant Clarity", text: "Transform dense legal jargon into simple, easy-to-understand language in seconds. No more confusion, just clear insights." },
    { title: "Secure & Confidential", text: "Your documents are encrypted and processed with the highest level of security. We never store or share your sensitive data." },
    { title: "AI-Powered Summaries", text: "Instantly get the key points, obligations, and clauses of any document. Grasp the essentials without the heavy reading." },
    { title: "Cost-Effective", text: "Understand your documents thoroughly before seeking legal counsel, saving you significant time and expensive legal fees." },
    { title: "Ask Your Document", text: "Use our interactive Q&A to get immediate, AI-driven answers to any question you have about the uploaded document." },
    { title: "Accessible Anywhere", text: "Enjoy a seamless and responsive experience across all your devices, whether you're in the office or on the go." }
  ];

  return (
    <div id="features" className="section features-section">
      <div className="section-content">
        <h2 className="section-title">Why Choose Lexplain</h2>
        <p className="section-subtitle">Experience the future of document analysis with our premium features.</p>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- FOOTER SECTION ---
const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <p>&copy; 2025 Lexplain. All Rights Reserved.</p>
      <div className="footer-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </div>
    </div>
  </footer>
);


function LandingPage() {
  return (
    <>
      <nav className="navbar">
        <div className="nav-logo">LEXPLAIN</div>
        <ul className="nav-links">
          <li><ScrollLink to="hero" smooth={true} duration={500}>Home</ScrollLink></li>
          <li><ScrollLink to="about" smooth={true} duration={500} offset={-70}>About</ScrollLink></li>
          <li><ScrollLink to="features" smooth={true} duration={500} offset={-70}>Features</ScrollLink></li>
        </ul>
      </nav>

      <header id="hero" className="hero-section">
        <h1 className="hero-title">Welcome to Lexplain</h1>
        <p className="hero-subtitle">Your personal AI-powered legal guide. Simplify complex documents, get clear explanations, and ask questions with confidence.</p>
        {/* This button now links to the /upload page */}
        <RouterLink to="/upload" className="hero-button">
          Get Started
        </RouterLink>
      </header>

      <main>
        <AboutSection />
        <FeaturesSection />
      </main>
      
      <Footer />
    </>
  );
}

export default LandingPage;