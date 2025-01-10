import React, { useState, useEffect } from "react";
import axios from "axios";

function HomePage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000");
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