const { CREATE_SUB_TODO } = require("./utils/todoQuries");
const sendQuery = require("./utils/sendQuries");
const formattedResponse = require("./utils/formattedResponse");
const decode = require("./utils/decode");

exports.handler = async (event) => {
  try {
    const decoded = decode(event);
    if (!decoded) {
      return formattedResponse(401, { err: "No Token, can not authorize" });
    }
    console.log(decoded);

    const { newTodo, parentId } = JSON.parse(event.body);
    const {
      todo,
      description,
      uid,
      status,
      priority,
      subtodos,
      comments,
      reminders,
    } = newTodo;
    const variables = {
      userId: decoded.id,
      parentId,
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

    const { createSubTodo: createdSubTodo } = await sendQuery(
      CREATE_SUB_TODO,
      variables
    );

    return formattedResponse(200, createdSubTodo);
  } catch (err) {
    console.error(err);
    return formattedResponse(500, { err: "Something went wrong" });
  }
};
