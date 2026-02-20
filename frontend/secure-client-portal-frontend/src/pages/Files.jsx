import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import FileCard from "../components/FileCard";

export default function Files() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    API.get("/files").then((res) => {
      setFiles(res.data);
    });
  }, []);

  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <h2>Files</h2>

        <div className="cards">
          {files.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      </div>
    </div>
  );
}