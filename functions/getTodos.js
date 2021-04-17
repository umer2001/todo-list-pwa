const { GET_ALLTODOS, GET_TODOS_BY_USER_ID } = require("./utils/todoQuries");
const sendQuery = require("./utils/sendQuries");
const reducerFunction = require("./utils/reducerFunction");
const formattedResponse = require("./utils/formattedResponse");
const decode = require("./utils/decode");

exports.handler = async (event) => {
  try {
    const decoded = decode(event);
    if (!decoded) {
      formattedResponse(401, { err: "No Token, can not authorize" });
    }
    console.log(decoded);
    const variables = {
      userId: decoded.id,
    };
    const res = await sendQuery(GET_TODOS_BY_USER_ID, variables);
    console.log(res);
    const data = res.todosByUserId;
    const convertedData = data.reduce(reducerFunction, {});

    console.log(convertedData);
    // const res = await sendQuery(GET_ALLTODOS);
    // const data = res.allTodos.data;
    // const convertedData = data.reduce(reducerFunction, {});
    return formattedResponse(200, convertedData);
  } catch (err) {
    console.error(err);
    return formattedResponse(500, { err: "Something went wrong" });
  }
};
