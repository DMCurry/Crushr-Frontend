import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import Dropdown from "../components/TrainingPlanDropdown"; // Import the Dropdown component
import "./AddPerformanceTestModal.css";

const NewPerformanceTestModal = ({ isOpen, onClose, onSave, performanceTest }) => {
  const [formData, setFormData] = useState({
    test_name: "",
    performance_value: "",
    description: "",
  });
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [selectedTrainingPlanRequest, setSelectedTrainingPlanRequest] = useState([]);


  // Populate form when performance_test data is provided (for updating)
  useEffect(() => {
    if (performanceTest) {
      setFormData({
        test_name: performanceTest.test_name || "",
        description: performanceTest.description || "",
      });
    } else {
      setFormData({ test_name: "", performance_value: "", description: "" });
    }
  }, [performanceTest, isOpen]); // Runs when performance_test changes


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
    console.error("Error fetching training_exercises:", error);
    }
};


  useEffect( () => {
    fetchTrainingPlans();
  }, []);


  const setTrainingPlanItems = async (performanceTestIds, trainingPlanId) => {
    const requestBody = {
      plan_id: trainingPlanId,
      item_ids: performanceTestIds
    }
    setSelectedTrainingPlanRequest(requestBody);
  };


  const handleSelectTrainingPlan = (selectedTrainingPlan) => {
    if (performanceTest && selectedTrainingPlan) {
      // First we want to make a new array tht has the existing perf test ids plus the current selected exercise's id
      console.log("CurrentTrainingPlanTests:", selectedTrainingPlan.performance_tests);
      const newPerformanceTests = [performanceTest.id]
      console.log("CombinedTrainingPlanTests:", newPerformanceTests);
      setTrainingPlanItems(newPerformanceTests, selectedTrainingPlan.id);
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
    fetchTrainingPlans();
    onClose();
  };


  if (!isOpen) return null;


  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{performanceTest ? "Edit Performance Test" : "Add Performance Test"}</h2>
        <div className="form-group">
          <label htmlFor="test_name">Name:</label>
          <input
            type="text"
            id="test_name"
            name="test_name"
            value={formData.test_name}
            onChange={handleChange}
            placeholder="Enter performance test name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter performance test description"
          />
        </div>
        { performanceTest && 
        (<label htmlFor="training_plans">Add this Performance Test to a Training Plan:</label>)
        &&
        (<Dropdown
              plans={trainingPlans}
              onSelectTrainingPlanItems={handleSelectTrainingPlan}
            />)
        }
        <div className="modal-actions">
          <button onClick={handleSave} className="performance-save-button">Save</button>
          <button onClick={onClose} className="performance-cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default NewPerformanceTestModal;