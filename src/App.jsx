import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import axiosInstance, { setOnUnauthorized } from "./axiosInstance";
import HomePage from "./pages/HomePage";
import ExercisesPage from "./pages/ExercisesPage";
import PerformanceTestsPage from "./pages/PerformanceTestsPage";
import LoginPage from "./pages/LoginPage";
import UserSignupPage from "./pages/UserSignupPage";
import TrainingPlanPage from "./pages/TrainingPlanPage";

function LoadingScreen() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      Loading…
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axiosInstance.get("/auth");
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    setOnUnauthorized(() => setIsAuthenticated(false));
  }, []);

  const handleSignOut = async () => {
    try {
      await axiosInstance.post("/logout");
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const requireAuth = (Element) =>
    !authChecked ? <LoadingScreen /> : isAuthenticated ? Element : <Navigate to="/login" replace />;

  return (
    <Router>
      {authChecked && (
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/training-plans">Training Plans</Link></li>
            <li><Link to="/exercises">Exercises</Link></li>
            <li><Link to="/performance-tests">Tests</Link></li>
            {isAuthenticated && (
              <li>
                <Link to="/login" onClick={handleSignOut}>Sign Out</Link>
              </li>
            )}
          </ul>
        </nav>
      )}
      <style>
        {`
          @media (max-width: 768px) {
            nav {
              font-size: 1.2rem;
            }
            nav ul li a {
              font-size: 0.9rem;
            }
          }
        `}
      </style>
      <Routes>
        <Route path="/" element={requireAuth(<HomePage onAuthChange={setIsAuthenticated} />)} />
        <Route path="/login" element={<LoginPage onAuthChange={setIsAuthenticated} />} />
        <Route path="/exercises" element={requireAuth(<ExercisesPage />)} />
        <Route path="/performance-tests" element={requireAuth(<PerformanceTestsPage />)} />
        <Route path="/training-plans" element={requireAuth(<TrainingPlanPage />)} />
        <Route path="/signup" element={<UserSignupPage />} />
        <Route path="*" element={!authChecked ? <LoadingScreen /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
