import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import Dropdown from "../components/TrainingPlanDropdown"; // Import the Dropdown component
import "./AddExerciseModal.css";


const NewExerciseModal = ({ isOpen, onDelete, onClose, onSave, exercise }) => {
  const [formData, setFormData] = useState({
    exercise_name: "",
    reps: "",
    sets: "",
    description: "",
  });
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [exerciseTrainingPlans, setExerciseTrainingPlans] = useState([]);
  const [selectedTrainingPlanRequest, setSelectedTrainingPlanRequest] = useState(null);


  // Populate form when exercise data is provided (for updating)
  useEffect(() => {
    if (exercise) {
      setFormData({
        exercise_name: exercise.exercise_name || "",
        reps: exercise.reps || "",
        sets: exercise.sets || "",
        description: exercise.description || "",
      });
      fetchExerciseTrainingPlans();
    } else {
      setFormData({ exercise_name: "", reps: "", sets: "", description: "" });
    }
  }, [exercise, isOpen]); // Runs when exercise changes


  useEffect( () => {
    const fetchTrainingPlans = async () => {
        try {
        const response = await axiosInstance.get("/training-plan");
        setTrainingPlans(response.data.plans);
        console.log(String(response.data));
        } catch (error) {
        if (error.response && error.response.status === 401) {
            // Redirect to the login page if not authenticated
            navigate("/login");
        } 
        console.error("Error fetching training plans:", error);
        }
    };

    fetchTrainingPlans();
  }, [isOpen]);


  const fetchExerciseTrainingPlans = async () => {
      try {
      const response = await axiosInstance.get("exercises/training-plans", {params: {exercise_id: exercise.id}});
      setExerciseTrainingPlans(response.data);
      console.log(String(response.data));
      } catch (error) {
      if (error.response && error.response.status === 401) {
          // Redirect to the login page if not authenticated
          navigate("/login");
      } 
      console.error("Error fetching exercise training plans:", error);
      }
  };


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
          <label htmlFor="sets">Sets:</label>
          <input
            type="number"
            id="sets"
            name="sets"
            value={formData.sets}
            onChange={handleChange}
            placeholder="Enter number of sets"
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
        {exerciseTrainingPlans.length > 0 && exercise && <p>Currently Added to:</p>}
        {exerciseTrainingPlans.length > 0 && exercise && (
          exerciseTrainingPlans.map((trainingPlan) => (
              <p>{trainingPlan.plan_name}</p>
          ))
        )}
        {exercise && 
          (<label htmlFor="training_plans">Add this Exercise to a Training Plan:</label>)
          &&
          (
            <Dropdown
              plans={trainingPlans}
              onSelectTrainingPlanItems={handleSelectTrainingPlan}
            />
          )
          
        }
        <div className="modal-actions">
          <button onClick={handleSave} className="save-button">Save</button>
          <button onClick={onDelete} className="delete-button">Delete</button>
          <button onClick={onClose} className="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default NewExerciseModal;