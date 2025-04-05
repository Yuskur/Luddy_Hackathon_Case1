import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
//import MoreInfoPage from "./MoreInfoPage";        <Route path="/more-info" element={<MoreInfoPage />} />


function App() {
  return (
    <div className="App">
      {/* Static Header */}
      <header>
        <h1>Idea.AI</h1>
        <p>A cutting-edge decision-making tool for your company's brightest ideas</p>
      </header>
     {/* Router for Pages */}
     <Router>
        <Routes>
          {/* Define routes */}
          <Route path="/HomePage" element={<HomePage />} />
        </Routes>
      </Router>  
    </div>
  );
}

export default App;
