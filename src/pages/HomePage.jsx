import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axiosInstance from "../axiosInstance";
import Dropdown from "../components/TrainingPlanDropdown"; // Import the Dropdown component
import PerformanceChart from "../components/PerformanceChart";
import './Calendar.css';


function HomePage({ onAuthChange }) {
  const [data, setData] = useState([]);
  const [trainingPlans, setTrainingPlans] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate
  const [showModal, setShowModal] = useState(false); // To show/hide modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [testResult, setTestResult] = useState(""); // For setting the performance test result
  const [chartsData, setChartsData] = useState([]);
  const [currentDay, setCurrentDay] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedPerformanceTest, setSelectedPerformanceTest] = useState(null);
  const [trainingPlanExercises, setTrainingPlanExercises] = useState([]);
  const [trainingPlanPerformanceTests, setTrainingPlanPerformanceTests] = useState([]);
  const [resultSaveSuccess, setResultSaveSuccess] = useState(false);
  const [scheduleSaveSuccess, setScheduleSaveSuccess] = useState(false);



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
      console.error("Error fetching training_exercises:", error);
    }
  };


  const fetchChartsData = async () => {
    try {
      const response = await axiosInstance.get("/analytics");
      console.log("responseData", response.data.data);
      // Format data to fit the chart structure
      const formattedData = response.data.data.map((item) => ({
        title: item.test_name,
        data: item.analytics.map((analytic) => ({
          name: analytic.test_date,
          value: analytic.performance_test_result
        }))
      }));
      setChartsData(formattedData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };


  const handleSelectTrainingPlanItems = (selectedTrainingPlan) => {
    const exercises = selectedTrainingPlan ? selectedTrainingPlan.exercises : [];
    const performanceTests = selectedTrainingPlan ? selectedTrainingPlan.performance_tests : [];
    
    // Update exercises when a category is selected
    setTrainingPlanExercises(exercises);
    
    // Update performance tests when a category is selected
    setTrainingPlanPerformanceTests(performanceTests);
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
    console.log("UPDateDDATA:", updatedData);
    updatedData.data[currentDay] = updatedData.data[currentDay] || {};
    updatedData.data[currentDay].exercises = updatedData.data[currentDay].exercises || [];
    var add_exercise = {};
    add_exercise["exercise_id"] = exercise.id;
    add_exercise["exercise_name"] = exercise.exercise_name;
    add_exercise["exercise_description"] = exercise.description;
    add_exercise["exercise_reps"] = exercise.reps;
    add_exercise["exercise_sets"] = exercise.sets;
    const exists = updatedData.data[currentDay].exercises.some((obj) => obj.exercise_id === add_exercise.exercise_id);
    console.log(exists);
    console.log(updatedData.data[currentDay]);
    console.log(add_exercise.exercise_id);
    if (!exists) {
      updatedData.data[currentDay].exercises.push(add_exercise);
      setData(updatedData);

      setAddModalOpen(false); // Close the modal
    }
  };


  const handlePerformanceTestSelect = (performance_test) => {
    if (!currentDay || !performance_test) return;

    console.log(performance_test);
    // Update state with the new performance test
    const updatedData = { ...data };
    updatedData.data[currentDay] = updatedData.data[currentDay] || {};
    updatedData.data[currentDay].performance_tests = updatedData.data[currentDay].performance_tests || [];
    var add_performance_test = {};
    add_performance_test["performance_test_id"] = performance_test.id;
    add_performance_test["performance_test_name"] = performance_test.test_name;
    add_performance_test["performance_test_description"] = performance_test.description;
    add_performance_test["performance_test_value"] = performance_test.performance_value;
    const exists = updatedData.data[currentDay].performance_tests.some((obj) => obj.performance_test_id === add_performance_test.performance_test_id);
    console.log(exists);
    console.log(updatedData.data[currentDay]);
    console.log(add_performance_test.performance_test_id);
    if (!exists) {
      updatedData.data[currentDay].performance_tests.push(add_performance_test);
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
        await fetchChartsData();
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


  const handlePerformanceTestClick = (p_test, day) => {
    setSelectedPerformanceTest(p_test);
    setCurrentDay(day);
    setShowModal(true); // Show the modal when clicked
  };


  const closeModal = () => {
    setShowModal(false); // Close the modal
    setSelectedExercise(null); // Reset the selected exercise
    setSelectedPerformanceTest(null); // Reset the selected performance test
    setTestResult("");
  };


  const handleSaveScheduleDataClick = async () => {
    try {
      // Make an API call to update the schedule
      const response = await axiosInstance.put("/schedule", data);
      if (response.status === 200) {
        setScheduleSaveSuccess(true);
        setData(response.data);
      }
    }
    catch(error){
      console.error("Error fetching data:", error);
    }
  };


  const removeExerciseFromDay = (exercise) => {
    const updatedData = { ...data };
    updatedData.data[currentDay].exercises = updatedData.data[currentDay].exercises || [];
    console.log("test");
    console.log(exercise);
    console.log(updatedData.data[currentDay].exercises);
    updatedData.data[currentDay].exercises = updatedData.data[currentDay].exercises.filter((obj) => obj.exercise_id !== exercise.exercise_id);
    setData(updatedData);
    console.log(updatedData.data[currentDay].exercises);
    setShowModal(false); // Close the modal
    setSelectedExercise(null); // De-select the exercise
  };


  const removePerformanceTestFromDay = (p_test) => {
    const updatedData = { ...data };
    updatedData.data[currentDay].performance_tests = updatedData.data[currentDay].performance_tests || [];
    console.log("test");
    console.log(p_test);
    console.log(updatedData.data[currentDay].performance_tests);
    updatedData.data[currentDay].performance_tests = updatedData.data[currentDay].performance_tests.filter((obj) => obj.performance_test_id !== p_test.performance_test_id);
    setData(updatedData);
    console.log(updatedData.data[currentDay].performance_tests);
    setShowModal(false); // Close the modal
    setSelectedPerformanceTest(null); // De-select the Performance test
  };


  const recordTestResult = async () => {
    try{
      const requestBody = {
        test_id: selectedPerformanceTest.performance_test_id,
        test_value: testResult,
        date: new Date().toISOString().split("T")[0], // Current date in "YYYY-MM-DD" format
      };
      const response = await axiosInstance.post("/analytics", requestBody);
      if (response.status === 200) {
        setResultSaveSuccess(true);
      }
    }
    catch(error){
      console.error("Error saving performance data:", error);
    }
    fetchChartsData();
  };


  // Function to handle timed disappearing save success messages
  useEffect(() => {
    let resultTimer, scheduleTimer;

    if (resultSaveSuccess) {
      resultTimer = setTimeout(() => setResultSaveSuccess(false), 2000);
    }

    if (scheduleSaveSuccess) {
      scheduleTimer = setTimeout(() => setScheduleSaveSuccess(false), 2000);
    }

    return () => {
      clearTimeout(resultTimer);
      clearTimeout(scheduleTimer);
    };
  }, [resultSaveSuccess, scheduleSaveSuccess]);


  useEffect(() => {
    if (addModalOpen) {
      // Disable scroll on body when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Enable scroll again when modal is closed
      document.body.style.overflow = 'auto';
    }

    return () => {
      // Cleanup on component unmount
      document.body.style.overflow = 'auto';
    };
  }, [addModalOpen]);


  return (
    <div>
      <div className="calendar-container">
      {data ? (
        data.data ? (
          <div className="calendar-grid">
            {Object.keys(data.data).map((day) => {
              const dayData = data.data[day];
              const exerciseData = dayData ? dayData.exercises : []; // This will be an array or null
              const performanceTestData = dayData ? dayData.performance_tests : []; // This will be an array or null
              return (
                <div key={day} className="calendar-day">
                  <h3>{day}</h3>
                  <button
                    className="add-exercise-btn"
                    onClick={() => handleAddExercise(day)}
                  >
                    +
                  </button>
                  {exerciseData && exerciseData.length > 0 ? (
                    exerciseData.map((exercise) => (
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
                  {performanceTestData && performanceTestData.length > 0 ? (
                    performanceTestData.map((perf_test) => (
                      <div
                        key={perf_test.performance_test_id}
                        className="performance-test-container"
                        onClick={() => handlePerformanceTestClick(perf_test, day)}
                      >
                        <p>{perf_test.performance_test_name}</p>
                      </div>
                    ))
                  ) : (
                    <p>No Performance Tests</p>
                  )}
                </div>
              );
            })}
          <button className="save-schedule-btn" onClick={() => handleSaveScheduleDataClick()}>Save Schedule</button>
          {scheduleSaveSuccess && <span style={{ marginLeft: "2px", color: "green" }}>Saved Schedule</span>}

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
            <h2>{selectedExercise ? `${selectedExercise.exercise_name}` : selectedPerformanceTest ? `${selectedPerformanceTest.performance_test_name}` : ""}</h2>
            <p>{selectedExercise ? `${selectedExercise.exercise_description}` : selectedPerformanceTest ? `${selectedPerformanceTest.performance_test_description}` : ""}</p>
            <p>Reps: {selectedExercise ? `${selectedExercise.exercise_reps}` : "N/A"}</p>
            <p>Sets: {selectedExercise ? `${selectedExercise.exercise_sets}` : "N/A"}</p>
            {selectedPerformanceTest && (
              <div>
                <input
                  type="text"
                  placeholder="Enter test result"
                  value={testResult}
                  onChange={(e) => setTestResult(e.target.value)}
                />
                <button onClick={recordTestResult}>
                  Submit Result
                </button>
                {resultSaveSuccess && <span style={{ marginLeft: "2px", color: "green" }}>Saved Result</span>}
              </div>
            )}
            <button onClick={closeModal}>Close</button>
            <button className="remove-exercise-btn" onClick={() => {
                if (selectedExercise) {
                  removeExerciseFromDay(selectedExercise);
                } else if (selectedPerformanceTest) {
                  removePerformanceTestFromDay(selectedPerformanceTest);
                }
              }}>
                Remove
            </button>
          </div>
        </div>
      )}
  </div>
  {addModalOpen && (
        <div className="add-modal">
          <div className="add-modal-content">
            <h3>Add Exercise to {currentDay}</h3>
            <Dropdown
              plans={trainingPlans}
              onSelectTrainingPlanItems={handleSelectTrainingPlanItems}
            />
            <button onClick={() => setAddModalOpen(false)}>Close</button>
          </div>
          <div>
          {/* Display exercises once a category is selected */}
          {trainingPlanExercises.length > 0 ? (
              trainingPlanExercises.map((t_exercise) => (
              <div key={t_exercise.id} 
              className="exercise-container" 
              onClick={() => handleExerciseSelect(t_exercise)}>
                  <p>{t_exercise.exercise_name}</p>
                  <p>{t_exercise.description}</p>
                  <p>Reps: {t_exercise.reps}</p>
                  <p>Sets: {t_exercise.sets}</p>
              </div>
              ))
          ) : (
              <p></p>
          )}
        {/* Display performance tests once a category is selected */}
        {trainingPlanPerformanceTests.length > 0 ? (
            trainingPlanPerformanceTests.map((p_test) => (
            <div key={p_test.id} 
            className="performance-test-container"
            onClick={() => handlePerformanceTestSelect(p_test)}>
                <p>{p_test.test_name}</p>
                <p>{p_test.description}</p>
                <p>Performance Value: {p_test.performance_value}</p>
            </div>
            ))
        ) : (
            <p></p>
        )}
        </div>
        </div>
  )}
  <div>
      {chartsData.map((chart, index) => (
        <div className="graph-container" key={index}>
          <h3>{chart.title}</h3>
          <PerformanceChart
            key={index}
            data={chart.data}
            lineColor={index % 2 === 0 ? "#ff7300" : "#8884d8"} // Different color for variety
          />
        </div>
      ))}
  </div>
  </div>
  );
}

export default HomePage;