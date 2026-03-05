import React, { useState } from "react";
import { CreditCard, MapPin } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { Card, Form, Button, Alert, Row, Col } from "react-bootstrap";

import LocationMap from "./LocationMap";

export default function BookingForm({ property, user, onBooking, isLoading }) {
  const [formData, setFormData] = useState({
    check_in_date: "",
    check_out_date: "",
    num_guests: 1,
    guest_name: user?.name || "",
    guest_phone: "",
    special_requests: "",
  });

  const [showLocationMap, setShowLocationMap] = useState(false);

  const calculateNights = () => {
    if (!formData.check_in_date || !formData.check_out_date) return 0;
    return differenceInDays(
      new Date(formData.check_out_date),
      new Date(formData.check_in_date)
    );
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights * property.price_per_night;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onBooking({
      ...formData,
      total_price: calculateTotal(),
    });
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nights = calculateNights();
  const total = calculateTotal();

  return (
    <div className="mb-4">
      {/* Booking Card */}
      <Card className="mb-4 shadow-sm border-0">
        <Card.Header className="bg-primary text-white d-flex align-items-center gap-2">
          <CreditCard size={20} className="text-white" />
          <h2 className="h5 mb-0 text-white">Reserve Your Stay</h2>
        </Card.Header>
        <Card.Body className="bg-light">
          <Form onSubmit={handleSubmit}>
            {!user && (
              <Alert variant="info" className="mb-4">
                You'll need to sign in to complete your booking
              </Alert>
            )}

            {/* Date Inputs */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium text-dark">Check-in</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.check_in_date}
                    onChange={(e) => updateField("check_in_date", e.target.value)}
                    min={format(new Date(), "yyyy-MM-dd")}
                    required
                    className="border-secondary"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium text-dark">Check-out</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.check_out_date}
                    onChange={(e) => updateField("check_out_date", e.target.value)}
                    min={
                      formData.check_in_date || format(new Date(), "yyyy-MM-dd")
                    }
                    required
                    className="border-secondary"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Guests */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-dark">Number of Guests</Form.Label>
              <Form.Select
                value={formData.num_guests}
                onChange={(e) =>
                  updateField("num_guests", parseInt(e.target.value))
                }
                className="border-secondary"
              >
                {Array.from({ length: property.max_guests }, (_, i) => i + 1).map(
                  (num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Guest" : "Guests"}
                    </option>
                  )
                )}
              </Form.Select>
            </Form.Group>

            {/* Name */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-dark">Full Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.guest_name}
                onChange={(e) => updateField("guest_name", e.target.value)}
                placeholder="Your full name"
                required
                className="border-secondary"
              />
            </Form.Group>

            {/* Phone */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-dark">Phone Number</Form.Label>
              <Form.Control
                type="tel"
                value={formData.guest_phone}
                onChange={(e) => updateField("guest_phone", e.target.value)}
                placeholder="Your phone number"
                required
                className="border-secondary"
              />
            </Form.Group>

            {/* Special Requests */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-dark">Special Requests</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={formData.special_requests}
                onChange={(e) => updateField("special_requests", e.target.value)}
                placeholder="Any special requests or notes..."
                className="border-secondary"
              />
            </Form.Group>

            {/* Price Summary */}
            {nights > 0 && (
              <Card className="bg-white border-primary mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between small text-muted mb-2">
                    <span>R{property.price_per_night} × {nights} nights</span>
                    <span>R{property.price_per_night * nights}</span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold border-top pt-2 text-primary">
                    <span>Total</span>
                    <span>R{total}</span>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant={user ? "primary" : "secondary"}
              disabled={isLoading || nights <= 0}
              className="w-100 py-2 fw-medium"
              style={{ backgroundColor: user ? "#2C3E50" : "", border: "none" }}
            >
              {isLoading
                ? "Processing..."
                : user
                ? "Reserve Now"
                : "Sign in to Reserve"}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Location Card */}
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <MapPin size={20} className="text-white" />
            <h3 className="h5 mb-0 text-white">Location</h3>
          </div>
          <Button
            variant="outline-light"
            size="sm"
            onClick={() => setShowLocationMap(!showLocationMap)}
          >
            {showLocationMap ? 'Hide Map' : 'Show Map'}
          </Button>
        </Card.Header>
        <Card.Body className="bg-light">
          <p className="text-dark mb-3">{property.location}</p>
          {showLocationMap && <LocationMap location={property.location} />}
        </Card.Body>
      </Card>
    </div>
  );
}