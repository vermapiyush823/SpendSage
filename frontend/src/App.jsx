// src/App.js
import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Navbar from "./components/navbar";
import AiAnalysis from "./pages/AiAnalysis";
import Analysis from "./pages/Analysis";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
function App() {
  const isAuthenticated = localStorage.getItem("token");
  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <div className="min-h-screen ">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/analysis"
            element={isAuthenticated ? <Analysis /> : <Navigate to="/login" />}
          />
          <Route
            path="/ai-analysis"
            element={
              isAuthenticated ? <AiAnalysis /> : <Navigate to="/login" />
            }
          />
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/" : "/login"} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
