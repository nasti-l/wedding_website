const db = require("../db");

const addGuest = async (name, phone, groupIds, primaryGroupId) => {
  const client = await db.query("BEGIN"); // Start transaction
  try {
    // Insert guest
    const result = await db.query(
        "INSERT INTO guests (name, phone, primary_group_id) VALUES ($1, $2, $3) RETURNING id",
        [name, phone, primaryGroupId]
    );
    const guestId = result.rows[0].id;

    // Insert into guest_groups (many-to-many relationship)
    for (const groupId of groupIds) {
      await db.query(
          "INSERT INTO guest_groups (guest_id, group_id) VALUES ($1, $2)",
          [guestId, groupId]
      );
    }

    await db.query("COMMIT"); // Commit transaction
    return { id: guestId, name, phone, primaryGroupId, groupIds };
  } catch (error) {
    await db.query("ROLLBACK"); // Rollback transaction on error
    throw error;
  }
};

const getAllGuests = async () => {
  const result = await db.query(`
    SELECT
      g.id, g.name, g.phone, g.status, g.primary_group_id,
      COALESCE(json_agg(DISTINCT jsonb_build_object('id', gr.id, 'name', gr.name, 'color', gr.color))
               FILTER (WHERE gr.id IS NOT NULL), '[]') AS groups
    FROM guests g
           LEFT JOIN guest_groups gg ON g.id = gg.guest_id
           LEFT JOIN groups gr ON gg.group_id = gr.id
    GROUP BY g.id;
  `);
  return result.rows;
};

const deleteGuestById = async (id) => {
  await db.query("DELETE FROM guest_groups WHERE guest_id = $1", [id]); // Remove group associations
  const result = await db.query("DELETE FROM guests WHERE id = $1 RETURNING *", [id]);
  return result.rowCount > 0;
};

module.exports = { addGuest, getAllGuests, deleteGuestById };