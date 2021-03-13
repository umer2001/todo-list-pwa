const { CREATE_SUB_TODO } = require("./utils/todoQuries");
const sendQuery = require("./utils/sendQuries");
const formattedResponse = require("./utils/formattedResponse");

exports.handler = async (event) => {
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
  try {
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
