import React, { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { Button, Container, Row, Col, Card, Modal, Image, Badge, Form } from "react-bootstrap";

import PropertyCard from "../components/properties/PropertyCard";
import SearchFilters from "../components/properties/SearchFilters";
import HeroSection from "../components/home/HeroSection";

// ✅ MOVED OUTSIDE COMPONENT — now static and stable
const mockProperties = [
  {
    id: 1,
    title: "Luxury Beach Villa",
    location: "Cape Town, South Africa",
    images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994  "],
    price_per_night: 1200,
    property_type: "villa",
    max_guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    description: "Stunning beachfront villa with panoramic ocean views, private pool, and direct beach access. Perfect for families and groups.",
    amenities: ["WIFI", "TV", "Kitchen", "Pool", "Parking", "Beach Access"],
    house_rules: ["No smoking indoors", "No pets allowed", "Check-in after 2 PM", "Check-out before 11 AM", "Quiet hours: 10 PM - 8 AM"],
    is_available: true,
    created_date: "2023-10-15"
  },
  {
    id: 2,
    title: "Modern City Apartment",
    location: "Johannesburg, South Africa",
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2  "],
    price_per_night: 800,
    property_type: "apartment",
    max_guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    description: "Contemporary apartment in the heart of the city with stunning skyline views and easy access to business districts.",
    amenities: ["WIFI", "TV", "Kitchen", "Gym", "Parking"],
    house_rules: ["No smoking", "No parties", "Check-in after 3 PM", "Check-out before 10 AM"],
    is_available: true,
    created_date: "2023-09-20"
  },
  {
    id: 3,
    title: "Cozy Mountain Cabin",
    location: "Drakensberg, South Africa",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267  "],
    price_per_night: 600,
    property_type: "cabin",
    max_guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    description: "Rustic cabin nestled in the mountains with fireplace, hiking trails, and breathtaking mountain views.",
    amenities: ["WIFI", "Fireplace", "Kitchen", "BBQ", "Hiking Trails"],
    house_rules: ["No smoking", "Pets allowed with fee", "Check-in after 2 PM", "Check-out before 11 AM"],
    is_available: true,
    created_date: "2023-11-05"
  },
  {
    id: 4,
    title: "Modern Downtown Loft",
    location: "123 Main Street, Cape Town, Western Cape",
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00  "],
    price_per_night: 850,
    property_type: "apartment",
    max_guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    description: "Stylish modern loft in the heart of downtown with floor-to-ceiling windows, exposed brick walls, and amazing city views. Perfect for business travelers and couples looking for a stylish stay.",
    amenities: ["WIFI", "TV", "Kitchen", "Workspace"],
    house_rules: ["No smoking indoors", "No pets allowed", "Check-in after 2 PM", "Check-out before 11 AM", "Quiet hours: 10 PM - 8 AM"],
    is_available: true,
    created_date: "2023-08-12"
  },
  {
    id: 5,
    title: "Seaside Beach House",
    location: "Durban, South Africa",
    images: ["https://images.unsplash.com/photo-1510798831971-661eb04b3739  "],
    price_per_night: 1400,
    property_type: "house",
    max_guests: 10,
    bedrooms: 5,
    bathrooms: 3,
    description: "Spacious beach house with direct beach access, large deck, and ocean views. Perfect for large families and groups.",
    amenities: ["WIFI", "TV", "Kitchen", "Pool", "Beach Access", "BBQ"],
    house_rules: ["No smoking indoors", "No pets allowed", "Check-in after 3 PM", "Check-out before 10 AM"],
    is_available: true,
    created_date: "2023-07-22"
  },
  {
    id: 6,
    title: "Urban Studio Apartment",
    location: "Pretoria, South Africa",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688  "],
    price_per_night: 1700,
    property_type: "studio",
    max_guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    description: "Modern studio apartment in the city center with all amenities included. Perfect for solo travelers or couples.",
    amenities: ["WIFI", "TV", "Kitchenette", "Workspace", "Parking"],
    house_rules: ["No smoking", "No pets", "Check-in after 2 PM", "Check-out before 11 AM"],
    is_available: true,
    created_date: "2023-06-18"
  },
  {
    id: 7,
    title: "Luxury Hotel Suite",
    location: "Sandton, Johannesburg",
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945  "],
    price_per_night: 800,
    property_type: "hotel",
    max_guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    description: "Elegant hotel suite with premium amenities, room service, and access to hotel facilities including pool and gym.",
    amenities: ["WIFI", "TV", "Room Service", "Gym", "Pool", "Spa"],
    house_rules: ["No smoking", "No pets", "Check-in after 3 PM", "Check-out before 12 PM"],
    is_available: true,
    created_date: "2023-05-30"
  },
  {
    id: 8,
    title: "Mountain View Retreat",
    location: "Stellenbosch, Western Cape",
    images: ["https://images.unsplash.com/photo-1449824913935-59a10b8d2000  "],
    price_per_night: 1100,
    property_type: "house",
    max_guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    description: "Beautiful retreat with stunning mountain views, wine estate proximity, and luxurious amenities.",
    amenities: ["WIFI", "TV", "Kitchen", "Fireplace", "Wine Tasting", "Pool"],
    house_rules: ["No smoking indoors", "Pets considered", "Check-in after 2 PM", "Check-out before 11 AM"],
    is_available: true,
    created_date: "2023-04-15"
  },
  {
    id: 9,
    title: "Lakeside Cottage",
    location: "Knysna, Garden Route",
    images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d  "],
    price_per_night: 950,
    property_type: "cabin",
    max_guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    description: "Charming cottage by the lake with fishing access, kayaks, and peaceful surroundings.",
    amenities: ["WIFI", "TV", "Kitchen", "Kayaks", "Fishing", "BBQ"],
    house_rules: ["No smoking", "Pets allowed", "Check-in after 2 PM", "Check-out before 11 AM"],
    is_available: true,
    created_date: "2023-03-10"
  },
  {
    id: 10,
    title: "Designer Penthouse",
    location: "Waterfront, Cape Town",
    images: ["https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf  "],
    price_per_night: 2500,
    property_type: "apartment",
    max_guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    description: "Luxurious penthouse with panoramic views of the waterfront and Table Mountain. Designer furnishings and premium amenities.",
    amenities: ["WIFI", "TV", "Kitchen", "Pool", "Gym", "Concierge", "Parking"],
    house_rules: ["No smoking", "No pets", "No parties", "Check-in after 4 PM", "Check-out before 11 AM"],
    is_available: true,
    created_date: "2023-02-28"
  }
];

// ✅ FIXED: Moved BookingModal OUTSIDE Home component to prevent re-creation on every render
const BookingModal = ({ show, property, onClose, onSubmit, formData, setFormData }) => {
  // Helper to calculate total price (copied from Home component)
  const calculateTotalPrice = () => {
    if (!formData.check_in_date || !formData.check_out_date || !property) return 0;
    const nights = Math.ceil((new Date(formData.check_out_date) - new Date(formData.check_in_date)) / (1000 * 60 * 60 * 24));
    return nights * property.price_per_night;
  };

  const totalPrice = calculateTotalPrice();

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Reserve Your Stay</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {property && (
          <div className="mb-4">
            <h5>{property.title}</h5>
            <p className="text-muted mb-2">{property.location}</p>
            <div className="d-flex justify-content-between align-items-center">
              <span>Total: </span>
              <strong className="text-primary">R{totalPrice}</strong>
            </div>
            {formData.check_in_date && formData.check_out_date && (
              <small className="text-muted">
                {property.price_per_night}/night × {Math.ceil((new Date(formData.check_out_date) - new Date(formData.check_in_date)) / (1000 * 60 * 60 * 24))} nights
              </small>
            )}
          </div>
        )}

        <Form onSubmit={onSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Check-in</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.check_in_date}
                  onChange={(e) => setFormData({...formData, check_in_date: e.target.value})}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Check-out</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.check_out_date}
                  onChange={(e) => setFormData({...formData, check_out_date: e.target.value})}
                  required
                  min={formData.check_in_date}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Number of Guests</Form.Label>
            <Form.Select
              value={formData.num_guests}
              onChange={(e) => setFormData({...formData, num_guests: parseInt(e.target.value)})}
              required
            >
              {Array.from({ length: property?.max_guests || 8 }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.guest_name}
              onChange={(e) => setFormData({...formData, guest_name: e.target.value})}
              placeholder="Your full name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              value={formData.guest_phone}
              onChange={(e) => setFormData({...formData, guest_phone: e.target.value})}
              placeholder="Your phone number"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Special Requests</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.special_requests}
              onChange={(e) => setFormData({...formData, special_requests: e.target.value})}
              placeholder="Any special requests or notes..."
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Confirm Reservation
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    property_type: "all",
    min_price: "",
    max_price: "",
    min_guests: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showPropertyDetail, setShowPropertyDetail] = useState({ show: false, property: null });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    check_in_date: "",
    check_out_date: "",
    num_guests: 1,
    guest_name: "",
    guest_phone: "",
    special_requests: ""
  });

  const loadProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      setProperties(mockProperties);
    } catch (error) {
      console.error("Error loading properties:", error);
    }
    setIsLoading(false);
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = properties;

    if (searchQuery.trim()) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.property_type !== "all") {
      filtered = filtered.filter(property => property.property_type === filters.property_type);
    }

    if (filters.min_price) {
      filtered = filtered.filter(property => property.price_per_night >= parseInt(filters.min_price));
    }
    if (filters.max_price) {
      filtered = filtered.filter(property => property.price_per_night <= parseInt(filters.max_price));
    }

    if (filters.min_guests) {
      filtered = filtered.filter(property => property.max_guests >= parseInt(filters.min_guests));
    }

    setFilteredProperties(filtered);
  }, [properties, searchQuery, filters]);

  const handleImageClick = (property) => {
    setShowPropertyDetail({ show: true, property });
  };

  const handleReserveClick = (property) => {
    setShowPropertyDetail({ show: false, property: null });
    setShowBookingModal(true);
    setBookingForm({
      ...bookingForm,
      num_guests: property.max_guests > 1 ? 2 : 1
    });
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    
    const newBooking = {
      id: Date.now(),
      property_id: showPropertyDetail.property?.id || null,
      property_type: showPropertyDetail.property?.property_type || "apartment",
      check_in_date: bookingForm.check_in_date,
      check_out_date: bookingForm.check_out_date,
      num_guests: bookingForm.num_guests,
      guest_name: bookingForm.guest_name,
      guest_phone: bookingForm.guest_phone,
      special_requests: bookingForm.special_requests,
      total_price: calculateTotalPrice(),
      status: "pending",
      payment_status: "pending",
      created_date: new Date().toISOString().split('T')[0]
    };
    
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const updatedBookings = [...existingBookings, newBooking];
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    
    setShowBookingModal(false);
    setShowPropertyDetail({ show: false, property: null });
    setBookingForm({
      check_in_date: "",
      check_out_date: "",
      num_guests: 1,
      guest_name: "",
      guest_phone: "",
      special_requests: ""
    });
    
    alert("Booking created successfully! You can view it in My Bookings page.");
  };

  const calculateTotalPrice = () => {
    if (!bookingForm.check_in_date || !bookingForm.check_out_date || !showPropertyDetail.property) return 0;
    
    const nights = Math.ceil((new Date(bookingForm.check_out_date) - new Date(bookingForm.check_in_date)) / (1000 * 60 * 60 * 24));
    return nights * showPropertyDetail.property.price_per_night;
  };

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // --- PropertyDetailModal (unchanged - still inside Home) ---
  const PropertyDetailModal = ({ show, property, onClose, onReserve }) => {
    if (!property) return null;

    return (
      <Modal show={show} onHide={onClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{property.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <Image
              src={property.images[0]}
              alt={property.title}
              fluid
              className="rounded"
              style={{ height: '300px', width: '100%', objectFit: 'cover' }}
            />
          </div>
          
          <div className="mb-3">
            <h5 className="text-dark">{property.title}</h5>
            <p className="text-muted mb-2">
              <i className="bi bi-geo-alt"></i> {property.location}
            </p>
          </div>

          <Row className="mb-4">
            <Col md={6}>
              <div className="d-flex align-items-center mb-2">
                <strong className="me-2">Property Type:</strong>
                <span className="text-capitalize">{property.property_type}</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <strong className="me-2">Guests:</strong>
                <span>{property.max_guests} guests</span>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center mb-2">
                <strong className="me-2">Bedrooms:</strong>
                <span>{property.bedrooms} bedrooms</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <strong className="me-2">Bathrooms:</strong>
                <span>{property.bathrooms} bathrooms</span>
              </div>
            </Col>
          </Row>

          <div className="mb-4">
            <p>{property.description}</p>
          </div>

          <Row className="mb-4">
            <Col md={6}>
              <h6 className="mb-3">Amenities</h6>
              <div className="d-flex flex-wrap gap-2">
                {property.amenities.map((amenity, index) => (
                  <Badge key={index} bg="light" text="dark" className="px-3 py-2">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </Col>
            <Col md={6}>
              <h6 className="mb-3">House Rules</h6>
              <ul className="ps-3">
                {property.house_rules.map((rule, index) => (
                  <li key={index} className="text-muted small">{rule}</li>
                ))}
              </ul>
            </Col>
          </Row>

          <div className="border-top pt-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="text-primary mb-0">R{property.price_per_night}</h4>
                <small className="text-muted">per night</small>
              </div>
              <Button 
                variant="primary" 
                onClick={onReserve}
                className="px-4"
              >
                Reserve Now
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <div style={{ backgroundColor: "#ECF0F1" }}>
      <HeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={() => applyFilters()}
      />

      <Container className="py-4">
        <SearchFilters
          filters={filters}
          setFilters={setFilters}
          onFilterChange={applyFilters}
        />

        <div className="mb-4 text-center">
          <h2 className="h3 fw-bold mb-2 text-dark">
            {filteredProperties.length} Properties Found
          </h2>
          <p style={{ color: "#7F8C8D" }}>Discover amazing places to stay around South Africa</p>
        </div>

        {isLoading ? (
          <Row className="g-4">
            {Array(8).fill(0).map((_, i) => (
              <Col md={6} lg={4} xl={3} key={i}>
                <Card className="border-0 shadow-sm" style={{ backgroundColor: "#ECF0F1" }}>
                  <div style={{ height: '200px', backgroundColor: "#BDC3C7" }}></div>
                  <Card.Body>
                    <div className="mb-2" style={{ height: '20px', borderRadius: '4px', backgroundColor: "#BDC3C7" }}></div>
                    <div className="mb-3" style={{ height: '15px', width: '80%', borderRadius: '4px', backgroundColor: "#BDC3C7" }}></div>
                    <div style={{ height: '15px', width: '40%', borderRadius: '4px', backgroundColor: "#BDC3C7" }}></div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-5">
            <div className="d-inline-flex align-items-center justify-content-center border rounded-circle p-3 mb-3" style={{ width: '60px', height: '60px', backgroundColor: "#ECF0F1", borderColor: "#BDC3C7" }}>
              <Search size={32} style={{ color: "#7F8C8D" }} />
            </div>
            <h3 className="h4 fw-bold mb-2 text-dark">No properties found</h3>
            <p style={{ color: "#7F8C8D" }} className="mb-4">Try adjusting your search criteria or filters</p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setFilters({ property_type: "all", min_price: "", max_price: "", min_guests: "" });
              }}
              className="border-0"
              style={{ backgroundColor: "#3498DB" }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <Row className="g-4">
            {filteredProperties.map((property) => (
              <Col md={6} lg={4} xl={3} key={property.id}>
                <PropertyCard 
                  property={property} 
                  onImageClick={() => handleImageClick(property)}
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>

      <PropertyDetailModal
        show={showPropertyDetail.show}
        property={showPropertyDetail.property}
        onClose={() => setShowPropertyDetail({ show: false, property: null })}
        onReserve={() => handleReserveClick(showPropertyDetail.property)}
      />

      {/* ✅ Now using the stable, external BookingModal */}
      <BookingModal
        show={showBookingModal}
        property={showPropertyDetail.property}
        onClose={() => setShowBookingModal(false)}
        onSubmit={handleBookingSubmit}
        formData={bookingForm}
        setFormData={setBookingForm}
      />
    </div>
  );
}