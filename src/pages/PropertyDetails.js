import React, { useState, useEffect, useCallback } from "react";
import Property from "../entities/Property";
import Booking from "../entities/Booking";
import User from '../entities/User';
import createPageUrl from '../utils/createPageUrl';
import { useNavigate } from "react-router-dom";

// ✂️ REMOVED unused: Calendar, Star
import {
  MapPin, Users, Bed, Bath, Wifi, Car, Coffee, ArrowLeft
} from "lucide-react";
import { Button, Card, Alert } from "react-bootstrap";

import PropertyGallery from "../components/properties/PropertyGallery";
import BookingForm from "../components/booking/BookingForm";

export default function PropertyDetails() {
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Get property ID from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const propertyId = urlParams.get('id');

  const loadProperty = useCallback(async () => {
    if (!propertyId) {
      setIsLoading(false);
      return;
    }
    try {
      const propertyData = await Property.filter({ id: propertyId });
      if (propertyData.length > 0) {
        setProperty(propertyData[0]);
      } else {
        setProperty(null);
      }
    } catch (error) {
      console.error("Error loading property:", error);
      setProperty(null);
    }
    setIsLoading(false);
  }, [propertyId]);

  const loadUser = useCallback(async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      // User not logged in — that's okay
    }
  }, []);

  useEffect(() => {
    loadProperty();
    loadUser();
  }, [loadProperty, loadUser]);

  const handleBooking = async (bookingData) => {
    if (!user) {
      await User.loginWithRedirect(window.location.href);
      return;
    }

    setBookingLoading(true);
    try {
      await Booking.create({
        ...bookingData,
        property_id: property.id,
        guest_email: user.email
      });
      setBookingSuccess(true);
      setTimeout(() => {
        navigate(createPageUrl("MyBookings"));
      }, 2000);
    } catch (error) {
      console.error("Error creating booking:", error);
    }
    setBookingLoading(false);
  };

  const amenityIcons = {
    wifi: Wifi,
    parking: Car,
    coffee: Coffee,
  };

  if (isLoading) {
    return (
      <div className="py-4" style={{ backgroundColor: "#ECF0F1" }}>
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border" role="status" style={{ color: "#3498DB" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ backgroundColor: "#ECF0F1", minHeight: "100vh" }}>
        <div className="text-center">
          <h2 className="h3 fw-bold mb-4 text-dark">Property not found</h2>
          <Button onClick={() => navigate(createPageUrl("Home"))} className="border-0" style={{ backgroundColor: "#3498DB" }}>
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4" style={{ backgroundColor: "#ECF0F1" }}>
      <div className="container">
        {bookingSuccess && (
          <Alert variant="success" className="mb-4" style={{ backgroundColor: "#D5F5E3", borderColor: "#27AE60", color: "#145A32" }}>
            Booking successful! Redirecting to your bookings...
          </Alert>
        )}

        <div className="d-flex align-items-center mb-4">
          <Button
            size="sm"
            onClick={() => navigate(createPageUrl("Home"))}
            className="me-3 border-0"
            style={{ backgroundColor: "#2C3E50" }}
          >
            <ArrowLeft size={16} className="text-white" />
          </Button>
          <div>
            <h1 className="h3 mb-1 text-dark">{property.title}</h1>
            <div className="d-flex align-items-center small" style={{ color: "#7F8C8D" }}>
              <MapPin size={14} className="me-1" style={{ color: "#3498DB" }} />
              <span>{property.location}</span>
            </div>
          </div>
        </div>

        <PropertyGallery images={property.images} title={property.title} />

        <div className="row g-4 mt-4">
          <div className="col-lg-8">
            {/* Property Info */}
            <Card className="mb-4 border-0 shadow-sm" style={{ backgroundColor: "#FFFFFF" }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h2 className="h5 mb-3 text-dark">
                      {property.property_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h2>
                    <div className="d-flex flex-wrap gap-3 small" style={{ color: "#7F8C8D" }}>
                      <div className="d-flex align-items-center">
                        <Users size={14} className="me-1" style={{ color: "#3498DB" }} />
                        <span>{property.max_guests} guests</span>
                      </div>
                      {property.bedrooms && (
                        <div className="d-flex align-items-center">
                          <Bed size={14} className="me-1" style={{ color: "#3498DB" }} />
                          <span>{property.bedrooms} bedrooms</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="d-flex align-items-center">
                          <Bath size={14} className="me-1" style={{ color: "#3498DB" }} />
                          <span>{property.bathrooms} bathrooms</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold h4 mb-0" style={{ color: "#3498DB" }}>R{property.price_per_night}</div>
                    <div className="small" style={{ color: "#7F8C8D" }}>per night</div>
                  </div>
                </div>

                <div>
                  <p style={{ color: "#7F8C8D" }}>{property.description}</p>
                </div>
              </Card.Body>
            </Card>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <Card className="mb-4 border-0 shadow-sm" style={{ backgroundColor: "#FFFFFF" }}>
                <Card.Header className="pb-0" style={{ backgroundColor: "#FFFFFF" }}>
                  <h3 className="h5 mb-0 text-dark">Amenities</h3>
                </Card.Header>
                <Card.Body>
                  <div className="row g-3">
                    {property.amenities.map((amenity, index) => {
                      const IconComponent = amenityIcons[amenity.toLowerCase()] || Coffee;
                      return (
                        <div key={index} className="col-6 col-md-4">
                          <div className="d-flex align-items-center">
                            <IconComponent size={16} className="me-2" style={{ color: "#3498DB" }} />
                            <span className="small text-dark">{amenity.replace('_', ' ')}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* House Rules */}
            {property.house_rules && (
              <Card className="border-0 shadow-sm" style={{ backgroundColor: "#FFFFFF" }}>
                <Card.Header className="pb-0" style={{ backgroundColor: "#FFFFFF" }}>
                  <h3 className="h5 mb-0 text-dark">House Rules</h3>
                </Card.Header>
                <Card.Body>
                  <p style={{ color: "#7F8C8D" }}>{property.house_rules}</p>
                </Card.Body>
              </Card>
            )}
          </div>

          {/* Booking Form */}
          <div className="col-lg-4">
            <div className="sticky-top" style={{ top: '20px' }}>
              <BookingForm
                property={property}
                user={user}
                onBooking={handleBooking}
                isLoading={bookingLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}