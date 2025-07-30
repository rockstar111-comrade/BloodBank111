import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MapView from './components/MapView';
import BloodRequest from './components/BloodRequest';
import DonorForm from './components/DonorForm';
import Home from './components/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}>
      <Router>
        <nav className="navbar navbar-expand-lg navbar-dark bg-danger px-4">
          <Link className="navbar-brand" to="/">🩸 Smart Blood Bank</Link>
          <div className="navbar-nav ms-auto">
            <Link className="nav-link" to="/">Home</Link>
            <Link className="nav-link" to="/register">Register</Link>
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-link" to="/map">Map</Link>
            <Link className="nav-link" to="/request">Request Blood</Link>
          </div>
          <button className="btn btn-outline-light ms-3" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </nav>

        <div className="container-fluid py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/request" element={<BloodRequest />} />
            <Route path="/donor-form" element={<DonorForm />} />
          </Routes>
        </div>

        <footer className="bg-danger text-center text-white py-3 mt-auto">
          <div className="container">
            <p className="mb-2">© 2025 Smart Blood Bank | Connecting Lives, Saving Lives</p>
            <div className="d-flex justify-content-center gap-2">
              <Link to="/register" className="btn btn-outline-light btn-sm">Register</Link>
              <Link to="/login" className="btn btn-outline-light btn-sm">Login</Link>
              <Link to="/map" className="btn btn-outline-light btn-sm">View Map</Link>
            </div>
          </div>
        </footer>
      </Router>
    </div>
  );
}

export default App;