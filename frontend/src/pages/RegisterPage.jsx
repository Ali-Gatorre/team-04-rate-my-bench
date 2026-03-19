import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser, setAuthToken } from "../services/api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  function handleAvatarChange(event) {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setSubmitting(true);

      const result = await registerUser({
        username: form.username,
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        bio: form.bio,
      });

      setAuthToken(result.token);

      // upload avatar viendra juste après dans l'étape suivante
      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h2>Create Account</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="first_name"
          placeholder="First name"
          value={form.first_name}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <input
          name="last_name"
          placeholder="Last name"
          value={form.last_name}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <textarea
          name="bio"
          placeholder="Short bio"
          value={form.bio}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        {avatarFile && (
          <p style={{ marginBottom: "10px" }}>
            Selected avatar: {avatarFile.name}
          </p>
        )}

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm password"
          value={form.confirmPassword}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create account"}
        </button>
      </form>

      <p style={{ marginTop: "16px" }}>
        Already have an account?{" "}
        <Link
          to="/login"
          style={{ fontWeight: "bold", textDecoration: "underline" }}
        >
          Click here
        </Link>
      </p>
    </div>
  );
}
