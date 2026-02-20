export default function Notification({ message }) {
  if (!message) return null;

  return (
    <div style={{ background: "lightgreen", padding: "10px" }}>
      {message}
    </div>
  );
}