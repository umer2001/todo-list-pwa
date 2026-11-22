const { getDb } = require("./db");

async function userExists(email) {
  const sql = getDb();
  const normalizedEmail = email.trim().toLowerCase();
  const rows = await sql`
    SELECT 1
    FROM users
    WHERE LOWER(email) = ${normalizedEmail}
    LIMIT 1
  `;
  return rows.length > 0;
}

async function getUserByEmail(email) {
  const sql = getDb();
  const normalizedEmail = email.trim().toLowerCase();
  const rows = await sql`
    SELECT id::text AS "_id", name, email, password
    FROM users
    WHERE LOWER(email) = ${normalizedEmail}
    LIMIT 1
  `;
  return rows[0] || null;
}

async function createUser({ name, email, passwordHash }) {
  const sql = getDb();
  const normalizedEmail = email.trim().toLowerCase();
  const rows = await sql`
    INSERT INTO users (name, email, password)
    VALUES (${name}, ${normalizedEmail}, ${passwordHash})
    RETURNING id::text AS "_id", name, email
  `;
  return rows[0];
}

module.exports = {
  userExists,
  getUserByEmail,
  createUser,
};

