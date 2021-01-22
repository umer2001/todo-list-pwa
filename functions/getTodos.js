const { GET_ALLTODOS } = require("./utils/todoQuries");
const sendQuery = require("./utils/sendQuries");
const reducerFunction = require("./utils/reducerFunction");
const formattedResponse = require("./utils/formattedResponse");
exports.handler = async (event) => {
  try {
    const res = await sendQuery(GET_ALLTODOS);
    const data = res.allTodos.data;
    const convertedData = data.reduce(reducerFunction, {});
    return formattedResponse(200, convertedData);
  } catch (err) {
    console.error(err);
    return formattedResponse(500, { err: "Something went wrong" });
  }
};
