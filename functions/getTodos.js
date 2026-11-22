const { getTodosByUserId } = require("./utils/todoQueries");
const reducerFunction = require("./utils/reducerFunction");
const formattedResponse = require("./utils/formattedResponse");
const decode = require("./utils/decode");

exports.handler = async (event) => {
  try {
    const decoded = decode(event);
    if (!decoded) {
      return formattedResponse(401, { err: "No Token, can not authorize" });
    }

    const todos = await getTodosByUserId(decoded.id);
    const convertedData = todos.reduce(reducerFunction, {});

    return formattedResponse(200, convertedData);
  } catch (err) {
    console.error(err);
    return formattedResponse(500, { err: "Something went wrong" });
  }
};
