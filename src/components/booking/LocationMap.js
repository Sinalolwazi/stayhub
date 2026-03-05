import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Form, InputGroup, Button } from "react-bootstrap"; 
import { Search, MapPin } from "lucide-react";


import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function LocationMap({ location }) {
  const [position, setPosition] = useState([-26.2041, 28.0473]); // Default to Johannesburg
  const [searchLocation, setSearchLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Set default position based on common South African cities
  useEffect(() => {
    const locationLower = location.toLowerCase();
    if (locationLower.includes('cape town')) {
      setPosition([-33.9249, 18.4241]);
    } else if (locationLower.includes('johannesburg') || locationLower.includes('joburg')) {
      setPosition([-26.2041, 28.0473]);
    } else if (locationLower.includes('durban')) {
      setPosition([-29.8587, 31.0218]);
    } else if (locationLower.includes('pretoria')) {
      setPosition([-25.7479, 28.2293]);
    } else if (locationLower.includes('port elizabeth')) {
      setPosition([-33.9608, 25.6022]);
    } else if (locationLower.includes('bloemfontein')) {
      setPosition([-29.0852, 26.1596]);
    }
  }, [location]);

  const searchForLocation = async () => {
    if (!searchLocation.trim()) {
      alert("Please enter a location to search");
      return;
    }
    
    setIsLoading(true);
    try {
      // Using OpenStreetMap Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchLocation)}, South Africa&limit=1`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setPosition([lat, lon]);
        alert(`Found location: ${data[0].display_name}`);
      } else {
        alert("Location not found. Please try a different search term.");
      }
    } catch (error) {
      console.error("Error searching for location:", error);
      alert("Error searching for location. Please try again.");
    }
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchForLocation();
    }
  };

  return (
    <div className="mb-4">
      {/* Location Search */}
      <InputGroup className="mb-3">
        <InputGroup.Text className="bg-white border-end-0 border-secondary">
          <Search size={18} className="text-primary" />
        </InputGroup.Text>
        <Form.Control
          placeholder="Search for a location in South Africa..."
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          onKeyPress={handleKeyPress}
          className="border-start-0 border-secondary"
        />
        <Button 
          onClick={searchForLocation}
          disabled={isLoading}
          variant="primary"
          style={{ backgroundColor: "#2C3E50", border: "none" }}
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </InputGroup>

      {/* Map */}
      <div className="border border-secondary rounded mb-3" style={{ height: "300px", width: "100%" }}>
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              <div className="text-center">
                <MapPin size={16} className="mb-1 text-primary" />
                <div className="fw-medium text-dark">{location}</div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="d-flex align-items-center text-dark small">
        <MapPin size={16} className="me-1 text-primary" />
        Approximate location: {location}
      </div>
    </div>
  );
}