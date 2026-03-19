import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, setAuthToken } from "../services/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      setSubmitting(true);

      const result = await loginUser({ login, password });
      setAuthToken(result.token);
      window.location.href="/";
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h2>Login</h2>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username or email"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ marginTop: "16px" }}>
        Don’t have an account?{" "}
        <Link to="/register" style={{ fontWeight: "bold", textDecoration: "underline" }}>
          Click here
        </Link>
      </p>
    </div>
  );
}
