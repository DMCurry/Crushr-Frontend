import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../axiosInstance";
import Dropdown from "../components/TrainingPlanDropdown"; // Import the Dropdown component
import './Calendar.css';


function TrainingPlanPage(){
  const navigate = useNavigate();
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [trainingPlanExercises, setTrainingPlanExercises] = useState([]);

  const handleSelectTrainingPlanExercises = (selectedTrainingPlanExercises) => {
    // Update exercises when a category is selected
    setTrainingPlanExercises(selectedTrainingPlanExercises);
  };

  useEffect( () => {
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

    fetchTrainingPlans();
  }, []);

  return (
    <div className="training-plan-page">
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

export default TrainingPlanPage;