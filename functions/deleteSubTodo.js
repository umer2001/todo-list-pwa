const {
  DELETE_TODO,
  GET_TODO_BY_ID,
  UPDATE_TODO,
} = require("./utils/todoQuries");
const sendQuery = require("./utils/sendQuries");
const formattedResponse = require("./utils/formattedResponse");

exports.handler = async (event) => {
  if (event.httpMethod !== "DELETE") {
    return formattedResponse(405, { err: "Method not supported" });
  }

  const { id, parentId } = JSON.parse(event.body);
  const variables = { id };
  try {
    const { findTodoByID: subTodo } = await sendQuery(GET_TODO_BY_ID, {
      id,
    });
    subTodo.subtodos.forEach((subTodo) => {
      sendQuery(DELETE_TODO, { id: subTodo._id });
    });
    const { findTodoByID: parentTodo } = await sendQuery(GET_TODO_BY_ID, {
      id: parentId,
    });
    const { deleteTodo: deletedTodo } = await sendQuery(DELETE_TODO, variables);
    var formatedSubTodos = parentTodo.subtodos
      .filter((subTodo) => subTodo._id !== id)
      .map((subTodo) => subTodo._id);
    var updatedTodo = parentTodo;
    updatedTodo.subtodos = formatedSubTodos;
    updatedTodo.id = parentId;
    const { updateTodo: finalUpdatedTodo } = await sendQuery(
      UPDATE_TODO,
      updatedTodo
    );
    return formattedResponse(200, finalUpdatedTodo);
  } catch (err) {
    console.error(err);
    return formattedResponse(500, { err: "Something went wrong" });
  }
};
