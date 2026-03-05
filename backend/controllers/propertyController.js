// backend/controllers/propertyController.js
const db = require('../db');

// Get all available properties
const getAllProperties = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        r.id AS id,
        r.room_number,
        r.status,
        rt.type_name AS title,
        rt.description,
        rt.price_per_night,
        rt.max_occupancy AS max_guests,
        h.name AS location,
        h.image_url AS hotel_image
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.id
      JOIN hotels h ON r.hotel_id = h.id
      WHERE r.status = 'available'
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get a single property by ID
const getProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `
      SELECT 
        r.id AS id,
        r.room_number,
        r.status,
        rt.type_name AS title,
        rt.description,
        rt.price_per_night,
        rt.max_occupancy AS max_guests,
        h.name AS location,
        h.image_url AS hotel_image
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.id
      JOIN hotels h ON r.hotel_id = h.id
      WHERE r.id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
};

// Create a new property
const createProperty = async (req, res) => {
  try {
    const { room_number, status, room_type_id, hotel_id } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO rooms (room_number, status, room_type_id, hotel_id)
      VALUES (?, ?, ?, ?)
      `,
      [room_number, status, room_type_id, hotel_id]
    );

    res.status(201).json({ message: 'Property created successfully', id: result.insertId });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
};

// Update a property
const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { room_number, status, room_type_id, hotel_id } = req.body;

    await db.query(
      `
      UPDATE rooms
      SET room_number = ?, status = ?, room_type_id = ?, hotel_id = ?
      WHERE id = ?
      `,
      [room_number, status, room_type_id, hotel_id, id]
    );

    res.status(200).json({ message: 'Property updated successfully' });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
};

// Delete a property
const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(`DELETE FROM rooms WHERE id = ?`, [id]);

    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
};

module.exports = {
  getAllProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
};
