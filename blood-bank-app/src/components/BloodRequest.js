// Placeholder for BloodRequest.js
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function BloodRequest() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [location, setLocation] = useState("");
  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState(null);

  // Fetch user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // Submit new blood request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bloodGroup || !location || !user) return;

    try {
      await addDoc(collection(db, "bloodRequests"), {
        bloodGroup,
        location,
        userId: user.uid,
        email: user.email,
        createdAt: serverTimestamp(),
      });

      setBloodGroup("");
      setLocation("");
      fetchRequests(); // Refresh list
    } catch (err) {
      console.error("Error submitting request:", err);
    }
  };

  // Fetch all requests
  const fetchRequests = async () => {
    const q = query(collection(db, "bloodRequests"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    setRequests(results);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="container mt-5 text-light bg-dark p-4 rounded">
      <h2 className="text-center mb-4">🩸 Blood Request Portal</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Blood Group</label>
          <select
            className="form-select"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            required
          >
            <option value="">-- Select Blood Group --</option>
            <option value="A+">A+</option>
            <option value="A−">A−</option>
            <option value="B+">B+</option>
            <option value="B−">B−</option>
            <option value="AB+">AB+</option>
            <option value="AB−">AB−</option>
            <option value="O+">O+</option>
            <option value="O−">O−</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Location</label>
          <input
            type="text"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-danger" type="submit">
          Submit Request
        </button>
      </form>

      <h4 className="mb-3">📋 Recent Requests</h4>
      <ul className="list-group">
        {requests.map((req) => (
          <li key={req.id} className="list-group-item bg-secondary text-white mb-2">
            <strong>Blood Group:</strong> {req.bloodGroup} <br />
            <strong>Location:</strong> {req.location} <br />
            <strong>Requested by:</strong> {req.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BloodRequest;
