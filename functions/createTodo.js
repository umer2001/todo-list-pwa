const { CREATE_TODO } = require("./utils/todoQuries");
const sendQuery = require("./utils/sendQuries");
const formattedResponse = require("./utils/formattedResponse");

exports.handler = async (event) => {
  const {
    todo,
    description,
    priority,
    subtodos,
    comments,
    reminders,
  } = JSON.parse(event.body);
  const variables = {
    todo,
    description: "",
    uid: `${Math.random()}`,
    status: false,
    date: new Date(),
    priority,
    subtodos,
    comments,
    reminders,
  };
  try {
    const { createTodo: createdTodo } = await sendQuery(CREATE_TODO, variables);

    return formattedResponse(200, createdTodo);
  } catch (err) {
    console.error(err);
    return formattedResponse(500, { err: "Something went wrong" });
  }
};
