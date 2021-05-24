const { CREATE_TODO } = require("./utils/todoQuries");
const sendQuery = require("./utils/sendQuries");
const formattedResponse = require("./utils/formattedResponse");
const decode = require("./utils/decode");

exports.handler = async (event) => {
  console.log(JSON.parse(event.body));
  try {
    const decoded = decode(event);
    if (!decoded) {
      return formattedResponse(401, { err: "No Token, can not authorize" });
    }
    console.log(decoded);
    const {
      todo,
      description,
      uid,
      status,
      priority,
      subtodos,
      comments,
      reminders,
    } = JSON.parse(event.body);
    const variables = {
      userId: decoded.id,
      todo,
      description: "",
      uid,
      status,
      date: new Date(),
      priority,
      subtodos,
      comments,
      reminders,
    };

    const { createTodo: createdTodo } = await sendQuery(CREATE_TODO, variables);

    return formattedResponse(200, createdTodo);
  } catch (err) {
    console.error(err);
    return formattedResponse(500, { err: "Something went wrong" });
  }
};
