import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../axiosInstance";
import Dropdown from "../components/TrainingPlanDropdown";
import NewTrainingPlanModal from "../components/AddTrainingPlanModal";
import './TrainingPlan.css';


function TrainingPlanPage(){
  const navigate = useNavigate();
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [showModal, setShowModal] = useState(false); // To show/hide modal
  const [trainingPlanExercises, setTrainingPlanExercises] = useState([]);
  const [selectedTrainingPlan, setSelectedTrainingPlan] = useState(null); // State var for select exercise
  const [trainingPlanPerformanceTests, setTrainingPlanPerformanceTests] = useState([]);
  

  const handleSelectTrainingPlanItems = (selectedTrainingPlan) => {
    const exercises = selectedTrainingPlan ? selectedTrainingPlan.exercises : [];
    const performanceTests = selectedTrainingPlan ? selectedTrainingPlan.performance_tests : [];
    
    // Set the selected training plan passed to this handler function
    setSelectedTrainingPlan(selectedTrainingPlan);

    // Update exercises when a category is selected
    setTrainingPlanExercises(exercises);
    
    // Update performance tests when a category is selected
    setTrainingPlanPerformanceTests(performanceTests);
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


  const handleSaveTrainingPlan = async (data) => {
    try {
      if (selectedTrainingPlan) {
        // Make an API call to update the exercise
        data["plan_id"] = selectedTrainingPlan.id; // Needs training plan id to update
        const update_response = await axiosInstance.put("/training-plan", data);
        console.log("Saved Update TrainingPlan Data:", update_response.data);
      }
      else {
        // Make an API call to add the exercise
        const add_response = await axiosInstance.post("/training-plan", data);
        console.log("Saved Add Exercise Data:", add_response.data);
      }
      const get_response = await axiosInstance.get("/training-plan");
      setTrainingPlans(get_response.data);
    }
    catch(error){
      console.error("Error fetching or saving data:", error);
    }
  };


  // Open modal for editing an existing training plan
  const handleEditClick = () => {
    setShowModal(true);
  };


  // Open modal for adding a new training plan
  const handleAddClick = () => {
    setSelectedTrainingPlan(null); // No training plan means adding a new one
    setShowModal(true);
  }; 


  return (
    <div className="training-plan-page">
        <button className="training-plan-add-btn" onClick={() => handleAddClick()}> + </button>
        <button className="training-plan-edit-btn" onClick={() => handleEditClick()}> Edit </button>

        {/* Dropdown to select exercise categories/keys */}
        <Dropdown plans={trainingPlans} onSelectTrainingPlanItems={handleSelectTrainingPlanItems} />

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

        <NewTrainingPlanModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveTrainingPlan}
          trainingPlan={selectedTrainingPlan}
        />

        {/* Display performance tests once a category is selected */}
        <div className="peformance-test-list">
        {trainingPlanPerformanceTests.length > 0 ? (
            trainingPlanPerformanceTests.map((p_test) => (
            <div key={p_test.id} className="performance-test-container">
                <p>{p_test.test_name}</p>
                <p>{p_test.description}</p>
                <p>Performance Value: {p_test.performance_value}</p>
            </div>
            ))
        ) : (
            <p>No performance tests added for selected plan.</p>
        )}
        </div>
    </div>
  );
}

export default TrainingPlanPage;