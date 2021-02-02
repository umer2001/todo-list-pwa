const {
  UPDATE_TODO,
  DELETE_TODO,
  GET_TODO_BY_ID,
} = require("./utils/todoQuries");
const sendQuery = require("./utils/sendQuries");
const formattedResponse = require("./utils/formattedResponse");

async function recursiveDelete(id) {
  // find all sub toods for the (parent) id
  const variables = { id };
  const { findTodoByID: Todo } = await sendQuery(GET_TODO_BY_ID, variables);
  // save sub todos of (parent) id
  console.log(Todo.subtodos);
  // delete todo with (parent) id
  const { deleteTodo: deletedTodo } = await sendQuery(DELETE_TODO, variables);
  // now check if saved sub todos are more than 0
  if (Todo.subtodos.length > 0) {
    // call the same finction with each saved sub todo id
    Todo.subtodos.forEach(async (subTodo) => {
      await recursiveDelete(subTodo._id);
    });
  } else {
    // there is no sub todo under this id
    return;
  }
}

exports.handler = async (event, context, callback) => {
  try {
    const { id, parentId } = JSON.parse(event.body);
    console.log(`got :  ${id}\tparent id : ${parentId}`);
    // if sub delete refrence from parent
    if (parentId) {
      const { findTodoByID: parentTodo } = await sendQuery(GET_TODO_BY_ID, {
        id: parentId,
      });
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
    }
    // delete todo and all its sub todos
    await recursiveDelete(id);
    return formattedResponse(200, { body: "deleting..." });
  } catch (err) {
    console.error(err);
    return formattedResponse(500, { err: "Something went wrong" });
  }
};
