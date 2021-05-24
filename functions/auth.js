const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { USER_EXISTS, USER_BY_EMAIL } = require("./utils/userQuries");
const sendQuery = require("./utils/sendQuries");
const formattedResponse = require("./utils/formattedResponse");
require("dotenv").config();

exports.handler = async (event) => {
  const { email, password } = JSON.parse(event.body);

  if (!email || !password) {
    return formattedResponse(400, {
      err: "Email or Password not provided",
    });
  }

  var variables = {
    email,
  };

  try {
    // user already exists
    const { userExists } = await sendQuery(USER_EXISTS, variables);
    console.log("res", userExists);
    if (!userExists) {
      return formattedResponse(400, {
        err: `Email ${email} does not exists`,
      });
    }

    // get user info
    const { userByEmail } = await sendQuery(USER_BY_EMAIL, variables);

    const isMatched = await bcrypt.compare(password, userByEmail.password);
    if (!isMatched) {
      return formattedResponse(400, { err: "invalid password" });
    }

    const token = jwt.sign({ id: userByEmail._id }, process.env.JWT_SECRET);
    console.log("token : ", token);
    return formattedResponse(200, {
      token,
      user: {
        name: userByEmail.name,
        email: userByEmail.email,
        _id: userByEmail._id,
      },
    });
  } catch (err) {
    console.error(err);
    return formattedResponse(500, { err: "Something went wrong" });
  }
};
