import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";

function HomePage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      {data ? <p>Data from backend: {data.message}</p> : <p>Loading...</p>}
    </div>
  );
}

export default HomePage;