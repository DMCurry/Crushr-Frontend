import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate} from "react-router-dom";
import axiosInstance from "./axiosInstance";
import HomePage from "./pages/HomePage";
import ExercisesPage from "./pages/ExercisesPage";
import LoginPage from "./pages/LoginPage";
import UserSignupPage from "./pages/UserSignupPage";
import TrainingPlanPage from "./pages/TrainingPlanPage";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignOut = async () => {
    try {
      await axiosInstance.post("/logout"); // Send request to logout endpoint
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/training-plans">Training Plans</Link></li>
          <li><Link to="/exercises">Exercises</Link></li>
          {isAuthenticated && (
            <li>
              <Link to="/login" onClick={handleSignOut}>Sign Out</Link>
            </li>
          )}
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage onAuthChange={setIsAuthenticated} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/exercises" element={isAuthenticated ? <ExercisesPage /> : <Navigate to="/login"></Navigate>} />
        <Route path="/training-plans" element={isAuthenticated ? <TrainingPlanPage /> : <Navigate to="/login"></Navigate>} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<UserSignupPage />} />

      </Routes>
    </Router>
  );
}

export default App;
