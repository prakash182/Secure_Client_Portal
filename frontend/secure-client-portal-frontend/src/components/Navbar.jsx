import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <div>
      <h2>Client Portal</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}