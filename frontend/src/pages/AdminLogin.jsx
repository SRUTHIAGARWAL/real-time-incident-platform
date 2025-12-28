import { useState } from "react";
import axios from "axios";

const API = "https://incident-backend-q009.onrender.com";


export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    try {
      const res = await axios.post(`${API}/api/admin/login`, {
        email,
        password,
      });
      localStorage.setItem("adminToken", res.data.token);
      onLogin();
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "auto", padding: 20 }}>
      <h2>Admin Sign In</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={input}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={input}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={login} style={button}>
        Sign In
      </button>
    </div>
  );
}

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
};

const button = {
  width: "100%",
  padding: 12,
  background: "#d32f2f",
  color: "white",
  border: "none",
};
