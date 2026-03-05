import React, { useState } from "react";
import { Card, Button, Form, Accordion, Container, Row, Col } from "react-bootstrap";
import {
  Search,
  MessageCircle,
  Mail,
  Phone,
  Home,
  CreditCard,
  User,
  Shield
} from "lucide-react";

const FAQItem = ({ faq, eventKey, activeKey, onClick }) => (
  <Card className="mb-2 border-0" style={{ backgroundColor: "#ECF0F1" }}>
    <Card.Header className="p-0">
      <Button
        onClick={onClick}
        className="w-100 text-start d-flex justify-content-between align-items-center p-3 border-0"
        aria-expanded={activeKey === eventKey}
        style={{ 
          backgroundColor: activeKey === eventKey ? "#3498DB" : "#ECF0F1",
          color: activeKey === eventKey ? "white" : "#2C3E50"
        }}
      >
        <span className="fw-medium">{faq.question}</span>
        <span style={{ color: activeKey === eventKey ? "white" : "#7F8C8D" }}>
          {activeKey === eventKey ? '−' : '+'}
        </span>
      </Button>
    </Card.Header>
    <Accordion.Collapse eventKey={eventKey}>
      <Card.Body>
        <p className="mb-0" style={{ color: "#7F8C8D" }}>{faq.answer}</p>
      </Card.Body>
    </Accordion.Collapse>
  </Card>
);

export default function Help() {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      alert(`Searching for: ${searchQuery}`);
    }
  };

  const handleStartChat = () => {
    alert("Starting live chat session...");
  };

  const handleSendEmail = () => {
    alert("Opening email client...");
    window.location.href = "mailto:help@stayhub.co.za";
  };

  const handleCallNow = () => {
    alert("Calling support...");
    window.location.href = "tel:+27111234567";
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (contactForm.firstName && contactForm.lastName && contactForm.email && contactForm.subject && contactForm.message) {
      alert("Message sent successfully! We'll get back to you soon.");
      setContactForm({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: ""
      });
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const updateContactForm = (field, value) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  const faqData = [
    { question: "How do I cancel my booking?", answer: "Cancellation policies vary by property. You can find the specific policy on the property details page. To cancel, go to 'My Bookings', find your reservation, and follow the cancellation steps." },
    { question: "What payment methods do you accept?", answer: "We accept all major credit and debit cards. All transactions are securely processed." },
    { question: "How do I contact my host?", answer: "Once your booking is confirmed, you will receive the host's contact information in your booking confirmation email and in your 'My Bookings' section." },
    { question: "What if I have issues during my stay?", answer: "You should first try to contact your host to resolve the issue. If you cannot reach them or the issue is unresolved, please contact our 24/7 support team for assistance." },
    { question: "How does the host verification process work?", answer: "We verify hosts through multiple checks, including identity verification and reviewing their history on our platform to ensure safety and trust." },
    { question: "Can I modify my booking dates?", answer: "Modifying booking dates depends on the property's availability and the host's policy. You can request a change through your 'My Bookings' page." },
  ];

  const categories = [
    { title: "Property & Bookings", icon: Home, articles: 24, description: "Questions about properties, reservations, and check-in" },
    { title: "Payments & Billing", icon: CreditCard, articles: 18, description: "Payment methods, refunds, and billing issues" },
    { title: "Account & Profile", icon: User, articles: 15, description: "Managing your account settings and profile" },
    { title: "Safety & Security", icon: Shield, articles: 12, description: "Staying safe and secure while using our platform" },
  ];

  const contactOptions = [
    { title: "Live Chat", icon: MessageCircle, description: "Get instant help from our support team", availability: "24/7 available", button: "Start Chat", action: handleStartChat },
    { title: "Email Support", icon: Mail, description: "Send us a detailed message", availability: "Response within 4 hours", button: "Send Email", action: handleSendEmail },
    { title: "Phone Support", icon: Phone, description: "Speak directly with our team", availability: "Mon-Fri 8AM-9PM", button: "Call Now", action: handleCallNow },
  ];

  return (
    <div style={{ backgroundColor: "#ECF0F1" }}>
      {/* Hero Section */}
      <div className="py-5 text-center" style={{ backgroundColor: "#2C3E50" }}>
        <Container>
          <h1 className="display-5 fw-bold mb-3 text-white">How can we help you?</h1>
          <p className="lead mb-4 text-white">Find answers to your questions or get in touch with our support team</p>
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="input-group">
                <span className="input-group-text border-end-0" style={{ backgroundColor: "#ECF0F1", borderColor: "#BDC3C7" }}>
                  <Search size={18} className="text-dark" />
                </span>
                <Form.Control
                  type="text"
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="border-start-0 border-secondary"
                />
                <Button
                  onClick={handleSearch}
                  className="px-4 border-0"
                  style={{ backgroundColor: "#3498DB" }}
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-5">
        {/* Browse by Category */}
        <section className="mb-5">
          <h2 className="display-6 fw-bold text-center mb-4 text-dark">Browse by Category</h2>
          <Row className="g-4">
            {categories.map((cat, i) => (
              <Col md={6} lg={3} key={i}>
                <Card className="h-100 text-center border-0 shadow-sm" style={{ backgroundColor: "#FFFFFF" }}>
                  <Card.Body>
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-3" style={{ width: '60px', height: '60px', backgroundColor: "#3498DB" }}>
                      <cat.icon size={24} className="text-white" />
                    </div>
                    <Card.Title className="h5 text-dark">{cat.title}</Card.Title>
                    <Card.Text className="mb-2" style={{ color: "#7F8C8D" }}>{cat.description}</Card.Text>
                    <div className="fw-bold" style={{ color: "#3498DB" }}>{cat.articles} articles</div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* FAQ */}
        <section className="mb-5">
          <h2 className="display-6 fw-bold text-center mb-4 text-dark">Frequently Asked Questions</h2>
          <Card className="border-0 shadow-sm" style={{ backgroundColor: "#ECF0F1" }}>
            <Card.Body className="p-0">
              <Accordion activeKey={activeFAQ} onSelect={(key) => setActiveFAQ(key)}>
                {faqData.map((faq, index) => (
                  <FAQItem
                    key={index}
                    faq={faq}
                    eventKey={index.toString()}
                    activeKey={activeFAQ}
                    onClick={() => setActiveFAQ(activeFAQ === index.toString() ? null : index.toString())}
                  />
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        </section>

        {/* Get in Touch */}
        <section className="mb-5">
          <h2 className="display-6 fw-bold text-center mb-4 text-dark">Get in Touch</h2>
          <Row className="g-4">
            {contactOptions.map((opt, i) => (
              <Col md={4} key={i}>
                <Card className="h-100 text-center border-0 shadow-sm" style={{ backgroundColor: "#FFFFFF" }}>
                  <Card.Body>
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-3" style={{ width: '60px', height: '60px', backgroundColor: "#3498DB" }}>
                      <opt.icon size={24} className="text-white" />
                    </div>
                    <Card.Title className="h5 text-dark">{opt.title}</Card.Title>
                    <Card.Text className="mb-2" style={{ color: "#7F8C8D" }}>{opt.description}</Card.Text>
                    <div className="small mb-3" style={{ color: "#7F8C8D" }}>{opt.availability}</div>
                    <Button
                      onClick={opt.action}
                      className="w-100 border-0"
                      style={{ backgroundColor: "#2C3E50" }}
                    >
                      {opt.button}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Send us a message */}
        <section>
          <Card className="border-0 shadow-sm" style={{ backgroundColor: "#FFFFFF" }}>
            <Card.Body>
              <h2 className="display-6 fw-bold text-center mb-3 text-dark">Send us a Message</h2>
              <p className="text-center mb-4" style={{ color: "#7F8C8D" }}>Can't find what you're looking for? Send us a detailed message and we'll get back to you.</p>
              <Form onSubmit={handleSendMessage}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-dark fw-medium">First Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="John"
                        value={contactForm.firstName}
                        onChange={(e) => updateContactForm('firstName', e.target.value)}
                        required
                        className="border-secondary"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-dark fw-medium">Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Doe"
                        value={contactForm.lastName}
                        onChange={(e) => updateContactForm('lastName', e.target.value)}
                        required
                        className="border-secondary"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="g-3 mt-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-dark fw-medium">Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="john.doe@example.com"
                        value={contactForm.email}
                        onChange={(e) => updateContactForm('email', e.target.value)}
                        required
                        className="border-secondary"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-dark fw-medium">Subject</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="How can we help you?"
                        value={contactForm.subject}
                        onChange={(e) => updateContactForm('subject', e.target.value)}
                        required
                        className="border-secondary"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mt-3">
                  <Form.Label className="text-dark fw-medium">Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Please describe your issue or question in detail..."
                    value={contactForm.message}
                    onChange={(e) => updateContactForm('message', e.target.value)}
                    required
                    className="border-secondary"
                  />
                </Form.Group>

                <div className="text-center mt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="px-5 py-2 border-0"
                    style={{ backgroundColor: "#3498DB" }}
                  >
                    Send Message
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </section>
      </Container>
    </div>
  );
}