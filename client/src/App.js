import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import MoreInfo from "./MoreInfo";  


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
          <Route path="/MoreInfo" element={<MoreInfo />} />
        </Routes>
      </Router>  
    </div>
  );
}

export default App;
