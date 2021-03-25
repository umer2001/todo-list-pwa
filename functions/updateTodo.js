const { UPDATE_TODO } = require("./utils/todoQuries");
const sendQuery = require("./utils/sendQuries");
const formattedResponse = require("./utils/formattedResponse");

exports.handler = async (event) => {
  if (event.httpMethod !== "PUT") {
    return formattedResponse(405, { err: "Method not supported" });
  }
  console.log(event.body);
  const {
    _id: id,
    todo,
    description,
    status,
    uid,
    date,
    priority,
    subtodos,
    comments,
    reminders,
  } = JSON.parse(event.body);
  const variables = {
    id,
    todo,
    description: "",
    uid,
    status,
    date,
    priority,
    comments,
    reminders,
  };
  try {
    const { updateTodo: updatedTodo } = await sendQuery(UPDATE_TODO, variables);

    return formattedResponse(200, updatedTodo);
  } catch (err) {
    console.error(err);
    return formattedResponse(500, { err: "Something went wrong" });
  }
};
