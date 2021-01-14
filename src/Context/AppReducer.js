//TODO: eslint
// eslint-disable-next-line
export default (state, action) => {
  switch (action.type) {
    case "SET_TODOS":
      return {
        ...state,
        todos: action.payload,
      };
    case "DELETE_TODO_TMP":
      var todoCpy = state.todos;
      const filteredList = state.todos.filter(
        (todo) => todo._id !== action.payload
      );
      return {
        ...state,
        todos: filteredList,
        lastTodosState: todoCpy,
      };
    case "RE_ADD_TODO_TO_STATE":
      return {
        ...state,
        todos: state.lastTodosState,
      };

    case "DELETE_TODO":
      try {
        fetch("/api/deleteTodo", {
          method: "DELETE",
          body: JSON.stringify({
            id: action.payload,
          }),
        })
          .then((res) => res.json())
          .then((todo) => {
            console.log(todo);
          });
      } catch (err) {
        console.log(err);
      }
      return {
        ...state,
        todos: state.todos.filter((todo) => todo._id !== action.payload),
      };
    case "ADD_TODO":
      try {
        fetch("/api/createTodo", {
          method: "POST",
          body: JSON.stringify(action.payload),
        })
          .then((res) => res.json())
          .then((todo) => {
            console.log(todo);
          });
      } catch (err) {
        console.log(err);
      }
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    case "SHOW_TOAST":
      return {
        ...state,
        toast: {
          ...state.toast,
          show: true,
          id: action.payload,
        },
      };
    case "HIDE_TOAST":
      return {
        ...state,
        toast: {
          ...state.toast,
          show: false,
        },
      };
    default:
      return state;
  }
};
