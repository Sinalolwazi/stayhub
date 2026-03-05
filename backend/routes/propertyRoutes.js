// backend/routes/propertyRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
} = require('../controllers/propertyController');

// Routes
router.get('/', getAllProperties);        // GET all properties
router.get('/:id', getProperty);          // GET a property by ID
router.post('/', createProperty);         // POST new property
router.put('/:id', updateProperty);       // PUT update property
router.delete('/:id', deleteProperty);    // DELETE property

module.exports = router;
