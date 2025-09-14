import { useState } from "react";

function Upload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }
    // Later: Send file to backend
    alert(`File "${file.name}" selected. Backend upload coming soon 🚀`);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📂 Upload Legal Document</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: "1rem" }}>
        Upload
      </button>
    </div>
  );
}

export default Upload;
