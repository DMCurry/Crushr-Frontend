import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../axiosInstance";
import NewExerciseModal from "../components/AddExerciseModal"; // Import the NewExerciseModal component
import "./Exercises.css";


function ExercisesPage() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]); // Stores all exercises from API
  const [filteredExercises, setFilteredExercises] = useState([]); // Stores filtered exercises
  const [selectedExercise, setSelectedExercise] = useState(null); // State var for select exercise
  const [searchQuery, setSearchQuery] = useState(""); // Stores the search input
  const [showModal, setShowModal] = useState(false); // To show/hide modal


  useEffect(() => {
    const fetchExercises = async () => {
      //const token = localStorage.getItem("jwt"); // Retrieve JWT from localStorage
      try {
        const response = await axiosInstance.get("/exercises");
        setExercises(response.data);
        setFilteredExercises(response.data); // Initially display all exercises
      } catch (error) {
        console.log("ERROR STATUS", error.response.status);
        if (error.response && error.response.status === 401) {
          // Redirect to the login page if not authenticated
          navigate("/login");
        } else {
          console.error("Error fetching exercises:", error);
        }
      }
    };

    fetchExercises();
  }, []);


  // Updates filteredExercises based on search input
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredExercises(
      exercises.filter((exercise) =>
        exercise.exercise_name.toLowerCase().includes(query)
      )
    );
  };


  // Open modal for editing an existing exercise
  const handleEditClick = (exercise) => {
    setSelectedExercise(exercise); // Pass existing exercise for editing
    setShowModal(true);
  };


  // Open modal for adding a new exercise
  const handleAddClick = () => {
      setSelectedExercise(null); // No exercise means adding a new one
      setShowModal(true);
    };


  const handleSaveExercise = async (data) => {
      try {
        if (selectedExercise) {
          // Make an API call to update the exercise
          data["id"] = selectedExercise.id; // Needs exercise id to update
          const update_response = await axiosInstance.put("/exercises", data);
          console.log("Saved Update Exercise Data:", update_response.data);
        }
        else {
          // Make an API call to add the exercise
          const add_response = await axiosInstance.post("/exercises", data);
          console.log("Saved Add Exercise Data:", add_response.data);
        }
        const get_response = await axiosInstance.get("/exercises");
        setExercises(get_response.data);
        setFilteredExercises(get_response.data);
      }
      catch(error){
        console.error("Error fetching data:", error);
      }
  };


  return (
    <div className="exercises-page">
      <h2>Exercises</h2>
      <button className="exercise-add-btn" onClick={() => handleAddClick()}> + </button>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search exercises..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-bar"
      />

      <NewExerciseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveExercise}
        exercise={selectedExercise}
      />

      {/* Selected Exercise Details */}
      <div className="exercise-details">
        {filteredExercises.map((exercise, index) => (
          <div key={index} className="exercise" onClick={() => handleEditClick(exercise)}>
            <h3>{exercise.exercise_name}</h3>
            <p><strong>Description:</strong> {exercise.description}</p>
            <p><strong>Reps:</strong> {exercise.reps}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExercisesPage;