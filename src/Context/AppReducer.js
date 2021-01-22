import { addToObject } from "./helperFunctions";
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
      delete state.todos[action.payload._id];
      return {
        ...state,
        todos: state.todos,
        lastTodosState: action.payload,
      };
    case "RE_ADD_TODO_TO_STATE":
      const reAddedList = addToObject(
        state.todos,
        state.lastTodosState._id,
        state.lastTodosState
      );
      return {
        ...state,
        todos: reAddedList,
      };
    case "DELETE_TODO":
      try {
        fetch("/.netlify/functions/deleteTodo", {
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
      delete state.todos[action.payload];
      return {
        ...state,
        todos: state.todos,
      };
    case "ADD_TODO":
      try {
        fetch("/.netlify/functions/createTodo", {
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
      state.todos[action.payload._id] = action.payload;
      return {
        ...state,
        todos: state.todos,
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
    case "OPEN_TODO_DETAIL":
      return {
        ...state,
        todoDetailDrawer: {
          open: true,
          id: action.payload,
        },
      };
    case "CLOSE_TODO_DETAIL":
      return {
        ...state,
        todoDetailDrawer: {
          ...state.todoDetailDrawer,
          open: false,
        },
      };
    case "OPEN_RIGHT_DRAWER":
      return {
        ...state,
        rightDrawer: {
          open: true,
          type: action.payload.type,
          id: action.payload.id,
        },
      };
    case "CLOSE_RIGHT_DRAWER":
      return {
        ...state,
        rightDrawer: {
          ...state.rightDrawer,
          open: false,
        },
      };
    default:
      return state;
  }
};
