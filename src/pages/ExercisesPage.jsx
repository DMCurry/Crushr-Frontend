import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../axiosInstance";
import "./Exercises.css";

function ExercisesPage() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]); // Stores all exercises from API
  const [filteredExercises, setFilteredExercises] = useState([]); // Stores filtered exercises
  const [searchQuery, setSearchQuery] = useState(""); // Stores the search input

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

  return (
    <div className="exercises-page">
      <h2>Exercises</h2>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search exercises..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-bar"
      />

      {/* Selected Exercise Details */}
      <div className="exercise-details">
        {filteredExercises.map((exercise, index) => (
          <div key={index} className="exercise">
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