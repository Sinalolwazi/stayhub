import React, { createContext, useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import createPageUrl from '../utils/createPageUrl';
import { Moon, Sun, Menu } from "lucide-react"; // ✂️ Removed unused: Home, X
import { Button } from "react-bootstrap"; 
import {
  Navbar,
  Nav,
  Container,
  Offcanvas,
  // ✂️ Removed unused: NavDropdown, Row, Col, ListGroup
} from "react-bootstrap";

// --- Theme Context (unchanged) ---
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// --- Navigation Items (unchanged) ---
const navigationItems = [
  {
    title: "Explore",
    url: createPageUrl("Home"),
  },
  {
    title: "Properties",
    url: createPageUrl("MyProperties"),
  },
  {
    title: "Bookings",
    url: createPageUrl("MyBookings"),
  },
  {
    title: "Host your home",
    url: createPageUrl("AddProperty"),
  },
  {
    title: "Help",
    url: createPageUrl("Help"),
  },
];

// --- Navigation Component ---
function Navigation() {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleToggleOffcanvas = () => setShowOffcanvas(!showOffcanvas);

  return (
    <>
      <Navbar expand="lg" className="shadow-sm" style={{ backgroundColor: "#2C3E50" }}>
        <Container>
          {/* Logo */}
          <Navbar.Brand as={Link} to={createPageUrl("Home")} className="d-flex align-items-center">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68bcb24da8ecbe23f07f70df/0c8836833_stay-removebg-preview.png"
              alt="StayHub Logo"
              style={{ height: '48px', marginRight: '12px' }}
            />
            <span className="fw-bold fs-4 text-white">StayHub</span>
          </Navbar.Brand>

          {/* Toggler for mobile */}
          <Navbar.Toggle 
            aria-controls="basic-navbar-nav" 
            onClick={handleToggleOffcanvas}
            className="border-0"
          >
            <Menu size={24} className="text-white" />
          </Navbar.Toggle>

          {/* Desktop Navigation & Actions */}
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="me-auto">
              {navigationItems.map((item) => (
                <Nav.Link
                  key={item.title}
                  as={Link}
                  to={item.url}
                  active={location.pathname === item.url}
                  className="px-3 py-2 mx-1 rounded text-white"
                  style={{
                    backgroundColor: location.pathname === item.url ? '#3498DB' : 'transparent',
                  }}
                >
                  {item.title}
                </Nav.Link>
              ))}
            </Nav>

            {/* Theme Toggle */}
            <Button
              variant="outline-light"
              size="sm"
              onClick={toggleTheme}
              className="d-flex align-items-center justify-content-center me-2"
              style={{ width: '40px', height: '40px' }}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Mobile Offcanvas Menu */}
      <Offcanvas show={showOffcanvas} onHide={handleToggleOffcanvas} placement="end" style={{ backgroundColor: "#ECF0F1" }}>
        <Offcanvas.Header closeButton className="border-bottom" style={{ backgroundColor: "#2C3E50" }}>
          <Offcanvas.Title className="text-white">Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {navigationItems.map((item) => (
              <Nav.Link
                key={item.title}
                as={Link}
                to={item.url}
                onClick={handleToggleOffcanvas}
                active={location.pathname === item.url}
                className="py-3 border-bottom text-dark"
                style={{ 
                  backgroundColor: location.pathname === item.url ? '#3498DB' : 'transparent',
                  color: location.pathname === item.url ? 'white' : '#2C3E50'
                }}
              >
                {item.title}
              </Nav.Link>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

// --- Footer Component ---
function Footer() {
  return (
    <footer className="py-5 mt-5" style={{ backgroundColor: "#2C3E50" }}>
      <Container>
        {/* ✅ Kept structure, but removed Row/Col/ListGroup imports since we’re not using Bootstrap grid here */}
        {/* You’re using plain divs and flex — totally fine! */}
        <div className="row">
          {/* Company Info */}
          <div className="col-md-6 col-lg-4 mb-4 mb-lg-0">
            <div className="d-flex align-items-center mb-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68bcb24da8ecbe23f07f70df/0c8836833_stay-removebg-preview.png"
                alt="StayHub Logo"
                style={{ height: '40px', marginRight: '12px' }}
              />
              <h3 className="h5 mb-0 text-white">StayHub</h3>
            </div>
            <p className="text-white">
              Discover unique accommodations around South Africa. From cozy apartments to luxury villas, 
              find your perfect stay with StayHub.
            </p>
            <p className="text-white small">
              © 2024 StayHub. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-6 col-lg-4 mb-4 mb-lg-0">
            <h4 className="h5 mb-3 text-white">Quick Links</h4>
            <div>
              <div className="mb-2">
                <Link to={createPageUrl("Home")} className="text-white text-decoration-none">
                  Explore
                </Link>
              </div>
              <div className="mb-2">
                <Link to={createPageUrl("AddProperty")} className="text-white text-decoration-none">
                  Host your home
                </Link>
              </div>
              <div className="mb-2">
                <Link to={createPageUrl("Help")} className="text-white text-decoration-none">
                  Help Center
                </Link>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="col-md-6 col-lg-4">
            <h4 className="h5 mb-3 text-white">Support</h4>
            <div>
              <div className="mb-2 text-white">
                24/7 Customer Support
              </div>
              <div className="mb-2 text-white">
                +27 11 123 4567
              </div>
              <div className="mb-2 text-white">
                help@stayhub.co.za
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4" style={{ backgroundColor: "#3498DB" }} />
        <p className="text-center text-white small">
          Made with ❤️ in South Africa
        </p>
      </Container>
    </footer>
  );
}

// --- Layout Export ---
export default function Layout({ children }) {
  return (
    <ThemeProvider>
      <div className="d-flex flex-column min-vh-100">
        <Navigation />
        <main className="flex-grow-1">
          {children}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}