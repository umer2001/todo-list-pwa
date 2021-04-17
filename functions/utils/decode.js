const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (event) => {
  if (!event.headers["x-auth-token"]) return null;

  const decoded = jwt.verify(
    event.headers["x-auth-token"],
    process.env.JWT_SECRET
  );
  return decoded;
};
