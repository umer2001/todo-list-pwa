const bcrypt = require("bcrypt");
const { userExists, createUser } = require("../functions/utils/userQueries");
require("dotenv").config();

async function seedGuest() {
  const email = process.env.REACT_APP_GUEST_EMAIL;
  const password = process.env.REACT_APP_GUEST_PASSWORD;
  const name = process.env.GUEST_NAME || "Guest";

  if (!email || !password) {
    console.error(
      "Error: REACT_APP_GUEST_EMAIL and REACT_APP_GUEST_PASSWORD must be set."
    );
    process.exit(1);
  }

  const exists = await userExists(email);
  if (exists) {
    console.log(`Guest user (${email}) already exists. Skipping.`);
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const user = await createUser({ name, email, passwordHash });
  console.log(`Guest user created successfully: ${user.email} (id: ${user._id})`);
}

if (require.main === module) {
  seedGuest().catch((err) => {
    console.error("Failed to seed guest user:", err);
    process.exit(1);
  });
}

module.exports = { seedGuest };

