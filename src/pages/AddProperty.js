import React, { useState } from "react";
import { Link } from "react-router-dom";
import createPageUrl from '../utils/createPageUrl';
import { Button, Card, Nav, Tab, Container, Row, Col } from "react-bootstrap";
import { DollarSign, UserPlus, Star, Calendar, Upload, Plus } from "lucide-react";

export default function AddProperty() {
  const [activeTab, setActiveTab] = useState('create');

  const whyHostItems = [
    { icon: DollarSign, title: "Earn Extra Income", description: "Make money from your unused space. Our hosts earn an average of R8,500 per month." },
    { icon: UserPlus, title: "Meet New People", description: "Connect with travelers from around the world and share local experiences." },
    { icon: Star, title: "Build Your Reputation", description: "Develop a strong hosting profile with guest reviews and ratings." },
    { icon: Calendar, title: "Flexible Schedule", description: "You control when your space is available and how often you host." },
  ];

  const howItWorksItems = [
    { number: 1, title: "Create Your Listing", description: "Upload photos, write a description, and set your price." },
    { number: 2, title: "Get Ready To Host", description: "Prepare your space and create a welcoming environment." },
    { number: 3, title: "Welcome Guests", description: "Start hosting and earning money from your property." },
  ];

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#ECF0F1" }}>
      {/* Hero Section */}
      <div className="py-5 text-center" style={{ backgroundColor: "#2C3E50" }}>
        <Container>
          <h1 className="display-4 fw-bold mb-3 text-white">Become a Host</h1>
          <p className="lead mb-4 text-white">Turn your extra space into extra income</p>
          <Link to={createPageUrl("CreateListing")}>
            <Button className="px-4 py-3 border-0" style={{ backgroundColor: "#3498DB" }}>
              <Plus size={20} className="me-2" />
              Start Hosting Today
            </Button>
          </Link>
        </Container>
      </div>

      <Container className="py-5">
        {/* Why Host Section */}
        <section className="mb-5">
          <h2 className="display-6 fw-bold text-center mb-3 text-dark">Why Host with StayEasy?</h2>
          <p className="text-center mb-4" style={{ color: "#7F8C8D" }}>
            Join thousands of hosts who are earning money and meeting amazing people.
          </p>
          <Row className="g-4">
            {whyHostItems.map((item, i) => (
              <Col md={6} lg={3} key={i}>
                <Card className="h-100 border-0 shadow-sm" style={{ backgroundColor: "#FFFFFF" }}>
                  <Card.Body className="text-center">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-3" style={{ width: '60px', height: '60px', backgroundColor: "#3498DB" }}>
                      <item.icon size={24} className="text-white" />
                    </div>
                    <Card.Title className="h5 text-dark">{item.title}</Card.Title>
                    <Card.Text style={{ color: "#7F8C8D" }}>{item.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* How It Works Section */}
        <section className="mb-5">
          <h2 className="display-6 fw-bold text-center mb-4 text-dark">How It Works - Getting started is easier than you think</h2>
          <div className="position-relative">
            {/* Dashed line for desktop */}
            <div className="d-none d-md-block position-absolute top-50 start-0 w-100 translate-middle-y" style={{ height: '2px', border: '2px dashed #BDC3C7' }}></div>
            <Row className="g-4 position-relative z-1">
              {howItWorksItems.map((item, i) => (
                <Col md={4} key={i}>
                  <div className="text-center">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle text-white fw-bold mb-3" style={{ width: '50px', height: '50px', fontSize: '1.5rem', backgroundColor: "#3498DB" }}>
                      {item.number}
                    </div>
                    <h3 className="h5 text-dark">{item.title}</h3>
                    <p style={{ color: "#7F8C8D" }}>{item.description}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Host Tools & Resources */}
        <section>
          <h2 className="display-6 fw-bold text-center mb-4 text-dark">Host Tools & Resources</h2>
          <Card className="border-0 shadow-sm" style={{ backgroundColor: "#FFFFFF" }}>
            <Card.Body>
              <Nav variant="tabs" className="mb-4">
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'create'} 
                    onClick={() => setActiveTab('create')}
                    className="fw-medium"
                    style={{ 
                      backgroundColor: activeTab === 'create' ? '#3498DB' : 'transparent',
                      color: activeTab === 'create' ? 'white' : '#2C3E50',
                      border: 'none'
                    }}
                  >
                    Create Listing
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'photo'} 
                    onClick={() => setActiveTab('photo')}
                    className="fw-medium"
                    style={{ 
                      backgroundColor: activeTab === 'photo' ? '#3498DB' : 'transparent',
                      color: activeTab === 'photo' ? 'white' : '#2C3E50',
                      border: 'none'
                    }}
                  >
                    Photo Tips
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'pricing'} 
                    onClick={() => setActiveTab('pricing')}
                    className="fw-medium"
                    style={{ 
                      backgroundColor: activeTab === 'pricing' ? '#3498DB' : 'transparent',
                      color: activeTab === 'pricing' ? 'white' : '#2C3E50',
                      border: 'none'
                    }}
                  >
                    Pricing Guide
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane active={activeTab === 'create'}>
                  <h3 className="h4 mb-3 text-dark">List Your Property</h3>
                  <p className="mb-4" style={{ color: "#7F8C8D" }}>
                    Create a compelling listing that attracts guests and showcases your space.
                  </p>
                  <Link to={createPageUrl("CreateListing")}>
                    <Button className="px-4 py-2 border-0" style={{ backgroundColor: "#3498DB" }}>
                      <Plus size={18} className="me-2" />
                      Create New Listing
                    </Button>
                  </Link>
                </Tab.Pane>

                <Tab.Pane active={activeTab === 'photo'}>
                  <h3 className="h4 mb-3 text-dark">Upload High-Quality Photos</h3>
                  <p className="mb-4" style={{ color: "#7F8C8D" }}>
                    Great photos are essential for attracting guests. Use our drag-and-drop uploader to easily manage your property images.
                  </p>
                  <div className="border rounded p-5 text-center" style={{ backgroundColor: "#ECF0F1", borderColor: "#BDC3C7" }}>
                    <Upload size={48} className="mb-3" style={{ color: "#7F8C8D" }} />
                    <p className="mb-2 text-dark">Drag and drop images here</p>
                    <p className="small mb-3" style={{ color: "#7F8C8D" }}>or</p>
                    <Button variant="outline-secondary" style={{ borderColor: "#BDC3C7", color: "#2C3E50" }}>Browse Files</Button>
                  </div>
                </Tab.Pane>

                <Tab.Pane active={activeTab === 'pricing'}>
                  <h3 className="h4 mb-4 text-dark">Pricing Your Space</h3>
                  <Row className="g-4">
                    <Col md={4}>
                      <Card className="h-100 border-0" style={{ backgroundColor: "#ECF0F1" }}>
                        <Card.Body>
                          <Card.Title className="h6 text-dark">Competitive Pricing</Card.Title>
                          <Card.Text className="small" style={{ color: "#7F8C8D" }}>
                            Research similar properties in your area to set competitive rates.
                          </Card.Text>
                          <div className="fw-bold small" style={{ color: "#3498DB" }}>Starting at R750/night</div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="h-100 border-0" style={{ backgroundColor: "#ECF0F1" }}>
                        <Card.Body>
                          <Card.Title className="h6 text-dark">Seasonal Adjustments</Card.Title>
                          <Card.Text className="small" style={{ color: "#7F8C8D" }}>
                            Adjust your prices based on local events and peak seasons.
                          </Card.Text>
                          <div className="fw-bold small" style={{ color: "#3498DB" }}>Up to 40% higher</div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="h-100 border-0" style={{ backgroundColor: "#ECF0F1" }}>
                        <Card.Body>
                          <Card.Title className="h6 text-dark">Smart Pricing</Card.Title>
                          <Card.Text className="small" style={{ color: "#7F8C8D" }}>
                            Use our dynamic pricing tool to optimize your rates automatically.
                          </Card.Text>
                          <div className="fw-bold small" style={{ color: "#3498DB" }}>15%+ more earnings</div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </section>
      </Container>
    </div>
  );
}