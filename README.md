# Lexplain 📝⚖️
**Demystifying Legal Documents with AI**  

Lexplain is an AI-powered tool that simplifies complex legal documents into clear, plain language.  
It highlights obligations, deadlines, penalties, and risks — helping users understand their contracts without needing a law degree.  
⚠️ **Disclaimer:** Lexplain does *not* provide legal advice. Always consult a qualified lawyer for official guidance.  

---

## 🚀 Features
- 📄 **Upload & Parse**: Upload legal PDFs/Word docs for AI-powered analysis.  
- 🔎 **Simplification**: Clause-by-clause plain language summaries.  
- 📝 **Highlights**: Extract obligations, deadlines, penalties, parties.  
- 💬 **Interactive Q&A**: Ask questions, get answers with citations.  
- 📊 **Checklist Export**: Generate task lists from contract obligations.  
- 🌐 **Google Cloud AI**: Built with Document AI, Vertex AI (Gemini), Vector Search.  

---

## 🏗️ Tech Stack
**Frontend**  
- React + Tailwind (UI)  
- Firebase Hosting (optional for deployment)  

**Backend**  
- Node.js (Express)  
- Google Cloud Document AI (OCR, parsing)  
- Google Vertex AI (Gemini, embeddings, vector search)  
- Firestore / Cloud Storage  

**ML / AI Layer**  
- Document chunking + embeddings  
- RAG (Retrieval-Augmented Generation) with Gemini  
- Hallucination control via source citations  

**DevOps**  
- GitHub (repo & version control)  
- Cloud Run (serverless backend)  
- IAM & Cloud Security (compliance)  

---

## 📂 Repo Structure
lexplain/
│── backend/ # Node.js backend
│ ├── server.js
│ ├── routes/
│ ├── services/
│ └── package.json
│
│── frontend/ # React frontend
│ ├── src/
│ ├── public/
│ └── package.json
│
│── ml/ # AI/ML logic
│ ├── chunker.js
│ └── experiments/
│
│── docs/ # Diagrams, notes
│ ├── wireframes/
│ └── architecture.md
│
│── .gitignore
│── README.md

yaml
Copy code

---

## ⚡ Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/lexplain.git
cd lexplain
2. Backend Setup
bash
Copy code
cd backend
npm install
npm start
3. Frontend Setup
bash
Copy code
cd frontend
npm install
npm start
👥 Team Roles
Team Lead: Repo admin, merges, final integration.

Backend Engineer: APIs, Document AI integration.

Frontend Engineer: React UI, Q&A panel, dashboard.

ML Engineer: Chunking, embeddings, RAG logic.

Designer: Wireframes, mockups, UX polish.
