const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Function to initialize the database
const initDB = async () => {
    try {
        console.log("✅ Initializing database...");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS groups (
                                                  id SERIAL PRIMARY KEY,
                                                  name TEXT NOT NULL UNIQUE,
                                                  color TEXT NOT NULL
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS guests (
                                                  id SERIAL PRIMARY KEY,
                                                  name TEXT NOT NULL,
                                                  phone TEXT NOT NULL,
                                                  primary_group_id INT REFERENCES groups(id) ON DELETE SET NULL,
                                                  status TEXT DEFAULT 'Not Invited'
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS guest_groups (
                guest_id INT REFERENCES guests(id) ON DELETE CASCADE,
                group_id INT REFERENCES groups(id) ON DELETE CASCADE,
                PRIMARY KEY (guest_id, group_id)
            );
        `);

        console.log("✅ Database initialized successfully!");
    } catch (error) {
        console.error("❌ Error initializing database:", error);
        throw new Error("Database initialization failed");
    }
};

// Run database initialization (Ensure this is run asynchronously)
const runInitDB = async () => {
    try {
        await initDB();
    } catch (error) {
        console.error("❌ Error running DB initialization:", error);
    }
};

// Make sure to run the DB initialization before any other query execution
runInitDB();

module.exports = {
    query: async (text, params) => {
        try {
            const result = await pool.query(text, params);
            return result;
        } catch (error) {
            console.error("❌ Error executing query:", error);
            throw new Error("Query execution failed");
        }
    },
};
