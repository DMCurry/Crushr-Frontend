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
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [currentDay, setCurrentDay] = useState(null);
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
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Redirect to the login page if not authenticated
        navigate("/login");
      } 
      console.error("Error fetching training_exercises:", error);
    }
  };


  const handleSelectTrainingPlanExercises = (selectedTrainingPlanExercises) => {
    // Update exercises when a category is selected
    setTrainingPlanExercises(selectedTrainingPlanExercises);
  };


  const handleAddExercise = (day) => {
    setCurrentDay(day);
    setAddModalOpen(true);
  };


  const handleExerciseSelect = (exercise) => {
    if (!currentDay || !exercise) return;

    console.log(exercise);
    // Update state with the new exercise
    const updatedData = { ...data };
    updatedData.data[currentDay] = updatedData.data[currentDay] || [];
    var add_exercise = {}
    add_exercise["exercise_id"] = exercise.id
    add_exercise["exercise_name"] = exercise.exercise_name
    add_exercise["exercise_description"] = exercise.description
    add_exercise["exercise_reps"] = exercise.reps
    const exists = updatedData.data[currentDay].some((obj) => obj.exercise_id === add_exercise.exercise_id)
    console.log(exists);
    console.log(updatedData.data[currentDay]);
    console.log(add_exercise.exercise_id);
    if (!exists) {
      updatedData.data[currentDay].push(add_exercise);
      setData(updatedData);

      setAddModalOpen(false); // Close the modal
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


  const handleExerciseClick = (exercise, day) => {
    setSelectedExercise(exercise);
    setCurrentDay(day);
    setShowModal(true); // Show the modal when clicked
  };


  const closeModal = () => {
    setShowModal(false); // Close the modal
    setSelectedExercise(null); // Reset the selected exercise
  };


  const handleSaveScheduleDataClick = async () => {
    try {
      // Make an API call to update the server
      const response = await axiosInstance.put("/schedule", data);
      setData(response.data);
    }
    catch(error){
      console.error("Error fetching data:", error);
    }
  };


  const removeExerciseFromDay = (exercise) => {
    const updatedData = { ...data };
    updatedData.data[currentDay] = updatedData.data[currentDay] || [];
    console.log("test");
    console.log(exercise);
    console.log(updatedData.data[currentDay]);
    updatedData.data[currentDay] = updatedData.data[currentDay].filter((obj) => obj.exercise_id !== exercise.exercise_id);
    setData(updatedData);
    console.log(updatedData.data[currentDay]);
    setShowModal(false); // Close the modal
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
                  <button
                    className="add-exercise-btn"
                    onClick={() => handleAddExercise(day)}
                  >
                    +
                  </button>
                  {dayData && dayData.length > 0 ? (
                    dayData.map((exercise) => (
                      <div
                        key={exercise.exercise_id}
                        className="exercise-container"
                        onClick={() => handleExerciseClick(exercise, day)}
                      >
                        <p>{exercise.exercise_name}</p>
                      </div>
                    ))
                  ) : (
                    <p>No Exercises</p>
                  )}
                </div>
              );
            })}
          <button className="save-schedule-btn" onClick={() => handleSaveScheduleDataClick()}>Save Schedule</button>

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
            <button className="remove-exercise-btn" onClick={() => removeExerciseFromDay(selectedExercise)}>Remove Exercise</button>
          </div>
        </div>
      )}
      {addModalOpen && (
        <div className="add-modal">
          <div className="add-modal-content">
            <h3>Add Exercise to {currentDay}</h3>
            <Dropdown
              plans={trainingPlans}
              onSelectTrainingPlanExercises={handleSelectTrainingPlanExercises}
            />
            <button onClick={() => setAddModalOpen(false)}>Close</button>
          </div>
                  {/* Display exercises once a category is selected */}
          <div className="exercises-list">
          {trainingPlanExercises.length > 0 ? (
              trainingPlanExercises.map((t_exercise) => (
              <div key={t_exercise.id} 
              className="exercise-container" 
              onClick={() => handleExerciseSelect(t_exercise)}>
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
      )}
    </div>
    </div>
  );
}

export default HomePage;