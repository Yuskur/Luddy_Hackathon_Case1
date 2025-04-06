import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import HomePage from "./HomePage";
import ManageIdeas from "./ManageIdeas";  

function App() {
  return (
    <Router>
      <div className="App">
        {/* Sticky Header */}
        <header className="app-header">
          <h1>💡 Idea.AI</h1>
          <p>A cutting-edge decision-making tool for your company's brightest ideas</p>
        </header>

        {/* Navigation Bar */}
        <nav className="nav-bar">
          <NavLink to="/HomePage" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Home
          </NavLink>
          <NavLink to="/ManageIdeas" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Manage Ideas
          </NavLink>
        </nav>

        {/* Pages */}
        <Routes>
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/ManageIdeas" element={<ManageIdeas />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
