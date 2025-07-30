import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const DonorForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    bloodGroup: '',
    contact: '',
    age: '',
    weight: '',
    lastDonation: '',
    medicalConditions: '',
    availability: 'available'
  });
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Check authentication
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }
      setUser(currentUser);
    });
    return () => unsub();
  }, [navigate]);

  // Handle input change
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Get current geolocation
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    
    setStatus('Getting location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setStatus('Location captured successfully! ✅');
      },
      (error) => {
        console.error('Geolocation error:', error);
        setStatus('Unable to get location. Please try again.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Submit donor data to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in first');
      return;
    }

    if (!formData.name || !formData.bloodGroup || !formData.contact) {
      alert('Please fill all required fields');
      return;
    }
    
    if (!location.latitude || !location.longitude) {
      alert('Please click "Get Location" first');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'donors'), {
        ...formData,
        latitude: location.latitude,
        longitude: location.longitude,
        userId: user.uid,
        email: user.email,
        timestamp: new Date(),
        isActive: true
      });
      
      alert('Donor registration successful! Thank you for joining our community.');
      
      // Reset form
      setFormData({
        name: '',
        bloodGroup: '',
        contact: '',
        age: '',
        weight: '',
        lastDonation: '',
        medicalConditions: '',
        availability: 'available'
      });
      setLocation({ latitude: null, longitude: null });
      setStatus('');
    } catch (error) {
      console.error('Error saving donor:', error);
      alert('Failed to save donor data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow">
            <div className="card-header bg-success text-white">
              <h4 className="mb-0">
                <i className="bi bi-person-heart me-2"></i>
                Register as Blood Donor
              </h4>
              <p className="mb-0 small">Join our community of life-savers</p>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <i className="bi bi-person me-2"></i>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <i className="bi bi-droplet me-2"></i>
                      Blood Group *
                    </label>
                    <select
                      name="bloodGroup"
                      className="form-select"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <i className="bi bi-telephone me-2"></i>
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      name="contact"
                      className="form-control"
                      placeholder="Your contact number"
                      value={formData.contact}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <i className="bi bi-calendar me-2"></i>
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      className="form-control"
                      placeholder="Your age"
                      min="18"
                      max="65"
                      value={formData.age}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <i className="bi bi-speedometer me-2"></i>
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      className="form-control"
                      placeholder="Weight in kg"
                      min="50"
                      value={formData.weight}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <i className="bi bi-calendar-date me-2"></i>
                      Last Donation Date
                    </label>
                    <input
                      type="date"
                      name="lastDonation"
                      className="form-control"
                      value={formData.lastDonation}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-heart-pulse me-2"></i>
                    Medical Conditions
                  </label>
                  <textarea
                    name="medicalConditions"
                    className="form-control"
                    rows="3"
                    placeholder="Any medical conditions or medications (optional)"
                    value={formData.medicalConditions}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-check-circle me-2"></i>
                    Availability Status
                  </label>
                  <select
                    name="availability"
                    className="form-select"
                    value={formData.availability}
                    onChange={handleChange}
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label mb-0">
                      <i className="bi bi-geo-alt me-2"></i>
                      Location *
                    </label>
                    <button
                      type="button"
                      onClick={getLocation}
                      className="btn btn-outline-primary btn-sm"
                      disabled={loading}
                    >
                      <i className="bi bi-crosshair me-1"></i>
                      Get My Location
                    </button>
                  </div>
                  {status && (
                    <div className={`alert ${status.includes('✅') ? 'alert-success' : 'alert-info'} py-2`}>
                      <small>{status}</small>
                    </div>
                  )}
                  {location.latitude && location.longitude && (
                    <small className="text-muted">
                      <i className="bi bi-check-circle-fill text-success me-1"></i>
                      Location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </small>
                  )}
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Registering...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-heart-fill me-2"></i>
                        Register as Donor
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="text-success mb-2">
                  <i className="bi bi-info-circle me-2"></i>
                  Donor Requirements
                </h6>
                <ul className="small mb-0">
                  <li>Age: 18-65 years</li>
                  <li>Weight: Minimum 50 kg</li>
                  <li>Good general health</li>
                  <li>At least 3 months gap between donations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorForm;