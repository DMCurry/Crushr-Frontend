import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axiosInstance from "../axiosInstance";
import Dropdown from "../components/TrainingPlanDropdown"; // Import the Dropdown component
import './Calendar.css';


function HomePage({ onAuthChange }) {
  const [data, setData] = useState([]);
  const [trainingPlans, setTrainingPlans] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate
  const [showModal, setShowModal] = useState(false); // To show/hide modal
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [trainingPlanExercises, setTrainingPlanExercises] = useState([]);


  // Check authentication status on mount
  const checkAuthStatus = async () => {
    try {
      await axiosInstance.get("/auth"); // An endpoint to verify authentication via JWT cookies
      onAuthChange(true);
      return true;
    } catch (error) {
      onAuthChange(false);
      return false;
    }
  };


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

  const fetchTrainingPlans = async () => {
    try {
      const response = await axiosInstance.get("/training-plan");
      setTrainingPlans(response.data);
      console.log(String(response.data));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Redirect to the login page if not authenticated
        navigate("/login");
      } 
      console.error("Error fetching training_exercises:", error);
    }
  };


  useEffect(() => {
    const initialize = async () => {
      const isAuthenticated = await checkAuthStatus();
      if (isAuthenticated) {
        await fetchData();
        await fetchTrainingPlans();
      }
      else {
        navigate("/login");
      }
    };

    initialize();
  }, []);


  const handleSelectTrainingPlanExercises = (selectedTrainingPlanExercises) => {
    // Update exercises when a category is selected
    setTrainingPlanExercises(selectedTrainingPlanExercises);
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
    {/* Dropdown to select exercise categories/keys */}
    <Dropdown plans={trainingPlans} onSelectTrainingPlanExercises={handleSelectTrainingPlanExercises} />

    {/* Display exercises once a category is selected */}
    <div className="exercises-list">
      {trainingPlanExercises.length > 0 ? (
        trainingPlanExercises.map((t_exercise) => (
          <div key={t_exercise.id} className="exercise-container">
            <p>{t_exercise.exercise_name}</p>
            <p>{t_exercise.description}</p>
            <p>Reps: {t_exercise.reps}</p>
          </div>
        ))
      ) : (
        <p>No exercises added for selected plan.</p>
      )}
    </div>
    </div>
  );
}

export default HomePage;