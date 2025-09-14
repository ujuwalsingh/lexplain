# Lexplain Frontend

This is the frontend for **Lexplain**, built with **React + Vite**.

---

## 🚀 Setup Instructions

### 1. Install dependencies

```bash
npm install
2. Run development server
bash
Copy code
npm run dev
Local dev server runs at:

arduino
Copy code
http://localhost:5173/
📂 Project Structure
csharp
Copy code
frontend/
│── public/           # Static assets
│── src/              # React source code
│   ├── App.jsx       # Main app
│   ├── main.jsx      # React entrypoint
│   └── components/   # UI components (to be added)
│── package.json      # Project metadata
└── README.md
🔮 Next Steps
Set up TailwindCSS for styling

Create basic wireframes:

Upload page (upload PDF/DOCX)

Document viewer (show original + simplified)

Q&A chat interface

Connect to backend API (/upload, /summarize)

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
```
