const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (event) => {
  const headers = (event && event.headers) || {};
  const token = headers["x-auth-token"] || headers["X-Auth-Token"];

  if (!token || token === "null" || token === "undefined") {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (
      !decoded ||
      decoded.id === undefined ||
      decoded.id === null ||
      !/^\d+$/.test(String(decoded.id))
    ) {
      return null;
    }
    return decoded;
  } catch (err) {
    console.error("could not decode jwt token : ", err);
    return null;
  }
};
