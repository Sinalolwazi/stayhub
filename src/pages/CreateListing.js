import {
  Button, Card, Form, ProgressBar, Row, Col, Modal, InputGroup
} from "react-bootstrap"; // ✂️ Removed unused: ListGroup
import React, { useState } from "react";
import Property from '../entities/Property'; // ✅ Used in handleSubmit
import { UploadFile } from "../integrations/Core";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils"; // ✅ Used in navigation
import {
  ArrowLeft, Upload, X, Home, DollarSign, Users, Bed, Bath, Star,
  ChevronLeft, ChevronRight // ✅ Added these — delete manual SVGs below
} from "lucide-react"; // ✂️ Removed unused: Plus, Wifi

export default function CreateListing() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    property_type: "",
    price_per_night: "",
    max_guests: "",
    bedrooms: "",
    bathrooms: "",
    amenities: [],
    images: [],
    house_rules: ""
  });

  const steps = [
    { number: 1, title: "Property Details", icon: Home },
    { number: 2, title: "Pricing & Capacity", icon: DollarSign },
    { number: 3, title: "Amenities", icon: Star },
    { number: 4, title: "Photos & Rules", icon: Upload }
  ];

  const amenityOptions = [
    "WiFi", "Kitchen", "Parking", "Pool", "Hot Tub", "Air Conditioning",
    "Heating", "Workspace", "TV", "Fireplace", "Balcony", "Garden"
  ];

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityChange = (amenity, checked) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
    }));
  };

  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const uploadPromises = Array.from(files).map(file => UploadFile({ file }));
      const results = await Promise.all(uploadPromises);
      const imageUrls = results.map(result => result.file_url);

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls]
      }));
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Error uploading images. Please try again.");
    }
    setUploadingImages(false);
  };

  const handleBrowseFiles = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    input.onchange = (e) => handleImageUpload(e.target.files);
    input.click();
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const propertyData = {
        ...formData,
        price_per_night: parseFloat(formData.price_per_night),
        max_guests: parseInt(formData.max_guests),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : undefined,
        is_available: true
      };

      await Property.create(propertyData);
      navigate(createPageUrl("MyProperties"));
    } catch (error) {
      console.error("Error creating property:", error);
    }
    setIsLoading(false);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.description && formData.location && formData.property_type;
      case 2:
        return formData.price_per_night && formData.max_guests;
      case 3:
        return true;
      case 4:
        return formData.images.length > 0;
      default:
        return false;
    }
  };

  const openImageModal = (index) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  return (
    <div className="py-4" style={{ backgroundColor: "#ECF0F1" }}>
      <div className="container">
        {/* Header */}
        <div className="d-flex align-items-center mb-4">
          <Button
            size="sm"
            onClick={() => navigate(createPageUrl("AddProperty"))}
            className="me-3 border-0"
            style={{ backgroundColor: "#2C3E50" }}
          >
            <ArrowLeft size={16} className="text-white" />
          </Button>
          <div>
            <h1 className="h3 mb-1 text-dark">List Your Property</h1>
            <p style={{ color: "#7F8C8D" }}>Share your space with travelers from around the world</p>
          </div>
        </div>

        {/* Progress Steps */}
        <Card className="mb-4 border-0" style={{ backgroundColor: "#FFFFFF" }}>
          <Card.Body>
            <div className="d-flex align-items-center mb-3">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="d-flex flex-column align-items-center me-4">
                    <div className={`d-flex align-items-center justify-content-center rounded-circle mb-2 ${currentStep >= step.number ? 'text-white' : 'border'}`} 
                         style={{ 
                           width: '40px', 
                           height: '40px', 
                           backgroundColor: currentStep >= step.number ? "#3498DB" : "#ECF0F1",
                           borderColor: "#BDC3C7"
                         }}>
                      <step.icon size={20} />
                    </div>
                    <small className={`${currentStep >= step.number ? 'fw-bold' : ''}`} 
                           style={{ color: currentStep >= step.number ? "#3498DB" : "#7F8C8D" }}>
                      {step.title}
                    </small>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-grow-1 d-flex align-items-center">
                      <div className={`w-100 border-top ${currentStep > step.number ? '' : ''}`} 
                           style={{ 
                             height: '2px', 
                             borderColor: currentStep > step.number ? "#3498DB" : "#BDC3C7" 
                           }}></div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <ProgressBar now={(currentStep / 4) * 100} className="mb-3" 
                         style={{ backgroundColor: "#ECF0F1" }} 
                         variant="primary" />
            <small style={{ color: "#7F8C8D" }}>Step {currentStep} of {steps.length}</small>
          </Card.Body>
        </Card>

        {/* Step Content */}
        <Card className="mb-4 border-0" style={{ backgroundColor: "#FFFFFF" }}>
          <Card.Body>
            {currentStep === 1 && (
              <div>
                <h3 className="mb-4 text-dark">Tell us about your property</h3>

                <Form.Group className="mb-3">
                  <Form.Label className="text-dark fw-medium">Property Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="Give your property a catchy title..."
                    required
                    className="border-secondary"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-dark fw-medium">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Describe what makes your place special..."
                    required
                    className="border-secondary"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-dark fw-medium">Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="City, Province, South Africa"
                    required
                    className="border-secondary"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-dark fw-medium">Property Type</Form.Label>
                  <Form.Select
                    value={formData.property_type}
                    onChange={(e) => updateField('property_type', e.target.value)}
                    required
                    className="border-secondary"
                  >
                    <option value="">Select your property type</option>
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
            )}

            {currentStep === 2 && (
              <div>
                <h3 className="mb-4 text-dark">Set your pricing and capacity</h3>

                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-dark fw-medium">Price per Night (ZAR)</Form.Label>
                      <InputGroup>
                        <InputGroup.Text style={{ backgroundColor: "#ECF0F1", borderColor: "#BDC3C7" }}>R</InputGroup.Text>
                        <Form.Control
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.price_per_night}
                          onChange={(e) => updateField('price_per_night', e.target.value)}
                          placeholder="500"
                          required
                          className="border-secondary"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-dark fw-medium">Maximum Guests</Form.Label>
                      <InputGroup>
                        <InputGroup.Text style={{ backgroundColor: "#ECF0F1", borderColor: "#BDC3C7" }}>
                          <Users size={16} />
                        </InputGroup.Text>
                        <Form.Control
                          type="number"
                          min="1"
                          value={formData.max_guests}
                          onChange={(e) => updateField('max_guests', e.target.value)}
                          placeholder="4"
                          required
                          className="border-secondary"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-dark fw-medium">Bedrooms</Form.Label>
                      <InputGroup>
                        <InputGroup.Text style={{ backgroundColor: "#ECF0F1", borderColor: "#BDC3C7" }}>
                          <Bed size={16} />
                        </InputGroup.Text>
                        <Form.Control
                          type="number"
                          min="0"
                          value={formData.bedrooms}
                          onChange={(e) => updateField('bedrooms', e.target.value)}
                          placeholder="2"
                          className="border-secondary"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-dark fw-medium">Bathrooms</Form.Label>
                      <InputGroup>
                        <InputGroup.Text style={{ backgroundColor: "#ECF0F1", borderColor: "#BDC3C7" }}>
                          <Bath size={16} />
                        </InputGroup.Text>
                        <Form.Control
                          type="number"
                          min="0"
                          step="0.5"
                          value={formData.bathrooms}
                          onChange={(e) => updateField('bathrooms', e.target.value)}
                          placeholder="1.5"
                          className="border-secondary"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h3 className="mb-3 text-dark">What amenities do you offer?</h3>
                <p className="mb-4" style={{ color: "#7F8C8D" }}>Select all the amenities available at your property</p>

                <Row className="g-3">
                  {amenityOptions.map((amenity) => (
                    <Col md={6} key={amenity}>
                      <Form.Check
                        type="checkbox"
                        id={amenity}
                        label={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onChange={(e) => handleAmenityChange(amenity, e.target.checked)}
                        className="text-dark"
                      />
                    </Col>
                  ))}
                </Row>

                {formData.amenities.length > 0 && (
                  <div className="mt-4">
                    <h6 className="mb-2 text-dark">Selected amenities:</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {formData.amenities.map((amenity, index) => (
                        <span key={index} className="badge" style={{ backgroundColor: "#3498DB" }}>
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h3 className="mb-3 text-dark">Add photos and house rules</h3>

                {/* Image Upload */}
                <Form.Group className="mb-4">
                  <Form.Label className="text-dark fw-medium">Property Photos</Form.Label>
                  
                  <div className="border rounded p-4 text-center mb-3" style={{ backgroundColor: "#ECF0F1", borderColor: "#BDC3C7" }}>
                    <Upload size={48} className="mb-3" style={{ color: "#7F8C8D" }} />
                    <div className="mb-2 text-dark">
                      {uploadingImages ? "Uploading..." : "Drag and drop images here"}
                    </div>
                    <div className="small mb-3" style={{ color: "#7F8C8D" }}>or click to browse files</div>
                    <Button
                      type="button"
                      onClick={handleBrowseFiles}
                      disabled={uploadingImages}
                      className="mb-2 border-0"
                      style={{ backgroundColor: "#2C3E50" }}
                    >
                      Browse Files
                    </Button>
                    <div className="small" style={{ color: "#7F8C8D" }}>
                      Upload at least 3 high-quality photos
                    </div>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="row g-3">
                      {formData.images.map((image, index) => (
                        <div key={index} className="col-6 col-md-4 col-lg-3">
                          <div className="position-relative" style={{ cursor: 'pointer' }} onClick={() => openImageModal(index)}>
                            <img
                              src={image}
                              alt={`Property ${index + 1}`}
                              className="w-100 rounded"
                              style={{ height: '150px', objectFit: 'cover' }}
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(index);
                              }}
                              className="btn btn-sm position-absolute top-0 end-0 m-1 rounded-circle border-0"
                              style={{ width: '25px', height: '25px', padding: '0', backgroundColor: "#E74C3C" }}
                            >
                              <X size={12} className="text-white" />
                            </button>
                            {index === 0 && (
                              <div className="position-absolute bottom-0 start-0 px-2 py-1 rounded" style={{ backgroundColor: "#3498DB" }}>
                                <small className="text-white">Main</small>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Form.Group>

                {/* House Rules */}
                <Form.Group>
                  <Form.Label className="text-dark fw-medium">House Rules</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={formData.house_rules}
                    onChange={(e) => updateField('house_rules', e.target.value)}
                    placeholder="• No smoking indoors&#10;• No pets allowed&#10;• Check-in after 3 PM&#10;• Check-out before 11 AM&#10;• Respect the neighbors"
                    className="border-secondary"
                  />
                </Form.Group>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Navigation Buttons */}
        <div className="d-flex justify-content-between align-items-center">
          <Button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="border-0"
            style={{ 
              backgroundColor: currentStep === 1 ? "#BDC3C7" : "#2C3E50",
              color: "white"
            }}
          >
            Previous Step
          </Button>

          {currentStep < 4 ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="border-0"
              style={{ 
                backgroundColor: !canProceed() ? "#BDC3C7" : "#3498DB",
                color: "white"
              }}
            >
              Next Step
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoading || uploadingImages || !canProceed()}
              className="border-0"
              style={{ 
                backgroundColor: (isLoading || uploadingImages || !canProceed()) ? "#BDC3C7" : "#27AE60",
                color: "white"
              }}
            >
              {isLoading ? "Publishing..." : "Publish Property"}
            </Button>
          )}
        </div>
      </div>

      {/* Image Modal */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered size="lg">
        <Modal.Body className="p-0">
          {formData.images.length > 0 && (
            <img
              src={formData.images[selectedImageIndex]}
              alt={`Property ${selectedImageIndex + 1}`}
              className="w-100"
              style={{ maxHeight: '80vh', objectFit: 'contain' }}
            />
          )}
        </Modal.Body>
        <Modal.Header className="border-0 justify-content-between" style={{ backgroundColor: "#2C3E50" }}>
          <Button
            size="sm"
            onClick={() => {
              if (selectedImageIndex > 0) {
                setSelectedImageIndex(selectedImageIndex - 1);
              }
            }}
            disabled={selectedImageIndex === 0}
            className="border-0"
            style={{ backgroundColor: "#3498DB" }}
          >
            <ChevronLeft size={16} className="text-white" />
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (selectedImageIndex < formData.images.length - 1) {
                setSelectedImageIndex(selectedImageIndex + 1);
              }
            }}
            disabled={selectedImageIndex === formData.images.length - 1}
            className="border-0"
            style={{ backgroundColor: "#3498DB" }}
          >
            <ChevronRight size={16} className="text-white" />
          </Button>
          <Button
            size="sm"
            onClick={() => setShowImageModal(false)}
            className="border-0"
            style={{ backgroundColor: "#E74C3C" }}
          >
            <X size={16} className="text-white" />
          </Button>
        </Modal.Header>
      </Modal>
    </div>
  );
}