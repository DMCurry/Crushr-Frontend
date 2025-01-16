import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ExercisesPage from "./pages/ExercisesPage";
import LoginPage from "./pages/LoginPage";
import UserSignupPage from "./pages/UserSignupPage";


function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/exercises">Exercises</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<UserSignupPage />} />

      </Routes>
    </Router>
  );
}

export default App;
