import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom icons for different blood groups
const createBloodGroupIcon = (bloodGroup) => {
  const colors = {
    'A+': '#FF6B6B', 'A-': '#FF8E8E',
    'B+': '#4ECDC4', 'B-': '#6FDDDD',
    'AB+': '#45B7D1', 'AB-': '#6BC5E8',
    'O+': '#96CEB4', 'O-': '#AEDCC0'
  };
  
  return L.divIcon({
    html: `<div style="background-color: ${colors[bloodGroup] || '#FF6B6B'}; width: 25px; height: 25px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${bloodGroup}</div>`,
    className: 'custom-div-icon',
    iconSize: [25, 25],
    iconAnchor: [12, 12]
  });
};

const MapView = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    bloodGroup: '',
    availability: ''
  });
  const [center, setCenter] = useState([20.5937, 78.9629]); // Default to India center

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    fetchDonors();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log('Location access denied or unavailable');
        }
      );
    }
  };

  const fetchDonors = async () => {
    try {
      let donorQuery = collection(db, 'donors');
      
      // Apply filters if any
      if (filter.bloodGroup) {
        donorQuery = query(donorQuery, where('bloodGroup', '==', filter.bloodGroup));
      }
      if (filter.availability) {
        donorQuery = query(donorQuery, where('availability', '==', filter.availability));
      }

      const donorSnapshot = await getDocs(donorQuery);
      const donorList = donorSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDonors(donorList);
    } catch (error) {
      console.error('Error fetching donors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const applyFilters = () => {
    setLoading(true);
    fetchDonors();
  };

  const clearFilters = () => {
    setFilter({ bloodGroup: '', availability: '' });
    setLoading(true);
    fetchDonors();
  };

  const getAvailabilityBadge = (availability) => {
    const badges = {
      'available': 'bg-success',
      'busy': 'bg-warning',
      'unavailable': 'bg-danger'
    };
    return badges[availability] || 'bg-secondary';
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        {/* Filters Sidebar */}
        <div className="col-lg-3 mb-4">
          <div className="card border-0 shadow">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-funnel me-2"></i>
                Filter Donors
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Blood Group</label>
                <select
                  name="bloodGroup"
                  className="form-select"
                  value={filter.bloodGroup}
                  onChange={handleFilterChange}
                >
                  <option value="">All Blood Groups</option>
                  {bloodGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Availability</label>
                <select
                  name="availability"
                  className="form-select"
                  value={filter.availability}
                  onChange={handleFilterChange}
                >
                  <option value="">All Status</option>
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary"
                  onClick={applyFilters}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Filtering...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-search me-2"></i>
                      Apply Filters
                    </>
                  )}
                </button>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={clearFilters}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Clear Filters
                </button>
              </div>

              <hr />

              <div className="mt-3">
                <h6 className="text-muted mb-2">
                  <i className="bi bi-info-circle me-2"></i>
                  Statistics
                </h6>
                <div className="small">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Total Donors:</span>
                    <span className="fw-bold">{donors.length}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Available:</span>
                    <span className="text-success fw-bold">
                      {donors.filter(d => d.availability === 'available').length}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Busy:</span>
                    <span className="text-warning fw-bold">
                      {donors.filter(d => d.availability === 'busy').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="col-lg-9">
          <div className="card border-0 shadow">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-geo-alt me-2"></i>
                  Live Donor Map ({donors.length} donors)
                </h5>
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={getCurrentLocation}
                >
                  <i className="bi bi-crosshair me-1"></i>
                  My Location
                </button>
              </div>
            </div>
            <div className="card-body p-0">
              <div style={{ height: '70vh', width: '100%' }}>
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <div className="text-center">
                      <div className="spinner-border text-primary mb-3"></div>
                      <p className="text-muted">Loading donors...</p>
                    </div>
                  </div>
                ) : (
                  <MapContainer 
                    center={center} 
                    zoom={10} 
                    scrollWheelZoom={true} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {donors.map((donor) => (
                      <Marker 
                        key={donor.id} 
                        position={[donor.latitude, donor.longitude]}
                        icon={createBloodGroupIcon(donor.bloodGroup)}
                      >
                        <Popup>
                          <div className="p-2">
                            <h6 className="mb-2">
                              <i className="bi bi-person-fill me-2"></i>
                              {donor.name}
                            </h6>
                            <div className="mb-2">
                              <span className="badge bg-danger me-2">
                                {donor.bloodGroup}
                              </span>
                              <span className={`badge ${getAvailabilityBadge(donor.availability)}`}>
                                {donor.availability}
                              </span>
                            </div>
                            <p className="small mb-1">
                              <i className="bi bi-telephone me-1"></i>
                              {donor.contact}
                            </p>
                            {donor.age && (
                              <p className="small mb-1">
                                <i className="bi bi-calendar me-1"></i>
                                Age: {donor.age}
                              </p>
                            )}
                            <p className="small mb-0 text-muted">
                              <i className="bi bi-clock me-1"></i>
                              Registered: {donor.timestamp?.toDate?.()?.toLocaleDateString() || 'Recently'}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                )}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="card border-0 shadow mt-3">
            <div className="card-body">
              <h6 className="mb-3">
                <i className="bi bi-palette me-2"></i>
                Blood Group Legend
              </h6>
              <div className="row">
                {bloodGroups.map(group => (
                  <div key={group} className="col-3 mb-2">
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle me-2"
                        style={{
                          width: '20px',
                          height: '20px',
                          backgroundColor: {
                            'A+': '#FF6B6B', 'A-': '#FF8E8E',
                            'B+': '#4ECDC4', 'B-': '#6FDDDD',
                            'AB+': '#45B7D1', 'AB-': '#6BC5E8',
                            'O+': '#96CEB4', 'O-': '#AEDCC0'
                          }[group],
                          border: '2px solid white',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                        }}
                      ></div>
                      <small>{group}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;