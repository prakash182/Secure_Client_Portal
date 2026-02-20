import { Link } from "react-router-dom";

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="sidebar">
      <h3>Client Portal</h3>

      <Link to="/dashboard">Dashboard</Link>

      {user?.role === "admin" && (
        <Link to="/upload">Upload File</Link>
      )}

      <Link to="/files">Files</Link>
    </div>
  );
}