import React, { useState, useEffect } from "react";
import Property from "../entities/Property";
import Booking from "../entities/Booking";
import User from "../entities/User";
import { Plus, Building2, Eye, Calendar } from "lucide-react";
import { Button, Card, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { createPageUrl } from '../utils/index';

export default function MyProperties() {
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMyProperties();
  }, []);

  const loadMyProperties = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      const propertyData = await Property.filter({ created_by: user.email }, "-created_date");
      setProperties(propertyData);

      // Load bookings for these properties
      const propertyIds = propertyData.map(p => p.id);
      if (propertyIds.length > 0) {
        const allBookings = [];
        for (const propertyId of propertyIds) {
          const propertyBookings = await Booking.filter({ property_id: propertyId });
          allBookings.push(...propertyBookings);
        }
        setBookings(allBookings);
      }
    } catch (error) {
      console.error("Error loading properties:", error);
    }
    setIsLoading(false);
  };

  const getPropertyBookings = (propertyId) => {
    return bookings.filter(booking => booking.property_id === propertyId);
  };

  const getTotalEarnings = (propertyId) => {
    const propertyBookings = getPropertyBookings(propertyId);
    return propertyBookings
      .filter(booking => booking.status === 'confirmed' || booking.status === 'completed')
      .reduce((sum, booking) => sum + booking.total_price, 0);
  };

  if (isLoading) {
    return (
      <div className="py-4" style={{ backgroundColor: "#ECF0F1" }}>
        <div className="container">
          <h1 className="h3 mb-4 text-dark">My Properties</h1>
          <div className="row g-4">
            {Array(6).fill(0).map((_, i) => (
              <div className="col-12 col-md-6 col-lg-4" key={i}>
                <Card className="border-0 shadow-sm" style={{ backgroundColor: "#FFFFFF" }}>
                  <div style={{ height: '200px', backgroundColor: "#BDC3C7" }}></div>
                  <Card.Body>
                    <div className="mb-2" style={{ height: '20px', borderRadius: '4px', backgroundColor: "#BDC3C7" }}></div>
                    <div style={{ height: '15px', width: '60%', borderRadius: '4px', backgroundColor: "#BDC3C7" }}></div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4" style={{ backgroundColor: "#ECF0F1" }}>
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
          <div>
            <h1 className="h3 fw-bold mb-2 text-dark">My Properties</h1>
            <p style={{ color: "#7F8C8D" }}>Monkey your company's fittings and bindings</p>
          </div>
          <Link to={createPageUrl("AddProperty")}>
            <Button className="d-flex align-items-center border-0" style={{ backgroundColor: "#3498DB" }}>
              <Plus size={18} className="me-2" />
              Add New Property
            </Button>
          </Link>
        </div>

       
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <Card className="border-0 shadow-sm text-center h-100" style={{ backgroundColor: "#FFFFFF" }}>
              <Card.Body className="p-4">
                <div className="display-6 fw-bold text-dark">{properties.length}</div>
                <div style={{ color: "#7F8C8D" }}>Total Properties</div>
              </Card.Body>
            </Card>
          </div>

          <div className="col-md-4">
            <Card className="border-0 shadow-sm text-center h-100" style={{ backgroundColor: "#FFFFFF" }}>
              <Card.Body className="p-4">
                <div className="display-6 fw-bold text-dark">{bookings.length}</div>
                <div style={{ color: "#7F8C8D" }}>Total Readings</div>
              </Card.Body>
            </Card>
          </div>

          <div className="col-md-4">
            <Card className="border-0 shadow-sm text-center h-100" style={{ backgroundColor: "#FFFFFF" }}>
              <Card.Body className="p-4">
                <div className="display-6 fw-bold text-dark">
                  R{bookings
                    .filter(b => b.status === 'confirmed' || b.status === 'completed')
                    .reduce((sum, b) => sum + b.total_price, 0)
                  }
                </div>
                <div style={{ color: "#7F8C8D" }}>Total Earnings</div>
              </Card.Body>
            </Card>
          </div>
        </div>

        {properties.length === 0 ? (
          <Card className="text-center border-0 shadow-sm p-5" style={{ backgroundColor: "#FFFFFF" }}>
            <div className="d-inline-flex align-items-center justify-content-center border rounded-circle p-3 mb-3" style={{ width: '60px', height: '60px', backgroundColor: "#ECF0F1", borderColor: "#BDC3C7" }}>
              <Building2 size={32} style={{ color: "#7F8C8D" }} />
            </div>
            <Card.Title className="h4 fw-bold mb-2 text-dark">No properties yet</Card.Title>
            <Card.Text style={{ color: "#7F8C8D" }} className="mb-4">Start hosting by adding your first property</Card.Text>
            <Link to={createPageUrl("AddProperty")}>
              <Button className="d-flex align-items-center border-0" style={{ backgroundColor: "#3498DB" }}>
                <Plus size={18} className="me-2" />
                Add Your First Property
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="row">
            {properties.map((property) => {
              const propertyBookings = getPropertyBookings(property.id);
              const earnings = getTotalEarnings(property.id);
              
              return (
                <div className="col-12 mb-4" key={property.id}>
                  <Card className="border-0 shadow-sm" style={{ backgroundColor: "#FFFFFF" }}>
                    <div className="row g-0">
                      {/* Clickable Image */}
                      <div className="col-md-4">
                        <Link to={createPageUrl(`PropertyDetails?id=${property.id}`)}>
                          <div style={{ height: '200px', overflow: 'hidden' }}>
                            <Image
                              src={property.images?.[0] || "https://images.unsplash.com/photo-1568605114967-8130f3a36994"}
                              alt={property.title}
                              className="w-100 h-100"
                              style={{ objectFit: 'cover', cursor: 'pointer' }}
                            />
                          </div>
                        </Link>
                      </div>
                      
                      <div className="col-md-8">
                        <Card.Body className="h-100 d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h5 className="text-dark mb-0">{property.title}</h5>
                            <Link to={createPageUrl(`PropertyDetails?id=${property.id}`)}>
                              <Button size="sm" className="rounded-circle p-2 border-0" style={{ backgroundColor: "#2C3E50" }}>
                                <Eye size={16} className="text-white" />
                              </Button>
                            </Link>
                          </div>
                          
                          <p className="small mb-3" style={{ color: "#7F8C8D" }}>{property.location}</p>
                          
                          <div className="mt-auto">
                            <div className="row">
                              <div className="col-4">
                                <div className="border-end pe-3" style={{ borderColor: "#BDC3C7" }}>
                                  <div className="small" style={{ color: "#7F8C8D" }}>Price per night:</div>
                                  <div className="fw-medium" style={{ color: "#3498DB" }}>R{property.price_per_night}</div>
                                </div>
                              </div>
                              <div className="col-4">
                                <div className="border-end pe-3" style={{ borderColor: "#BDC3C7" }}>
                                  <div className="small" style={{ color: "#7F8C8D" }}>Total bookings:</div>
                                  <div className="fw-medium" style={{ color: "#3498DB" }}>{propertyBookings.length}</div>
                                </div>
                              </div>
                              <div className="col-4">
                                <div>
                                  <div className="small" style={{ color: "#7F8C8D" }}>Total earnings:</div>
                                  <div className="fw-medium" style={{ color: "#27AE60" }}>R{earnings}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}