import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Eye, X, ChevronLeft, ChevronRight, Plus, Edit2, Trash2, CreditCard, Wallet, Landmark } from "lucide-react";
import { Card, Badge, Image, Button, Modal, Form, Row, Col, Alert } from "react-bootstrap";
import { format, differenceInDays } from "date-fns";

// ✅ MOVED OUTSIDE COMPONENT — now static and stable
const mockProperties = {
  1: {
    id: 1,
    title: "Luxury Beach Villa",
    location: "Cape Town, South Africa",
    images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994"],
    price_per_night: 1200,
    type: "villa"
  },
  2: {
    id: 2,
    title: "Modern City Apartment",
    location: "Johannesburg, South Africa",
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"],
    price_per_night: 800,
    type: "apartment"
  },
  3: {
    id: 3,
    title: "Cozy Mountain Cabin",
    location: "Drakensberg, South Africa",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"],
    price_per_night: 600,
    type: "cabin"
  }
};

// Property type prices per night
const propertyPrices = {
  villa: 1200,
  house: 1400,
  apartment: 800,
  cabin: 600,
  hotel: 800,
  studio: 1700,
  other: 1000
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showGallery, setShowGallery] = useState({ show: false, images: [], title: '' });
  const [showBooking, setShowBooking] = useState({ show: false, property: null, booking: null, isEdit: false });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState({ show: false, bookingId: null });
  const [showPayment, setShowPayment] = useState({ show: false, booking: null });

  useEffect(() => {
    const savedBookings = localStorage.getItem('bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    } else {
      setBookings([]); 
    }
    
    setProperties(mockProperties); // ✅ Now safe — mockProperties is stable
    setIsLoading(false);
  }, []); // ✅ Empty deps — no missing dependency warning

  // ✂️ REMOVED: getStatusVariant — never used
  // ✂️ REMOVED: handleMakeBooking — never used (inline setShowBooking is used instead)

  const calculateTotalPrice = (propertyType, checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    
    const nights = Math.ceil(differenceInDays(new Date(checkOut), new Date(checkIn)));
    const pricePerNight = propertyPrices[propertyType] || propertyPrices.other;
    
    return nights * pricePerNight;
  };

  const handleEditBooking = (booking) => {
    setShowBooking({ 
      show: true, 
      property: properties[booking.property_id], 
      booking, 
      isEdit: true 
    });
  };

  const handleDeleteBooking = (bookingId) => {
    const updatedBookings = bookings.filter(b => b.id !== bookingId);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
    setShowDeleteConfirm({ show: false, bookingId: null });
    alert("Booking deleted successfully!");
  };

  const handlePayment = (booking) => {
    setShowPayment({ show: true, booking });
  };

  const handlePaymentSuccess = (bookingId) => {
    const updatedBookings = bookings.map(b => 
      b.id === bookingId 
        ? { ...b, status: "confirmed", payment_status: "paid" }
        : b
    );
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
    setShowPayment({ show: false, booking: null });
    alert("Payment successful! Your booking is now confirmed.");
  };

  // --- Modals (unchanged) ---
  const GalleryModal = ({ show, images, title, onClose }) => {
    const [selectedImage, setSelectedImage] = useState(0);

    if (!images || images.length === 0) return null;

    const nextImage = () => {
      setSelectedImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
      setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
      <Modal show={show} onHide={onClose} centered size="lg">
        <Modal.Body className="p-0 position-relative">
          <Image
            src={images[selectedImage]}
            alt={`${title} - Image ${selectedImage + 1}`}
            className="w-100"
            style={{ maxHeight: '80vh', objectFit: 'contain' }}
          />
          {images.length > 1 && (
            <>
              <Button
                variant="light"
                size="sm"
                className="position-absolute top-50 start-0 translate-middle-y rounded-circle p-2 m-2"
                onClick={prevImage}
                style={{ width: '40px', height: '40px' }}
              >
                <ChevronLeft size={20} />
              </Button>
              <Button
                variant="light"
                size="sm"
                className="position-absolute top-50 end-0 translate-middle-y rounded-circle p-2 m-2"
                onClick={nextImage}
                style={{ width: '40px', height: '40px' }}
              >
                <ChevronRight size={20} />
              </Button>
            </>
          )}
        </Modal.Body>
        <Modal.Header className="border-0 position-absolute top-0 end-0 p-2">
          <Button
            variant="light"
            size="sm"
            className="rounded-circle p-1"
            onClick={onClose}
            style={{ width: '30px', height: '30px' }}
          >
            <X size={16} />
          </Button>
        </Modal.Header>
      </Modal>
    );
  };

  const BookingModal = ({ show, property, booking, isEdit, onClose }) => {
    const [formData, setFormData] = useState({
      check_in_date: booking?.check_in_date || "",
      check_out_date: booking?.check_out_date || "",
      num_guests: booking?.num_guests || 1,
      guest_name: booking?.guest_name || "",
      guest_phone: booking?.guest_phone || "",
      special_requests: booking?.special_requests || "",
      property_type: booking?.property_type || (property ? property.type : ""),
      other_property_type: booking?.other_property_type || ""
    });

    const [calculatedPrice, setCalculatedPrice] = useState(0);

    useEffect(() => {
      if (booking) {
        setFormData({
          check_in_date: booking.check_in_date || "",
          check_out_date: booking.check_out_date || "",
          num_guests: booking.num_guests || 1,
          guest_name: booking.guest_name || "",
          guest_phone: booking.guest_phone || "",
          special_requests: booking.special_requests || "",
          property_type: booking.property_type || "",
          other_property_type: booking.other_property_type || ""
        });
      }
    }, [booking]);

    useEffect(() => {
      if (formData.check_in_date && formData.check_out_date && formData.property_type) {
        const price = calculateTotalPrice(
          formData.property_type, 
          formData.check_in_date, 
          formData.check_out_date
        );
        setCalculatedPrice(price);
      } else {
        setCalculatedPrice(0);
      }
    }, [formData.check_in_date, formData.check_out_date, formData.property_type]);

    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (!formData.property_type) {
        alert("Please select a property type");
        return;
      }
      
      if (formData.property_type === "other" && !formData.other_property_type) {
        alert("Please specify the property type");
        return;
      }
      
      try {
        let updatedBookings;
        
        if (isEdit && booking) {
          updatedBookings = bookings.map(b => 
            b.id === booking.id 
              ? { 
                  ...b, 
                  ...formData,
                  total_price: calculateTotalPrice(formData.property_type, formData.check_in_date, formData.check_out_date)
                }
              : b
          );
        } else {
          const newBooking = {
            id: Date.now(),
            property_id: property ? property.id : null,
            ...formData,
            total_price: calculateTotalPrice(formData.property_type, formData.check_in_date, formData.check_out_date),
            status: "pending",
            payment_status: "pending",
            created_date: new Date().toISOString().split('T')[0]
          };
          
          updatedBookings = [...bookings, newBooking];
        }
        
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
        setBookings(updatedBookings);
        
        if (isEdit) {
          alert("Booking updated successfully!");
        } else {
          alert("Booking created successfully! You can now proceed to payment.");
        }
        
        onClose();
      } catch (error) {
        console.error("Error processing booking:", error);
        alert("Error processing booking. Please try again.");
      }
    };

    return (
      <Modal show={show} onHide={onClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {isEdit ? "Edit Booking" : "Make a New Booking"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {!property && (
              <Form.Group className="mb-3">
                <Form.Label>Property Type</Form.Label>
                <Form.Select
                  value={formData.property_type}
                  onChange={(e) => setFormData({...formData, property_type: e.target.value})}
                  required
                >
                  <option value="">Select property type</option>
                  <option value="villa">Villa (R{propertyPrices.villa}/night)</option>
                  <option value="house">House (R{propertyPrices.house}/night)</option>
                  <option value="apartment">Apartment (R{propertyPrices.apartment}/night)</option>
                  <option value="cabin">Cabin (R{propertyPrices.cabin}/night)</option>
                  <option value="hotel">Hotel Room (R{propertyPrices.hotel}/night)</option>
                  <option value="studio">Studio (R{propertyPrices.studio}/night)</option>
                  <option value="other">Other (R{propertyPrices.other}/night)</option>
                </Form.Select>
                
                {formData.property_type === "other" && (
                  <Form.Control
                    type="text"
                    className="mt-2"
                    value={formData.other_property_type}
                    onChange={(e) => setFormData({...formData, other_property_type: e.target.value})}
                    placeholder="Please specify property type"
                    required
                  />
                )}
              </Form.Group>
            )}
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Check-in Date</Form.Label>
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
                  <Form.Label>Check-out Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.check_out_date}
                    onChange={(e) => setFormData({...formData, check_out_date: e.target.value})}
                    required
                    min={formData.check_in_date || new Date().toISOString().split('T')[0]}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Number of Guests</Form.Label>
              <Form.Select
                value={formData.num_guests}
                onChange={(e) => setFormData({...formData, num_guests: parseInt(e.target.value)})}
              >
                {[1,2,3,4,5,6,7,8].map(num => (
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

            {calculatedPrice > 0 && (
              <div className="mb-3 p-3 border rounded bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <strong>Total Amount:</strong>
                  <span className="fs-4 text-primary fw-bold">R{calculatedPrice}</span>
                </div>
                <small className="text-muted">
                  {formData.property_type && (
                    <>
                      {formData.property_type === "other" 
                        ? `${formData.other_property_type} (R${propertyPrices.other}/night)` 
                        : `${formData.property_type.charAt(0).toUpperCase() + formData.property_type.slice(1)} (R${propertyPrices[formData.property_type]}/night)`}
                      {formData.check_in_date && formData.check_out_date && (
                        <> × {differenceInDays(new Date(formData.check_out_date), new Date(formData.check_in_date))} nights</>
                      )}
                    </>
                  )}
                </small>
              </div>
            )}

            <div className="d-flex gap-2">
              <Button 
                variant="primary" 
                type="submit" 
                className="flex-grow-1"
              >
                {isEdit ? 'Update Booking' : 'Confirm Booking'}
              </Button>
              {isEdit && (
                <Button
                  variant="outline-danger"
                  onClick={() => setShowDeleteConfirm({ show: true, bookingId: booking.id })}
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

  const PaymentModal = ({ show, booking, onClose, onSuccess }) => {
    const [selectedMethod, setSelectedMethod] = useState("credit_card");
    const [paymentDetails, setPaymentDetails] = useState({
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
      bankName: "",
      accountNumber: "",
      walletType: "",
      walletId: ""
    });

    const handlePaymentSubmit = (e) => {
      e.preventDefault();
      onSuccess(booking.id);
    };

    const renderPaymentForm = () => {
      switch(selectedMethod) {
        case "credit_card":
          return (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Card Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={paymentDetails.cardNumber}
                  onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Cardholder Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="John Doe"
                  value={paymentDetails.cardName}
                  onChange={(e) => setPaymentDetails({...paymentDetails, cardName: e.target.value})}
                  required
                />
              </Form.Group>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Expiry Date</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="MM/YY"
                      value={paymentDetails.expiryDate}
                      onChange={(e) => setPaymentDetails({...paymentDetails, expiryDate: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>CVV</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="123"
                      value={paymentDetails.cvv}
                      onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </>
          );
        case "bank_transfer":
          return (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Bank Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Your Bank Name"
                  value={paymentDetails.bankName}
                  onChange={(e) => setPaymentDetails({...paymentDetails, bankName: e.target.value})}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Account Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Your Account Number"
                  value={paymentDetails.accountNumber}
                  onChange={(e) => setPaymentDetails({...paymentDetails, accountNumber: e.target.value})}
                  required
                />
              </Form.Group>
            </>
          );
        case "digital_wallet":
          return (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Wallet Type</Form.Label>
                <Form.Select
                  value={paymentDetails.walletType}
                  onChange={(e) => setPaymentDetails({...paymentDetails, walletType: e.target.value})}
                  required
                >
                  <option value="">Select wallet type</option>
                  <option value="paypal">PayPal</option>
                  <option value="apple_pay">Apple Pay</option>
                  <option value="google_pay">Google Pay</option>
                  <option value="other">Other</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Wallet ID/Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Your wallet ID or email"
                  value={paymentDetails.walletId}
                  onChange={(e) => setPaymentDetails({...paymentDetails, walletId: e.target.value})}
                  required
                />
              </Form.Group>
            </>
          );
        default:
          return null;
      }
    };

    return (
      <Modal show={show} onHide={onClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Complete Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {booking && (
            <div className="mb-4 p-3 border rounded">
              <h6 className="mb-2">Booking Summary</h6>
              <div className="d-flex justify-content-between">
                <span>Amount Due:</span>
                <strong className="text-primary">R{booking.total_price}</strong>
              </div>
              {booking.property_type && (
                <small className="text-muted">
                  {booking.property_type === "other" 
                    ? `${booking.other_property_type} (R${propertyPrices.other}/night)` 
                    : `${booking.property_type.charAt(0).toUpperCase() + booking.property_type.slice(1)} (R${propertyPrices[booking.property_type]}/night)`}
                  {booking.check_in_date && booking.check_out_date && (
                    <> × {differenceInDays(new Date(booking.check_out_date), new Date(booking.check_in_date))} nights</>
                  )}
                </small>
              )}
            </div>
          )}
          
          <h6 className="mb-3">Select Payment Method</h6>
          
          <div className="d-flex gap-3 mb-4">
            <div 
              className={`border rounded p-3 text-center flex-fill cursor-pointer ${selectedMethod === "credit_card" ? "border-primary" : ""}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedMethod("credit_card")}
            >
              <CreditCard size={24} className="mb-2" />
              <div>Credit Card</div>
            </div>
            <div 
              className={`border rounded p-3 text-center flex-fill cursor-pointer ${selectedMethod === "bank_transfer" ? "border-primary" : ""}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedMethod("bank_transfer")}
            >
              <Landmark size={24} className="mb-2" />
              <div>Bank Transfer</div>
            </div>
            <div 
              className={`border rounded p-3 text-center flex-fill cursor-pointer ${selectedMethod === "digital_wallet" ? "border-primary" : ""}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedMethod("digital_wallet")}
            >
              <Wallet size={24} className="mb-2" />
              <div>Digital Wallet</div>
            </div>
          </div>
          
          <Form onSubmit={handlePaymentSubmit}>
            {renderPaymentForm()}
            
            <div className="d-flex gap-2 mt-4">
              <Button variant="secondary" onClick={onClose} className="flex-fill">
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="flex-fill">
                Pay R{booking?.total_price || 0}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

  const DeleteConfirmModal = ({ show, bookingId, onClose, onConfirm }) => {
    return (
      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            Are you sure you want to delete this booking? This action cannot be undone.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => onConfirm(bookingId)}>
            Delete Booking
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  if (isLoading) {
    return (
      <div className="py-4" style={{ backgroundColor: "#ECF0F1" }}>
        <div className="container">
          <h1 className="h3 mb-4 text-dark">My Bookings</h1>
          <div className="row g-4">
            {Array(3).fill(0).map((_, i) => (
              <div className="col-12" key={i}>
                <Card className="border-0 shadow-sm" style={{ backgroundColor: "#FFFFFF" }}>
                  <Card.Body>
                    <div className="mb-2" style={{ height: '20px', borderRadius: '4px', backgroundColor: "#BDC3C7" }}></div>
                    <div className="mb-3" style={{ height: '15px', width: '60%', borderRadius: '4px', backgroundColor: "#BDC3C7" }}></div>
                    <div style={{ height: '15px', width: '40%', borderRadius: '4px', backgroundColor: "#BDC3C7" }}></div>
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
        <div className="mb-4">
          <h1 className="h3 fw-bold mb-2 text-dark">My Bookings</h1>
          <p style={{ color: "#7F8C8D" }}>Manage your reservations and travel plans</p>
          
          {/* Make a Booking Button */}
          <Button 
            variant="primary" 
            className="mt-3"
            onClick={() => setShowBooking({ show: true, property: null, booking: null, isEdit: false })}
          >
            <Plus size={16} className="me-2" />
            Make a New Booking
          </Button>
        </div>

        {bookings.length === 0 ? (
          <Card className="text-center border-0 shadow-sm p-5" style={{ backgroundColor: "#FFFFFF" }}>
            <div className="d-inline-flex align-items-center justify-content-center border rounded-circle p-3 mb-3" style={{ width: '60px', height: '60px', backgroundColor: "#ECF0F1", borderColor: "#BDC3C7" }}>
              <Calendar size={32} style={{ color: "#7F8C8D" }} />
            </div>
            <Card.Title className="h4 fw-bold mb-2 text-dark">No bookings yet</Card.Title>
            <Card.Text style={{ color: "#7F8C8D" }} className="mb-0">Start exploring and book your perfect stay!</Card.Text>
          </Card>
        ) : (
          <div className="row g-4">
            {bookings.map((booking) => {
              const property = properties[booking.property_id];
              return (
                <div className="col-12" key={booking.id}>
                  <Card className="border-0 shadow-sm" style={{ backgroundColor: "#FFFFFF" }}>
                    <Card.Body>
                      <div className="row g-4">
                        {property && (
                          <div className="col-md-4 col-lg-3">
                            <div style={{ height: '200px', overflow: 'hidden', borderRadius: '8px', position: 'relative' }}>
                              <Image
                                src={property.images?.[0] || "https://images.unsplash.com/photo-1568605114967-8130f3a36994"}
                                alt={property?.title || "Property image"}
                                className="w-100 h-100"
                                style={{ objectFit: 'cover' }}
                              />
                              <div className="position-absolute top-0 end-0 p-2 d-flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="light" 
                                  className="rounded-circle p-2"
                                  onClick={() => setShowGallery({ show: true, images: property.images, title: property.title })}
                                  style={{ width: '36px', height: '36px' }}
                                >
                                  <Eye size={16} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className={property ? "col-md-8 col-lg-9" : "col-12"}>
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <h5 className="mb-1 text-dark">{property?.title || "Property"}</h5>
                              {property && (
                                <div className="d-flex align-items-center small mb-2" style={{ color: "#7F8C8D" }}>
                                  <MapPin size={14} className="me-1" style={{ color: "#3498DB" }} />
                                  <span>{property.location}</span>
                                </div>
                              )}
                              {booking.property_type && (
                                <div className="small mb-2" style={{ color: "#7F8C8D" }}>
                                  Type: {booking.property_type === "other" 
                                    ? booking.other_property_type 
                                    : booking.property_type.charAt(0).toUpperCase() + booking.property_type.slice(1)}
                                  {booking.check_in_date && booking.check_out_date && (
                                    <span className="ms-2">
                                      (R{propertyPrices[booking.property_type] || propertyPrices.other}/night × {differenceInDays(new Date(booking.check_out_date), new Date(booking.check_in_date))} nights)
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <Badge className="text-uppercase border-0" style={{ 
                                backgroundColor: 
                                  booking.status === 'confirmed' ? "#27AE60" :
                                  booking.status === 'pending' ? "#F39C12" :
                                  booking.status === 'cancelled' ? "#E74C3C" :
                                  booking.status === 'completed' ? "#3498DB" : "#7F8C8D",
                                color: "white"
                              }}>
                                {booking.status}
                              </Badge>
                              
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => handleEditBooking(booking)}
                              >
                                <Edit2 size={14} />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => setShowDeleteConfirm({ show: true, bookingId: booking.id })}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </div>

                          <div className="row g-3 mb-3">
                            <div className="col-md-4">
                              <div className="d-flex align-items-center small" style={{ color: "#7F8C8D" }}>
                                <Calendar size={14} className="me-1" style={{ color: "#3498DB" }} />
                                <div>
                                  <div className="fw-medium">Check-in</div>
                                  <div>{format(new Date(booking.check_in_date), "MMM d, yyyy")}</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="col-md-4">
                              <div className="d-flex align-items-center small" style={{ color: "#7F8C8D" }}>
                                <Calendar size={14} className="me-1" style={{ color: "#3498DB" }} />
                                <div>
                                  <div className="fw-medium">Check-out</div>
                                  <div>{format(new Date(booking.check_out_date), "MMM d, yyyy")}</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="col-md-4">
                              <div className="d-flex align-items-center small" style={{ color: "#7F8C8D" }}>
                                <Users size={14} className="me-1" style={{ color: "#3498DB" }} />
                                <div>
                                  <div className="fw-medium">Guests</div>
                                  <div>{booking.num_guests}</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="d-flex justify-content-between align-items-center pt-3 border-top" style={{ borderColor: "#BDC3C7" }}>
                            <div>
                              <span className="small" style={{ color: "#7F8C8D" }}>Total amount: </span>
                              <span className="fw-bold" style={{ color: "#3498DB" }}>R{booking.total_price}</span>
                              {booking.payment_status === "pending" && booking.status === "pending" && (
                                <Badge bg="warning" className="ms-2">Payment Pending</Badge>
                              )}
                              {booking.payment_status === "paid" && (
                                <Badge bg="success" className="ms-2">Paid</Badge>
                              )}
                            </div>
                            <div className="small" style={{ color: "#7F8C8D" }}>
                              Booked {format(new Date(booking.created_date), "MMM d, yyyy")}
                            </div>
                          </div>

                          {booking.special_requests && (
                            <div className="mt-3 p-3 rounded" style={{ backgroundColor: "#ECF0F1" }}>
                              <div className="fw-medium mb-1" style={{ color: "#7F8C8D" }}>Special Requests:</div>
                              <div className="small" style={{ color: "#7F8C8D" }}>{booking.special_requests}</div>
                            </div>
                          )}

                          {booking.status === "pending" && booking.payment_status !== "paid" && (
                            <div className="mt-3">
                              <Button 
                                variant="success" 
                                onClick={() => handlePayment(booking)}
                                className="w-100"
                              >
                                <CreditCard size={16} className="me-2" />
                                Pay Now - R{booking.total_price}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
        
        <GalleryModal 
          show={showGallery.show} 
          images={showGallery.images} 
          title={showGallery.title}
          onClose={() => setShowGallery({ show: false, images: [], title: '' })}
        />

        <BookingModal 
          show={showBooking.show} 
          property={showBooking.property}
          booking={showBooking.booking}
          isEdit={showBooking.isEdit}
          onClose={() => setShowBooking({ show: false, property: null, booking: null, isEdit: false })}
        />

        <PaymentModal
          show={showPayment.show}
          booking={showPayment.booking}
          onClose={() => setShowPayment({ show: false, booking: null })}
          onSuccess={handlePaymentSuccess}
        />

        <DeleteConfirmModal
          show={showDeleteConfirm.show}
          bookingId={showDeleteConfirm.bookingId}
          onClose={() => setShowDeleteConfirm({ show: false, bookingId: null })}
          onConfirm={handleDeleteBooking}
        />
      </div>
    </div>
  );
}