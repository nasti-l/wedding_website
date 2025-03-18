const db = require("../db");

const addGuest = async (name, phone, groups, primaryGroup) => {
  const result = await db.query(
      "INSERT INTO guests (name, phone, groups, primary_group) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, phone, groups, primaryGroup]
  );
  return result.rows[0];
};

const getAllGuests = async () => {
  const result = await db.query("SELECT * FROM guests");
  return result.rows;
};

const deleteGuestById = async (id) => {
  const result = await db.query("DELETE FROM guests WHERE id = $1 RETURNING *", [id]);
  return result.rowCount > 0;
};

module.exports = { addGuest, getAllGuests, deleteGuestById };
