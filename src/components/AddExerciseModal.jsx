import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import Dropdown from "../components/TrainingPlanDropdown"; // Import the Dropdown component
import "./AddExerciseModal.css";


const NewExerciseModal = ({ isOpen, onClose, onSave, exercise }) => {
  const [formData, setFormData] = useState({
    exercise_name: "",
    reps: "",
    description: "",
  });
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [selectedTrainingPlanRequest, setSelectedTrainingPlanRequest] = useState([]);


  // Populate form when exercise data is provided (for updating)
  useEffect(() => {
    if (exercise) {
      setFormData({
        exercise_name: exercise.exercise_name || "",
        reps: exercise.reps || "",
        description: exercise.description || "",
      });
    } else {
      setFormData({ exercise_name: "", reps: "", description: "" });
    }
  }, [exercise, isOpen]); // Runs when exercise changes


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


  const setTrainingPlanItems = async (exerciseIds, trainingPlanId) => {
    const requestBody = {
      plan_id: trainingPlanId,
      item_ids: exerciseIds
    }
    setSelectedTrainingPlanRequest(requestBody);
};


  const handleSelectTrainingPlan = (selectedTrainingPlan) => {
    if (exercise && selectedTrainingPlan) {
      // First we want to make a new array tht has the existing exercise ids plus the current selected exercise's id
      const updatedExercises = [exercise.id, ...(selectedTrainingPlan?.exercises?.length ? selectedTrainingPlan.exercises.map(obj => obj.id) : [])]
      setTrainingPlanItems(updatedExercises, selectedTrainingPlan.id);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleSave = () => {
    onSave(formData, selectedTrainingPlanRequest);
    onClose();
  };


  if (!isOpen) return null;


  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{exercise ? "Edit Exercise" : "Add Exercise"}</h2>
        <div className="form-group">
          <label htmlFor="exercise_name">Name:</label>
          <input
            type="text"
            id="exercise_name"
            name="exercise_name"
            value={formData.exercise_name}
            onChange={handleChange}
            placeholder="Enter exercise name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="reps">Reps:</label>
          <input
            type="number"
            id="reps"
            name="reps"
            value={formData.reps}
            onChange={handleChange}
            placeholder="Enter number of reps"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter exercise description"
          />
        </div>
        <Dropdown
              plans={trainingPlans}
              onSelectTrainingPlanItems={handleSelectTrainingPlan}
            />
        <div className="modal-actions">
          <button onClick={handleSave} className="save-button">Save</button>
          <button onClick={onClose} className="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default NewExerciseModal;