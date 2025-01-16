import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axiosInstance from "../axiosInstance";


function HomePage() {
  const [data, setData] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/");
        setData(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Redirect to the login page if not authenticated
          navigate("/login");
        } 
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div>
      <h1>Home Page</h1>
      {data ? <p>Data from backend: {data.message}</p> : <p>Loading...</p>}
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
        onClick={handleLoginRedirect}
      >
        Sign In
      </button>
    </div>
  );
}

export default HomePage;