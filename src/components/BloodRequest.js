import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function BloodRequest() {
  const [formData, setFormData] = useState({
    bloodGroup: "",
    location: "",
    urgency: "medium",
    contactNumber: "",
    hospitalName: "",
    additionalNotes: ""
  });
  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = [
    { value: 'low', label: 'Low', color: 'success' },
    { value: 'medium', label: 'Medium', color: 'warning' },
    { value: 'high', label: 'High', color: 'danger' },
    { value: 'critical', label: 'Critical', color: 'dark' }
  ];

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

  // Handle form input changes
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Submit new blood request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "bloodRequests"), {
        ...formData,
        userId: user.uid,
        email: user.email,
        createdAt: serverTimestamp(),
        status: 'active'
      });

      // Reset form
      setFormData({
        bloodGroup: "",
        location: "",
        urgency: "medium",
        contactNumber: "",
        hospitalName: "",
        additionalNotes: ""
      });

      alert("Blood request submitted successfully!");
      fetchRequests(); // Refresh list
    } catch (err) {
      console.error("Error submitting request:", err);
      alert("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all requests
  const fetchRequests = async () => {
    try {
      const q = query(collection(db, "bloodRequests"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      setRequests(results);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const getUrgencyBadge = (urgency) => {
    const level = urgencyLevels.find(l => l.value === urgency) || urgencyLevels[1];
    return `badge bg-${level.color}`;
  };

  return (
    <div className="container py-4">
      <div className="row">
        {/* Request Form */}
        <div className="col-lg-5 mb-4">
          <div className="card border-0 shadow">
            <div className="card-header bg-danger text-white">
              <h4 className="mb-0">
                <i className="bi bi-heart-pulse me-2"></i>
                Submit Blood Request
              </h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-droplet me-2"></i>
                    Blood Group *
                  </label>
                  <select
                    className="form-select"
                    name="bloodGroup"
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

                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-geo-alt me-2"></i>
                    Location *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    placeholder="City, Area, or Hospital Address"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Urgency Level
                  </label>
                  <select
                    className="form-select"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                  >
                    {urgencyLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-telephone me-2"></i>
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    name="contactNumber"
                    placeholder="Your contact number"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-building me-2"></i>
                    Hospital Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="hospitalName"
                    placeholder="Hospital or clinic name"
                    value={formData.hospitalName}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    <i className="bi bi-chat-text me-2"></i>
                    Additional Notes
                  </label>
                  <textarea
                    className="form-control"
                    name="additionalNotes"
                    rows="3"
                    placeholder="Any additional information..."
                    value={formData.additionalNotes}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <button 
                  className="btn btn-danger w-100" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-2"></i>
                      Submit Request
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Recent Requests */}
        <div className="col-lg-7">
          <div className="card border-0 shadow">
            <div className="card-header bg-white">
              <h4 className="mb-0">
                <i className="bi bi-list-ul me-2"></i>
                Recent Blood Requests ({requests.length})
              </h4>
            </div>
            <div className="card-body" style={{maxHeight: '600px', overflowY: 'auto'}}>
              {requests.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox text-muted" style={{fontSize: '3rem'}}></i>
                  <p className="text-muted mt-3">No blood requests yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {requests.map((request) => (
                    <div key={request.id} className="card border-start border-danger border-3 mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="text-danger mb-1">
                              <i className="bi bi-droplet-fill me-2"></i>
                              {request.bloodGroup}
                            </h6>
                            <span className={getUrgencyBadge(request.urgency)}>
                              {urgencyLevels.find(l => l.value === request.urgency)?.label || 'Medium'}
                            </span>
                          </div>
                          <small className="text-muted">
                            {request.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                          </small>
                        </div>
                        
                        <div className="mb-2">
                          <small className="text-muted d-block">
                            <i className="bi bi-geo-alt me-1"></i>
                            {request.location}
                          </small>
                          {request.hospitalName && (
                            <small className="text-muted d-block">
                              <i className="bi bi-building me-1"></i>
                              {request.hospitalName}
                            </small>
                          )}
                          <small className="text-muted d-block">
                            <i className="bi bi-person me-1"></i>
                            {request.email}
                          </small>
                          {request.contactNumber && (
                            <small className="text-muted d-block">
                              <i className="bi bi-telephone me-1"></i>
                              {request.contactNumber}
                            </small>
                          )}
                        </div>

                        {request.additionalNotes && (
                          <p className="small text-muted mb-0">
                            <i className="bi bi-chat-text me-1"></i>
                            {request.additionalNotes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BloodRequest;