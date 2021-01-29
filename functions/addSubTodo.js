const {
  CREATE_TODO,
  GET_TODO_BY_ID,
  UPDATE_TODO,
} = require("./utils/todoQuries");
const sendQuery = require("./utils/sendQuries");
const formattedResponse = require("./utils/formattedResponse");

exports.handler = async (event) => {
  const { newTodo, parentId } = JSON.parse(event.body);
  const {
    todo,
    description,
    status,
    priority,
    subtodos,
    comments,
    reminders,
  } = newTodo;
  const variables = {
    todo,
    description: "",
    uid: `${Math.random()}`,
    status,
    date: new Date(),
    priority,
    subtodos,
    comments,
    reminders,
  };
  try {
    const { createTodo: createdTodo } = await sendQuery(CREATE_TODO, variables);
    const { findTodoByID: parentTodo } = await sendQuery(GET_TODO_BY_ID, {
      id: parentId,
    });
    var formatedSubTodos = parentTodo.subtodos.map((subTodo) => subTodo._id);
    formatedSubTodos.push(createdTodo._id);
    var updatedTodo = parentTodo;
    updatedTodo.subtodos = formatedSubTodos;
    updatedTodo.id = parentId;
    const { updateTodo: finalUpdatedTodo } = await sendQuery(
      UPDATE_TODO,
      updatedTodo
    );
    return formattedResponse(200, createdTodo);
  } catch (err) {
    console.error(err);
    return formattedResponse(500, { err: "Something went wrong" });
  }
};
