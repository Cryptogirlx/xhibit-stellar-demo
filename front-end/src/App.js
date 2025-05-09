import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './components/SignupPage';
import MainApp from './components/MainApp';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/app/*" element={<MainApp />} />
      </Routes>
    </Router>
  );
}

export default App;