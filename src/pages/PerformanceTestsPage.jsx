import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../axiosInstance";
import NewPerformanceTestModal from "../components/AddPerformanceTestModal"; // Import the NewPerformanceTestModal component
import "./PerformanceTests.css";


function PerformanceTestsPage() {
  const navigate = useNavigate();
  const [performanceTests, setPerformanceTests] = useState([]); // Stores all PerformanceTests from API
  const [filteredPerformanceTests, setFilteredPerformanceTests] = useState([]); // Stores filtered PerformanceTests
  const [selectedPerformanceTest, setSelectedPerformanceTest] = useState(null); // State var for select PerformanceTest
  const [searchQuery, setSearchQuery] = useState(""); // Stores the search input
  const [showModal, setShowModal] = useState(false); // To show/hide modal


  useEffect(() => {
    const fetchPerformanceTests = async () => {
      //const token = localStorage.getItem("jwt"); // Retrieve JWT from localStorage
      try {
        const response = await axiosInstance.get("/performance-tests");
        setPerformanceTests(response.data);
        setFilteredPerformanceTests(response.data); // Initially display all PerformanceTests
      } catch (error) {
        console.log("ERROR STATUS", error.response.status);
        if (error.response && error.response.status === 401) {
          // Redirect to the login page if not authenticated
          navigate("/login");
        } else {
          console.error("Error fetching PerformanceTests:", error);
        }
      }
    };

    fetchPerformanceTests();
  }, []);


  // Updates filteredPerformanceTests based on search input
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredPerformanceTests(
      performanceTests.filter((performanceTest) =>
        performanceTest.test_name.toLowerCase().includes(query)
      )
    );
  };


  // Open modal for editing an existing PerformanceTest
  const handleEditClick = (performanceTest) => {
    setSelectedPerformanceTest(performanceTest); // Pass existing PerformanceTest for editing
    setShowModal(true);
  };


  // Open modal for adding a new PerformanceTest
  const handleAddClick = () => {
      setSelectedPerformanceTest(null); // No PerformanceTest means adding a new one
      setShowModal(true);
    };


  const handleSavePerformanceTest = async (data, trainingPlanData) => {
      try {
        if (selectedPerformanceTest) {
          // Make an API call to update the PerformanceTest
          data["id"] = selectedPerformanceTest.id; // Needs PerformanceTest id to update
          const update_response = await axiosInstance.put("/performance-tests", data);
          console.log("Saved Update PerformanceTest Data:", update_response.data);

          if (trainingPlanData) {
            // Make an API call to add the exercise to the selected training plan
            const response = await axiosInstance.post("/training-plan/add-performance-tests", trainingPlanData);
            console.log("Saved Add PerformanceTest to Training Plan Data:", String(response.data));
          }
        }
        else {
          // Make an API call to add the PerformanceTest
          const add_response = await axiosInstance.post("/performance-tests", data);
          console.log("Saved Add PerformanceTest Data:", add_response.data);
        }
        const get_response = await axiosInstance.get("/performance-tests");
        setPerformanceTests(get_response.data);
        setFilteredPerformanceTests(get_response.data);
      }
      catch(error){
        console.error("Error fetching data:", error);
      }
  };


  const handleDeletePerformanceTest = async () => {
    try {
      var removeItem = {};
      removeItem["test_id"] = selectedPerformanceTest.id;
      const remove_response = await axiosInstance.delete("/performance-tests", {params: removeItem});
      console.log("Delete Performance Test from Training Plan:", remove_response.data);
    }
    catch(error){
      console.error("Error fetching or saving data:", error);
    }
    const get_response = await axiosInstance.get("/performance-tests");
    setPerformanceTests(get_response.data);
    setFilteredPerformanceTests(get_response.data);
    setShowModal(false);
  };


  return (
    <div className="performance-tests-page">
      <h2>Performance Tests</h2>
      <button className="performance-test-add-btn" onClick={() => handleAddClick()}> + </button>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search performance tests..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-bar"
      />

      <NewPerformanceTestModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSavePerformanceTest}
        onDelete={handleDeletePerformanceTest}
        performanceTest={selectedPerformanceTest}
      />

      {/* Selected Performance Test Details */}
      <div className="performance-test-details">
        {filteredPerformanceTests.map((performanceTest, index) => (
          <div key={index} className="performance-test" onClick={() => handleEditClick(performanceTest)}>
            <h3>{performanceTest.test_name}</h3>
            <p><strong>Description:</strong> {performanceTest.description}</p>
            <p><strong>Performance Value:</strong> {performanceTest.performance_value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PerformanceTestsPage;