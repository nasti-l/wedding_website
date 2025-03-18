const { getAllGroups, addGroup } = require("../models/groupModel");

const createGroup = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) return res.status(400).json({ error: "Group name is required" });

        // Generate a color
        const color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`;

        const group = await addGroup(name, color);
        return res.status(201).json(group);
    } catch (error) {
        console.error("Error adding group:", error);
        res.status(500).json({ error: "Failed to add group" });
    }
};

const getGroups = async (req, res) => {
    try {
        const groups = await getAllGroups();
        res.json(groups);
    } catch (error) {
        console.error("Error fetching groups:", error);
        res.status(500).json({ error: "Failed to retrieve groups" });
    }
};

module.exports = { createGroup, getGroups };
