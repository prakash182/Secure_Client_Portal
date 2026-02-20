import { useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

export default function Upload() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    await API.post("/files/upload", formData);

    alert("File uploaded!");
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <h2>Upload File</h2>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={handleUpload}>
          Upload
        </button>
      </div>
    </div>
  );
}