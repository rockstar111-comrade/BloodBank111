import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MapView from './components/MapView';
import BloodRequest from './components/BloodRequest';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Link } from 'react-router-dom';

<Link to="/register" className="btn btn-danger">Register Now</Link>

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}>
      <Router>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
          <a className="navbar-brand" href="/">Blood Bank</a>
          <button className="btn btn-outline-light ms-auto" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </nav>

        <div className="container py-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/request" element={<BloodRequest />} />
            <Route path="/donor-form" element={<DonorForm />} />
            <Route path="/" element={<Dashboard />} />

          </Routes>
        </div>

        <footer className="bg-primary text-center text-white py-3 mt-auto">
          <div className="container">
            <p>© 2025 Blood Bank App | Made with ❤️</p>
            <button className="btn btn-outline-light btn-sm" onClick={() => setDarkMode(!darkMode)}>
              Toggle {darkMode ? 'Light' : 'Dark'} Mode
            </button>
          </div>
        </footer>
      </Router>
    </div>
  );
}

export default App;
