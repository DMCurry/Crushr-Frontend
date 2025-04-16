// src/pages/UserSignupPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axiosInstance from "../axiosInstance";
import Title from "../components/Title";

const UserSignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      await axiosInstance.post("/users", formData);
      // Redirect to login page on success
      navigate("/");
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || "Signup failed.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title/>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            style={{maxWidth: "400px", marginBottom: "10px"}}
            type="text"
            name="username"
            minLength="3"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            style={{maxWidth: "400px", marginBottom: "10px"}}
            type="password"
            name="password"
            minLength="8"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            style={{maxWidth: "400px", marginBottom: "10px"}}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default UserSignupPage;