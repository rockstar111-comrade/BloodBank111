import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-vh-100">
      {/* Hero Section */}
      <div className="bg-danger text-white py-5 mb-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">🩸 Smart Blood Bank</h1>
          <p className="lead mb-4">Connecting Donors and Recipients, Saving Lives Together</p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/register" className="btn btn-light btn-lg">
              <i className="bi bi-person-plus me-2"></i>Register as Donor
            </Link>
            <Link to="/request" className="btn btn-outline-light btn-lg">
              <i className="bi bi-heart-pulse me-2"></i>Request Blood
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container">
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="text-danger mb-3">
                  <i className="bi bi-person-heart" style={{fontSize: '3rem'}}></i>
                </div>
                <h5 className="card-title">Register as Donor</h5>
                <p className="card-text">Join our community of life-savers. Register as a blood donor and help people in urgent need.</p>
                <Link to="/register" className="btn btn-danger">Register Now</Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="text-danger mb-3">
                  <i className="bi bi-heart-pulse-fill" style={{fontSize: '3rem'}}></i>
                </div>
                <h5 className="card-title">Request Blood</h5>
                <p className="card-text">Submit your blood request and get matched with nearby donors quickly and efficiently.</p>
                <Link to="/request" className="btn btn-outline-danger">Request Blood</Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="text-danger mb-3">
                  <i className="bi bi-geo-alt-fill" style={{fontSize: '3rem'}}></i>
                </div>
                <h5 className="card-title">Live Donor Map</h5>
                <p className="card-text">Track and locate active donors in your area in real-time using our interactive map.</p>
                <Link to="/map" className="btn btn-outline-dark">View Map</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="row text-center mb-5">
          <div className="col-md-3">
            <div className="p-3">
              <h3 className="text-danger fw-bold">1000+</h3>
              <p className="text-muted">Registered Donors</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-3">
              <h3 className="text-danger fw-bold">500+</h3>
              <p className="text-muted">Lives Saved</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-3">
              <h3 className="text-danger fw-bold">50+</h3>
              <p className="text-muted">Cities Covered</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-3">
              <h3 className="text-danger fw-bold">24/7</h3>
              <p className="text-muted">Emergency Support</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-5">
          <div className="bg-light p-5 rounded">
            <h3 className="mb-3">Ready to Make a Difference?</h3>
            <p className="lead mb-4">Every donation counts. Join our mission to save lives.</p>
            <Link to="/register" className="btn btn-danger btn-lg me-3">
              Become a Donor
            </Link>
            <Link to="/login" className="btn btn-outline-danger btn-lg">
              Login to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;