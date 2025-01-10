import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Exercises.css";

function ExercisesPage() {
  const [exercises, setExercises] = useState([]); // Stores all exercises from API
  const [filteredExercises, setFilteredExercises] = useState([]); // Stores filtered exercises
  const [searchQuery, setSearchQuery] = useState(""); // Stores the search input

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/exercises"); // Replace with your API endpoint
        setExercises(response.data);
        setFilteredExercises(response.data); // Initially display all exercises
      } catch (error) {
        console.error("Error fetching exercises data:", error);
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