// src/components/DonorForm.js

import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const DonorForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    bloodGroup: '',
    contact: '',
  });
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [status, setStatus] = useState('');

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
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setStatus('Location captured ✅');
      },
      () => {
        alert('Unable to retrieve location');
      }
    );
  };

  // Submit donor data to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.bloodGroup || !formData.contact) {
      alert('Please fill all fields');
      return;
    }
    if (!location.latitude || !location.longitude) {
      alert('Please click "Get Location" first');
      return;
    }

    try {
      await addDoc(collection(db, 'donors'), {
        ...formData,
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: new Date(),
      });
      alert('Donor info saved successfully!');
      setFormData({ name: '', bloodGroup: '', contact: '' });
      setLocation({ latitude: null, longitude: null });
      setStatus('');
    } catch (error) {
      console.error('Error saving donor:', error);
      alert('Failed to save donor data');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-4 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-semibold mb-4 text-center">Register as a Donor</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="w-full border px-3 py-2 rounded"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="bloodGroup"
          placeholder="Blood Group (e.g. A+)"
          className="w-full border px-3 py-2 rounded"
          value={formData.bloodGroup}
          onChange={handleChange}
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact Info"
          className="w-full border px-3 py-2 rounded"
          value={formData.contact}
          onChange={handleChange}
        />
        <button
          type="button"
          onClick={getLocation}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Get Location
        </button>
        {status && <p className="text-green-600 text-sm">{status}</p>}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default DonorForm;
