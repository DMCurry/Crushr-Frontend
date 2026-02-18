import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";


const LoginPage = ({ onAuthChange }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      await axiosInstance.post("/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      onAuthChange?.(true);
      navigate("/");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title/>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            style={{maxWidth: "400px", marginBottom: "10px"}}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            style={{maxWidth: "400px", marginBottom: "10px"}}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={handleSignupRedirect}
      >
        Create New Account
      </button>
    </div>
  );
};

export default LoginPage;