const { DELETE_TODO } = require("./utils/todoQuries");
const sendQuery = require("./utils/sendQuries");
const formattedResponse = require("./utils/formattedResponse");

exports.handler = async (event) => {
  if (event.httpMethod !== "DELETE") {
    return formattedResponse(405, { err: "Method not supported" });
  }

  const { id } = JSON.parse(event.body);
  const variables = { id };
  try {
    const { deleteTodo: deletedTodo } = await sendQuery(DELETE_TODO, variables);
    return formattedResponse(200, deletedTodo);
  } catch (err) {
    console.error(err);
    return formattedResponse(500, { err: "Something went wrong" });
  }
};
