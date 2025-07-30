import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [userRequests, setUserRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        // Fetch user data
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }

        // Fetch user's blood requests
        const requestsQuery = query(
          collection(db, "bloodRequests"),
          where("userId", "==", user.uid)
        );
        const requestsSnapshot = await getDocs(requestsQuery);
        const requests = requestsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserRequests(requests);

      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{minHeight: '60vh'}}>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning text-center">
          <h4>Profile not found</h4>
          <p>Please complete your registration.</p>
          <Link to="/register" className="btn btn-danger">Complete Registration</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="text-danger mb-1">
                🩸 Welcome, {userData.name}!
              </h2>
              <p className="text-muted mb-0">
                {userData.role === 'donor' ? 'Thank you for being a life-saver!' : 'We\'re here to help you find donors.'}
              </p>
            </div>
            <button onClick={handleLogout} className="btn btn-outline-danger">
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* User Info Cards */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-danger text-white rounded-circle p-3 me-3">
                  <i className="bi bi-person-fill"></i>
                </div>
                <div>
                  <h6 className="card-title mb-1">Profile Info</h6>
                  <p className="card-text small text-muted mb-0">
                    {userData.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-success text-white rounded-circle p-3 me-3">
                  <i className="bi bi-droplet-fill"></i>
                </div>
                <div>
                  <h6 className="card-title mb-1">Blood Group</h6>
                  <p className="card-text small text-muted mb-0">
                    {userData.bloodGroup}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-info text-white rounded-circle p-3 me-3">
                  <i className="bi bi-person-badge-fill"></i>
                </div>
                <div>
                  <h6 className="card-title mb-1">Role</h6>
                  <p className="card-text small text-muted mb-0">
                    {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">
                <i className="bi bi-lightning-fill text-warning me-2"></i>
                Quick Actions
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-2">
                  <Link to="/donor-form" className="btn btn-outline-success w-100">
                    <i className="bi bi-person-plus me-2"></i>
                    Register as Donor
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link to="/request" className="btn btn-outline-danger w-100">
                    <i className="bi bi-heart-pulse me-2"></i>
                    Request Blood
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link to="/map" className="btn btn-outline-primary w-100">
                    <i className="bi bi-geo-alt me-2"></i>
                    View Donor Map
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <button className="btn btn-outline-info w-100" disabled>
                    <i className="bi bi-bell me-2"></i>
                    Notifications
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User's Blood Requests */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">
                <i className="bi bi-list-ul me-2"></i>
                Your Blood Requests ({userRequests.length})
              </h5>
            </div>
            <div className="card-body">
              {userRequests.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-inbox text-muted" style={{fontSize: '3rem'}}></i>
                  <p className="text-muted mt-2">No blood requests yet.</p>
                  <Link to="/request" className="btn btn-danger">
                    Make Your First Request
                  </Link>
                </div>
              ) : (
                <div className="row">
                  {userRequests.map((request) => (
                    <div key={request.id} className="col-md-6 mb-3">
                      <div className="card border-start border-danger border-3">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="card-title text-danger">
                                Blood Group: {request.bloodGroup}
                              </h6>
                              <p className="card-text small">
                                <i className="bi bi-geo-alt me-1"></i>
                                {request.location}
                              </p>
                              <p className="card-text small text-muted">
                                <i className="bi bi-calendar me-1"></i>
                                {request.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                              </p>
                            </div>
                            <span className="badge bg-warning">Pending</span>
                          </div>
                        </div>
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

export default Dashboard;