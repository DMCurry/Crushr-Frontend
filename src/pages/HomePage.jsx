import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axiosInstance from "../axiosInstance";
import './Calendar.css';


function HomePage() {
  const [data, setData] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate
  const [showModal, setShowModal] = useState(false); // To show/hide modal
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/schedule");
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

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
    setShowModal(true); // Show the modal when clicked
  };

  const closeModal = () => {
    setShowModal(false); // Close the modal
    setSelectedExercise(null); // Reset the selected exercise
  };

  return (
    <div>
      <div className="calendar-container">
      {data ? (
        data.data ? (
          <div className="calendar-grid">
            {Object.keys(data.data).map((day) => {
              const dayData = data.data[day];  // This will be an array or null
              return (
                <div key={day} className="calendar-day">
                  <h3>{day}</h3>
                  {dayData && dayData.length > 0 ? (
                    dayData.map((exercise) => (
                      <div
                        key={exercise.exercise_id}
                        className="exercise-container"
                        onClick={() => handleExerciseClick(exercise)}
                      >
                        <p>{exercise.exercise_name}</p>
                      </div>
                    ))
                  ) : (
                    <p>No data available</p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p>No data available</p>
        )
      ) : (
        <p>Loading...</p>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedExercise ? `${selectedExercise.exercise_name}` : ""}</h2>
            <p>{selectedExercise.exercise_description}</p>
            <p>Reps: {selectedExercise.exercise_reps}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
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