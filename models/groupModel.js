const db = require("../db");

const getAllGroups = async () => {
    try {
        const result = await db.query("SELECT * FROM groups");
        return result.rows;
    } catch (error) {
        console.error("❌ Error fetching groups:", error);
        throw error;
    }
};

const addGroup = async (name, color) => {
    try {
        const result = await db.query(
            "INSERT INTO groups (name, color) VALUES ($1, $2) ON CONFLICT (name) DO UPDATE SET color = EXCLUDED.color RETURNING *",
            [name, color]
        );
        return result.rows[0];
    } catch (error) {
        console.error("❌ Error adding group:", error);
        throw error;
    }
};

module.exports = { getAllGroups, addGroup };
