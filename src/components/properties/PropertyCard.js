import React from "react";
import { Card, Badge, Image } from "react-bootstrap"; 
import { MapPin, Users, Bed, Bath } from "lucide-react";
import { Link } from "react-router-dom";
import createPageUrl from '../../utils/createPageUrl';

export default function PropertyCard({ property, onImageClick }) {
  const firstImage = property.images?.[0] || "https://images.unsplash.com/photo-1568605114967-8130f3a36994";

  const propertyTypeLabels = {
    house: "House",
    apartment: "Apartment", 
    villa: "Villa",
    cabin: "Cabin",
    hotel_room: "Hotel Room",
    hotel: "Hotel Room",
    studio: "Studio",
    other: "Property"
  };

  const handleImageClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onImageClick) {
      onImageClick(property);
    }
  };

  return (
    <Link 
      to={createPageUrl(`PropertyDetails?id=${property.id}`)} 
      className="text-decoration-none d-block h-100"
    >
      <Card className="h-100 shadow-sm border-0" style={{ backgroundColor: "#ECF0F1" }}>
        <div className="position-relative">
          <div 
            style={{ height: '200px', overflow: 'hidden', cursor: 'pointer' }}
            onClick={handleImageClick}
          >
            <Image 
              src={firstImage}
              alt={property.title}
              className="w-100 h-100 object-fit-cover"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <Badge 
            className="position-absolute top-0 start-0 m-2 border-0"
            style={{ backgroundColor: "#E74C3C" }}
          >
            {propertyTypeLabels[property.property_type] || "Property"}
          </Badge>
        </div>
        
        <Card.Body className="d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h5 className="card-title mb-0 text-truncate text-dark" style={{ maxWidth: '70%' }}>
              {property.title}
            </h5>
            <div className="text-end">
              <div className="fw-bold" style={{ color: "#3498DB" }}>R{property.price_per_night}</div>
              <div className="small" style={{ color: "#7F8C8D" }}>per night</div>
            </div>
          </div>
          
          <div className="d-flex align-items-center small mb-3" style={{ color: "#7F8C8D" }}>
            <MapPin size={14} className="me-1" style={{ color: "#3498DB" }} />
            <span className="text-truncate" style={{ maxWidth: '90%' }}>{property.location}</span>
          </div>

          <div className="mt-auto">
            <div className="d-flex flex-wrap gap-3 small" style={{ color: "#7F8C8D" }}>
              <div className="d-flex align-items-center">
                <Users size={14} className="me-1" style={{ color: "#3498DB" }} />
                <span>{property.max_guests} guests</span>
              </div>
              {property.bedrooms && (
                <div className="d-flex align-items-center">
                  <Bed size={14} className="me-1" style={{ color: "#3498DB" }} />
                  <span>{property.bedrooms} bed</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="d-flex align-items-center">
                  <Bath size={14} className="me-1" style={{ color: "#3498DB" }} />
                  <span>{property.bathrooms} bath</span>
                </div>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
}