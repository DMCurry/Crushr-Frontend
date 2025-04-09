import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../axiosInstance";
import Dropdown from "../components/TrainingPlanDropdown";
import NewTrainingPlanModal from "../components/AddTrainingPlanModal";
import './TrainingPlan.css';


function TrainingPlanPage(){
  const navigate = useNavigate();
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [showModal, setShowModal] = useState(false); // To show/hide training plan modal
  const [showRemoveModal, setShowRemoveModal] = useState(false); // To show/hide remove item modal
  const [addClicked, setAddClicked] = useState(false);
  const [trainingPlanExercises, setTrainingPlanExercises] = useState([]);
  const [selectedTrainingPlan, setSelectedTrainingPlan] = useState(null); // State var for select exercise
  const [trainingPlanPerformanceTests, setTrainingPlanPerformanceTests] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedPerformanceTest, setSelectedPerformanceTest] = useState(null);
  
  

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
        setTrainingPlans(response.data.plans);
        console.log(String(response.data.plans));
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
      if (selectedTrainingPlan && !addClicked) {
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
      setTrainingPlans(get_response.data.plans);
      setAddClicked(false);
    }
    catch(error){
      console.error("Error fetching or saving data:", error);
    }
  };


  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
    setShowRemoveModal(true);
  };


  const handlePerformanceTestClick = (pTest) => {
    setSelectedPerformanceTest(pTest);
    setShowRemoveModal(true);
  };


  const removeItem = async (item, type) => {
    try {
      var removeItem = {};
      removeItem["item_id"] = item.id;
      removeItem["plan_id"] = selectedTrainingPlan.id;
      removeItem["item_type"] = type;
      const remove_response = await axiosInstance.put("/training-plan/remove-item", removeItem);
      console.log("Removed Item from Training Plan:", remove_response.data);

      const get_response = await axiosInstance.get("/training-plan");
      setTrainingPlans(get_response.data.plans);
    }
    catch(error){
      console.error("Error fetching or saving data:", error);
    }
    setShowRemoveModal(false); // Close the modal
    setSelectedExercise(null); // De-select the exercise
    setSelectedPerformanceTest(null) // De-select the performance test
    navigate("/temp"); // Navigate to a temporary fake route
    setTimeout(() => navigate("/training-plans"), 0); // Quickly go back to refresh page without losing jwt
  };


  // Open modal for editing an existing training plan
  const handleEditClick = () => {
    setShowModal(true);
  };

  const handleDeleteClick = async () => {
    try {
      var deleteItem = {};
      deleteItem["training_plan_id"] = selectedTrainingPlan.id;
      const delete_response = await axiosInstance.delete("/training-plan", {params: deleteItem});
      console.log("Delete Training Plan:", delete_response.status);
    }
    catch(error){
      console.error("Error fetching or saving data:", error);
    }
    const get_response = await axiosInstance.get("/training-plan");
    setTrainingPlans(get_response.data.plans);
    navigate("/");
  };


  // Open modal for adding a new training plan
  const handleAddClick = () => {
    setShowModal(true);
    setAddClicked(true);
  }; 


  const handleClose = () => {
    setShowModal(false);
    setAddClicked(false);
  };


  const closeRemoveModal = () => {
    setShowRemoveModal(false); // Close the modal
    setSelectedExercise(null); // Reset the selected exercise
  };


  return (
    <div className="training-plan-page">
        <button className="training-plan-add-btn" onClick={() => handleAddClick()}/>
        {selectedTrainingPlan && (<button className="training-plan-edit-btn" onClick={() => handleEditClick()}/>)}
        {selectedTrainingPlan && (<button className="training-plan-delete-btn" onClick={() => handleDeleteClick()}/>)}

        {/* Dropdown to select exercise categories/keys */}
        <Dropdown plans={trainingPlans} onSelectTrainingPlanItems={handleSelectTrainingPlanItems} />

        {/* Display exercises once a category is selected */}
        <div className="exercises-list">
        {trainingPlanExercises.length > 0 ? (
            trainingPlanExercises.map((t_exercise) => (
            <div key={t_exercise.id} className="exercise-container" onClick={() => handleExerciseClick(t_exercise)}>
                <p>{t_exercise.exercise_name}</p>
                <p>{t_exercise.exercise_description}</p>
                <p>Reps: {t_exercise.exercise_reps}</p>
                <p>Sets: {t_exercise.exercise_sets}</p>
                <p>Media Link: {t_exercise.exercise_link ? <a href={`${t_exercise.exercise_link}`}>Link</a> : "N/A"}</p>
            </div>
            ))
        ) : (
            <p>No exercises added for selected plan.</p>
        )}
        </div>

        <NewTrainingPlanModal
          isOpen={showModal}
          onClose={handleClose}
          onSave={handleSaveTrainingPlan}
          trainingPlan={selectedTrainingPlan}
          isAdd={addClicked}
        />

      {showRemoveModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedExercise ? `${selectedExercise.exercise_name}` : selectedPerformanceTest ? `${selectedPerformanceTest.test_name}` : ""}</h2>
            <p>{selectedExercise ? `${selectedExercise.exercise_description}` : selectedPerformanceTest ? `${selectedPerformanceTest.description}` : ""}</p>
            <button onClick={closeRemoveModal}>Close</button>
            <button className="remove-exercise-btn" onClick={() => {
                if (selectedExercise) {
                  removeItem(selectedExercise, 2);
                } else if (selectedPerformanceTest) {
                  removeItem(selectedPerformanceTest, 1);
                }
              }}>
                Remove
            </button>
          </div>
        </div>
      )}

        {/* Display performance tests once a category is selected */}
        <div className="peformance-test-list">
        {trainingPlanPerformanceTests.length > 0 ? (
            trainingPlanPerformanceTests.map((p_test) => (
            <div key={p_test.id} className="performance-test-container" onClick={() => handlePerformanceTestClick(p_test)}>
                <p>{p_test.test_name}</p>
                <p>{p_test.description}</p>
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