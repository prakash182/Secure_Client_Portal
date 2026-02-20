import { useEffect, useState } from "react";
import API from "../services/api";
import FileCard from "../components/FileCard";

export default function Documents() {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    API.get("/documents").then((res) => setDocs(res.data));
  }, []);

  return (
    <div>
      {docs.map((doc) => (
        <FileCard key={doc.id} doc={doc} />
      ))}
    </div>
  );
}