const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { USER_EXISTS, CREATE_USER } = require("./utils/userQuries");
const sendQuery = require("./utils/sendQuries");
const formattedResponse = require("./utils/formattedResponse");
require("dotenv").config();

exports.handler = async (event) => {
  const { name, email, password } = JSON.parse(event.body);

  if (!email || !password || !name) {
    return formattedResponse(400, {
      err: "Name, Email or Password not provided",
    });
  }

  var variables = {
    email,
  };

  try {
    // user already exists
    const { userExists } = await sendQuery(USER_EXISTS, variables);
    console.log("res", userExists);
    if (userExists) {
      return formattedResponse(400, {
        err: `Email ${email} already exists`,
      });
    }

    // create user
    variables.name = name;
    variables.password = password;

    const salt = await bcrypt.genSalt(10);
    console.log("salt : ", salt);
    const hash = await bcrypt.hash(variables.password, salt);
    console.log("hash : ", hash);
    variables.password = hash;
    const { createUser: createdUser } = await sendQuery(CREATE_USER, variables);
    console.log("createdUser :", createdUser);
    const token = jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET);
    console.log("token : ", token);
    return formattedResponse(200, {
      token,
      user: createdUser,
    });
  } catch (err) {
    console.error(err);
    return formattedResponse(500, { err: "Something went wrong" });
  }
};
