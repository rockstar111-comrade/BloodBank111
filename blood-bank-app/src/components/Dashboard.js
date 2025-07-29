// src/pages/Dashboard.js

import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

import DonorForm from "../components/DonorForm";
import MapView from "../components/MapView";

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (!userData) {
    return <div className="text-light text-center mt-5">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center text-red-700 mb-6">
        🩸 Welcome, {userData.name}!
      </h2>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">👤 Your Info</h3>
          <p><strong>Email:</strong> {auth.currentUser.email}</p>
          <p><strong>Blood Group:</strong> {userData.bloodGroup}</p>
          <p><strong>Role:</strong> {userData.role}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">📍 Location Info</h3>
          <p>
            This section shows the map view of all donors. It updates automatically when a new donor is added.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <DonorForm />
        <MapView />
      </div>
    </div>
  );
}

export default Dashboard;
