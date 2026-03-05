// backend/db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hotel_booking_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(connection => {
    console.log('✅ Connected to MySQL Database');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });

module.exports = {
  query: (sql, params) => pool.execute(sql, params),
  beginTransaction: async function() {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    return connection;
  },
  commit: async function(connection) {
    await connection.commit();
    connection.release();
  },
  rollback: async function(connection) {
    await connection.rollback();
    connection.release();
  }
};