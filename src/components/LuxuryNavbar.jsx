// src/components/LuxuryNavbar.jsx
import React, { useState } from 'react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { Menu, X } from 'lucide-react';
import './LuxuryNavbar.css';

const LuxuryNavbar = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar
      expand="lg"
      className="luxury-navbar py-3"
      expanded={expanded}
      onToggle={setExpanded}
    >
      <Container>
        {/* Logo / Brand */}
        <Navbar.Brand href="/" className="luxury-brand">
          <span className="brand-gold">Opulent</span>Stays
        </Navbar.Brand>

        {/* Mobile Toggle */}
        <Navbar.Toggle
          aria-controls="luxury-nav-collapse"
          className="border-0"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
        </Navbar.Toggle>

        {/* Nav Links */}
        <Navbar.Collapse id="luxury-nav-collapse" className="justify-content-end">
          <Nav className="luxury-nav-list align-items-lg-center">
            <Nav.Link href="/" className="luxury-nav-link">Home</Nav.Link>
            <Nav.Link href="/properties" className="luxury-nav-link">Properties</Nav.Link>
            <Nav.Link href="/experiences" className="luxury-nav-link">Experiences</Nav.Link>
            <Nav.Link href="/about" className="luxury-nav-link">About</Nav.Link>
            <Button
              variant="outline-light"
              className="luxury-sign-in-btn ms-lg-4 mt-3 mt-lg-0"
              href="/login"
            >
              Sign In
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default LuxuryNavbar;