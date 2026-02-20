export default function FileCard({ file }) {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="card">
      <h4>{file.name}</h4>
      <p>Status: {file.status}</p>

      {user?.role === "client" && file.status === "pending" && (
        <div>
          <button>Approve</button>
          <button>Request Changes</button>
        </div>
      )}
    </div>
  );
}