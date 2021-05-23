const { UPDATE_TODO } = require("./utils/todoQuries");
const sendQuery = require("./utils/sendQuries");
const formattedResponse = require("./utils/formattedResponse");
const decode = require("./utils/decode");

exports.handler = async (event) => {
  if (event.httpMethod !== "PUT") {
    return formattedResponse(405, { err: "Method not supported" });
  }
  console.log(event.body);

  try {
    const decoded = decode(event);
    if (!decoded) {
      return formattedResponse(401, { err: "No Token, can not authorize" });
    }
    console.log(decoded);

    const {
      _id: id,
      todo,
      description,
      status,
      uid: uId,
      date,
      priority,
      subtodos,
      comments,
      reminders,
    } = JSON.parse(event.body);
    const variables = {
      userId: decoded.id,
      uId,
      todo,
      description: "",
      status,
      date,
      priority,
      comments,
      reminders,
    };
    const { updateTodo: updatedTodo } = await sendQuery(UPDATE_TODO, variables);

    return formattedResponse(200, updatedTodo);
  } catch (err) {
    console.error(err);
    return formattedResponse(500, { err: "Something went wrong" });
  }
};
