import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button, Modal, Image, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function PropertyGallery({ images = [], title }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const displayImages = images.length > 0 ? images : [
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
  ];

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const openModal = (index = 0) => {
    setSelectedImage(index);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  return (
    <>
      <div className="row g-3 mb-4">
        {/* Main image */}
        <div
          className="col-12 col-lg-6 col-xl-8"
          onClick={() => openModal(0)}
          style={{ cursor: 'pointer' }}
        >
          <div className="position-relative rounded overflow-hidden" style={{ height: '300px' }}>
            <Image
              src={displayImages[0]}
              alt={title}
              className="w-100 h-100 object-fit-cover"
              style={{ objectFit: 'cover' }}
            />
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-black opacity-0 hover-opacity-25 transition-opacity" />
          </div>
        </div>

        {/* Thumbnail images */}
        {displayImages.slice(1, 5).map((image, index) => (
          <div
            key={index + 1}
            className="col-6 col-md-4 col-lg-3 col-xl-2"
            onClick={() => openModal(index + 1)}
            style={{ cursor: 'pointer' }}
          >
            <div className="position-relative rounded overflow-hidden" style={{ height: '150px' }}>
              <Image
                src={image}
                alt={`${title} - Image ${index + 2}`}
                className="w-100 h-100 object-fit-cover"
                style={{ objectFit: 'cover' }}
              />
              <div className="position-absolute top-0 start-0 w-100 h-100 bg-black opacity-0 hover-opacity-25 transition-opacity" />

              {/* Show more overlay for last image */}
              {index === 3 && displayImages.length > 5 && (
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#2C3E50", opacity: 0.8 }}>
                  <span className="text-white fw-bold fs-5">
                    +{displayImages.length - 5} more
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={closeModal} centered size="lg" contentClassName="bg-dark">
        <Modal.Body className="p-0 position-relative">
          <Image
            src={displayImages[selectedImage]}
            alt={`${title} - Image ${selectedImage + 1}`}
            className="w-100"
            style={{ maxHeight: '80vh', objectFit: 'contain' }}
          />

          {displayImages.length > 1 && (
            <>
              <Button
                className="position-absolute top-50 start-0 translate-middle-y rounded-circle p-2 m-2 border-0"
                onClick={prevImage}
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  backgroundColor: "#3498DB" 
                }}
              >
                <ChevronLeft size={20} className="text-white" />
              </Button>
              <Button
                className="position-absolute top-50 end-0 translate-middle-y rounded-circle p-2 m-2 border-0"
                onClick={nextImage}
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  backgroundColor: "#3498DB" 
                }}
              >
                <ChevronRight size={20} className="text-white" />
              </Button>
            </>
          )}
        </Modal.Body>
        <Modal.Header className="border-0 position-absolute top-0 end-0 p-2">
          <Button
            className="rounded-circle p-1 border-0"
            onClick={closeModal}
            style={{ 
              width: '30px', 
              height: '30px', 
              backgroundColor: "#E74C3C" 
            }}
          >
            <X size={16} className="text-white" />
          </Button>
        </Modal.Header>
      </Modal>

      <style jsx>{`
        .hover-opacity-25:hover {
          opacity: 0.25;
        }
        .transition-opacity {
          transition: opacity 0.3s ease;
        }
      `}</style>
    </>
  );
}