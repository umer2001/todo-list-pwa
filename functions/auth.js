const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUserByEmail } = require("./utils/userQueries");
const { parseJsonBody, isNonEmptyString } = require("./utils/db");
const formattedResponse = require("./utils/formattedResponse");
require("dotenv").config();

exports.handler = async (event) => {
  const parsed = parseJsonBody(event);
  if (!parsed.ok) {
    return formattedResponse(400, { err: parsed.error });
  }

  const { email, password } = parsed.data;

  if (!isNonEmptyString(email) || typeof password !== "string" || !password) {
    return formattedResponse(400, {
      err: "Email or Password not provided",
    });
  }

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return formattedResponse(400, {
        err: `Email ${email} does not exists`,
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return formattedResponse(400, { err: "invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return formattedResponse(200, {
      token,
      user: {
        name: user.name,
        email: user.email,
        _id: user._id,
      },
    });
  } catch (err) {
    console.error(err);
    return formattedResponse(500, { err: "Something went wrong" });
  }
};
