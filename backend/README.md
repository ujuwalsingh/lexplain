# Lexplain Backend

This is the backend service for **Lexplain**, responsible for handling document uploads, processing, and communication with ML models and external APIs (Google Cloud, etc.).

---

## 📂 Project Structure



backend/
│── app.py # Main Flask app entrypoint
│── requirements.txt # Python dependencies
│── venv/ # Virtual environment (not tracked in Git)
└── README.md # This file


---

## ⚙️ Setup Instructions

### 1. Create and activate virtual environment
```bash
# Create venv
python -m venv venv

# Activate (Windows PowerShell)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
.\venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

2. Install dependencies
pip install -r requirements.txt

3. Run the server
python app.py


You should see:

{ "message": "Lexplain backend is running 🚀" }


Server runs by default at:

http://127.0.0.1:5000/

🛠 API Endpoints (so far)

GET /

Health check endpoint

Returns: {"message": "Lexplain backend is running 🚀"}

🔮 Next Steps

Add routes for:

/upload → accept PDF/DOCX files

/process → send document to ML pipeline

/summarize → return plain-language summary

Integrate Google Cloud Document AI + Vertex AI

Secure API with authentication (later)

👩‍💻 Dev Notes

Always activate the venv before running commands.

Add new packages with pip install <package> and update requirements.txt:

pip freeze > requirements.txt


Keep endpoints modular inside routes/ (to be created soon).

