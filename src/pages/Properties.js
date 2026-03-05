import React, { useState, useEffect } from 'react';
import  Property  from '../entities/Property';
import PropertyCard from '../components/properties/PropertyCard';
import SearchFilters from '../components/properties/SearchFilters';
import { Button, Container, Row, Col, Card, Form, Spinner, Alert } from 'react-bootstrap';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    property_type: 'all',
    min_price: '',
    max_price: '',
    min_guests: ''
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await Property.filter({ is_available: true }, "-created_date", 50);
        setProperties(data);
        setFilteredProperties(data);
      } catch (err) {
        setError('Failed to load properties');
        console.error('Error loading properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const applyFilters = () => {
    let filtered = properties;

    // Search query filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Property type filter
    if (filters.property_type !== 'all') {
      filtered = filtered.filter(property => property.property_type === filters.property_type);
    }

    // Price range filter
    if (filters.min_price) {
      filtered = filtered.filter(property => property.price_per_night >= parseInt(filters.min_price));
    }
    if (filters.max_price) {
      filtered = filtered.filter(property => property.price_per_night <= parseInt(filters.max_price));
    }

    // Guests filter
    if (filters.min_guests) {
      filtered = filtered.filter(property => property.max_guests >= parseInt(filters.min_guests));
    }

    setFilteredProperties(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, properties]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="py-4" style={{ backgroundColor: "#ECF0F1" }}>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h3 fw-bold text-dark">All Properties</h2>
          <Button onClick={() => window.location.reload()} className="border-0" style={{ backgroundColor: "#3498DB" }}>
            Refresh
          </Button>
        </div>

        <Row>
          {/* Filters Sidebar */}
          <Col md={4} lg={3} className="mb-4 mb-md-0">
            <SearchFilters 
              filters={filters} 
              onFilterChange={handleFilterChange} 
            />
          </Col>

          {/* Properties List */}
          <Col md={8} lg={9}>
            <div className="mb-4">
              <Form.Control
                type="search"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4 border-secondary"
              />
            </div>

            <div className="mb-4">
              <h5 className="fw-bold text-dark">{filteredProperties.length} Properties Found</h5>
              <p style={{ color: "#7F8C8D" }}>Discover amazing places to stay around South Africa</p>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status" style={{ color: "#3498DB" }}>
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : error ? (
              <Alert variant="danger" style={{ backgroundColor: "#FDEDEC", borderColor: "#F5B7B1", color: "#C0392B" }}>{error}</Alert>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-5">
                <h4 className="mb-2 text-dark">No properties found</h4>
                <p style={{ color: "#7F8C8D" }} className="mb-4">Try adjusting your search criteria or filters</p>
                <Button 
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({ property_type: 'all', min_price: '', max_price: '', min_guests: '' });
                  }}
                  className="border-0"
                  style={{ backgroundColor: "#3498DB" }}
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <Row className="g-4">
                {filteredProperties.map(property => (
                  <Col md={6} lg={6} xl={4} key={property.id}>
                    <PropertyCard property={property} />
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Properties;