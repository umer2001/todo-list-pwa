const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userExists, createUser } = require("./utils/userQueries");
const { parseJsonBody, isNonEmptyString } = require("./utils/db");
const formattedResponse = require("./utils/formattedResponse");
require("dotenv").config();

exports.handler = async (event) => {
  const parsed = parseJsonBody(event);
  if (!parsed.ok) {
    return formattedResponse(400, { err: parsed.error });
  }

  const { name, email, password } = parsed.data;

  if (
    !isNonEmptyString(email) ||
    !isNonEmptyString(name) ||
    typeof password !== "string" ||
    !password
  ) {
    return formattedResponse(400, {
      err: "Name, Email or Password not provided",
    });
  }

  try {
    const exists = await userExists(email);
    if (exists) {
      return formattedResponse(400, {
        err: `Email ${email} already exists`,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const createdUser = await createUser({
      name: name.trim(),
      email,
      passwordHash,
    });
    const token = jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET);

    return formattedResponse(200, {
      token,
      user: createdUser,
    });
  } catch (err) {
    if (err && err.code === "23505") {
      return formattedResponse(400, {
        err: `Email ${email} already exists`,
      });
    }
    console.error(err);
    return formattedResponse(500, { err: "Something went wrong" });
  }
};
