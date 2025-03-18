const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Function to initialize the database
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS guests (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        groups TEXT[],
        primary_group TEXT NOT NULL,
        status TEXT DEFAULT 'Not Invited'
      );
    `);
    console.log("✅ Database initialized");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
  }
};

// Run database initialization
initDB();

module.exports = {
  query: (text, params) => pool.query(text, params),
};
