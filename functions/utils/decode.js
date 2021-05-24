const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (event) => {
  if (
    !event.headers["x-auth-token"] ||
    event.headers["x-auth-token"] === "null"
  ) {
    return null;
  }

  console.log("trying...");
  try {
    const decoded = jwt.verify(
      event.headers["x-auth-token"],
      process.env.JWT_SECRET
    );
    return decoded;
  } catch (err) {
    console.error("could not decode jwt token : ", err);
  }
};
