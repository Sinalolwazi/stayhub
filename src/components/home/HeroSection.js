import React from "react";
import { Search, MapPin } from "lucide-react";
import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import "./HeroSection.css"; // We'll add custom styles here

export default function HeroSection({ searchQuery, setSearchQuery, onSearch }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="hero-section position-relative overflow-hidden">
      {/* Decorative blurred orbs */}
      <div className="hero-orb hero-orb--top-right"></div>
      <div className="hero-orb hero-orb--bottom-left"></div>

      <Container className="position-relative z-1 py-5 py-md-8">
        <Row className="justify-content-center text-center mb-5">
          <Col lg={8}>
            <h1 className="hero-title">
              Find Your Perfect
              <br />
              <span className="hero-subtitle">Stay in South Africa</span>
            </h1>
            <p className="hero-lead">
              Discover curated luxury accommodations across the Rainbow Nation — from Cape Town vineyards to Johannesburg penthouses.
            </p>
          </Col>
        </Row>

        {/* Luxurious Search Bar */}
        <Row className="justify-content-center mb-5">
          <Col lg={8} xl={6}>
            <InputGroup className="hero-search-group">
              <InputGroup.Text className="hero-search-addon">
                <MapPin size={20} className="text-gold" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Where in South Africa do you want to go?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="hero-search-input"
              />
              <Button
                onClick={onSearch}
                className="hero-search-button"
              >
                <Search size={20} className="me-2" />
                Search
              </Button>
            </InputGroup>
          </Col>
        </Row>

        {/* Elegant Stats */}
        <Row className="text-center g-4">
          {[
            { value: "50+", label: "Luxury Properties" },
            { value: "1000+", label: "Satisfied Guests" },
            { value: "24/7", label: "Concierge Support" }
          ].map((stat, i) => (
            <Col md={4} key={i}>
              <div className="hero-stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}