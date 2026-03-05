import React from "react";
import { Card, Form } from "react-bootstrap";
import { Filter } from "lucide-react";

export default function SearchFilters({ filters, setFilters, onFilterChange }) {
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    onFilterChange();
  };

  return (
    <Card className="mb-4 shadow-sm border-0" style={{ backgroundColor: "#ECF0F1" }}>
      <Card.Body>
        <div className="d-flex align-items-center mb-4">
          <Filter size={20} className="me-2" style={{ color: "#3498DB" }} />
          <h5 className="mb-0 text-dark">Filters</h5>
        </div>
        
        <Form>
          <div className="row g-3">
            <div className="col-12 col-md-6 col-lg-3">
              <Form.Group>
                <Form.Label className="text-dark fw-medium">Property Type</Form.Label>
                <Form.Select
                  value={filters.property_type || "all"}
                  onChange={(e) => updateFilter('property_type', e.target.value)}
                  className="border-secondary"
                >
                  <option value="all">All Types</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="cabin">Cabin</option>
                  <option value="hotel_room">Hotel Room</option>
                  <option value="studio">Studio</option>
                  <option value="other">Other</option>
                </Form.Select>
              </Form.Group>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <Form.Group>
                <Form.Label className="text-dark fw-medium">Min Price (ZAR)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="R0"
                  value={filters.min_price || ""}
                  onChange={(e) => updateFilter('min_price', e.target.value)}
                  className="border-secondary"
                />
              </Form.Group>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <Form.Group>
                <Form.Label className="text-dark fw-medium">Max Price (ZAR)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="R999+"
                  value={filters.max_price || ""}
                  onChange={(e) => updateFilter('max_price', e.target.value)}
                  className="border-secondary"
                />
              </Form.Group>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <Form.Group>
                <Form.Label className="text-dark fw-medium">Guests</Form.Label>
                <Form.Select
                  value={filters.min_guests || ""}
                  onChange={(e) => updateFilter('min_guests', e.target.value)}
                  className="border-secondary"
                >
                  <option value="">Any</option>
                  <option value="1">1+ Guest</option>
                  <option value="2">2+ Guests</option>
                  <option value="4">4+ Guests</option>
                  <option value="6">6+ Guests</option>
                  <option value="8">8+ Guests</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}