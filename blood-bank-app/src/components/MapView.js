// src/components/MapView.js

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapView = () => {
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    const fetchDonors = async () => {
      const donorSnapshot = await getDocs(collection(db, 'donors'));
      const donorList = donorSnapshot.docs.map(doc => doc.data());
      setDonors(donorList);
    };

    fetchDonors();
  }, []);

  return (
    <div style={{ height: '90vh', width: '100%' }}>
      <MapContainer center={[20.5937, 78.9629]} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {donors.map((donor, index) => (
          <Marker key={index} position={[donor.latitude, donor.longitude]}>
            <Popup>
              <strong>{donor.name}</strong><br />
              Blood Group: {donor.bloodGroup}<br />
              Contact: {donor.contact}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
