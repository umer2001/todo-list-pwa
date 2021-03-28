import { addToObject, createScheduledNotification } from "./helperFunctions";
//TODO: eslint
// eslint-disable-next-line
export default (state, action) => {
  switch (action.type) {
    case "SET_TODOS": {
      return {
        ...state,
        todos: action.payload,
      };
    }
    case "DELETE_TODO_TMP": {
      action.payload = state.todos[action.payload.uid];
      delete state.todos[action.payload.uid];
      return {
        ...state,
        todos: state.todos,
        lastTodosState: action.payload,
      };
    }
    case "RE_ADD_TODO_TO_STATE": {
      const reAddedList = addToObject(
        state.todos,
        state.lastTodosState._id,
        state.lastTodosState
      );

      return {
        ...state,
        todos: reAddedList,
      };
    }
    case "DELETE_TODO": {
      try {
        fetch("/.netlify/functions/deleteTodo", {
          method: "DELETE",
          body: JSON.stringify(action.payload),
        })
          .then((res) => res.json())
          .then((todo) => {
            console.log(todo);
          });
      } catch (err) {
        console.log(err);
      }
      delete state.todos[action.payload.id];
      return {
        ...state,
        todos: state.todos,
      };
    }
    case "DELETE_SUB_TODO_TMP": {
      const { parentId, uid } = action.payload;
      var subTodos;
      try {
        subTodos = state.todos[parentId].subtodos;
      } catch (error) {
      } finally {
        return {
          ...state,
          todos: {
            ...state.todos,
            [parentId]: {
              ...state.todos[parentId],
              subtodos: state.todos[parentId].subtodos.filter(
                (subTodo) => subTodo.uid !== uid
              ),
            },
          },
          lastSubTodosState: {
            parentId: parentId,
            subTodos: subTodos,
          },
        };
      }
    }
    case "RE_ADD_SUB_TODO_TO_STATE": {
      const { parentId, subTodos } = state.lastSubTodosState;
      return {
        ...state,
        todos: {
          ...state.todos,
          [parentId]: {
            ...state.todos[parentId],
            subtodos: subTodos,
          },
        },
        lastSubTodosState: {
          parentId: null,
          subTodos: [],
        },
      };
    }
    case "ADD_TODO": {
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
      state.todos[action.payload.uid] = action.payload;
      return {
        ...state,
        todos: state.todos,
      };
    }
    case "UPDATE_TODO": {
      const { uid, property, data } = action.payload;
      const updatedstate = {
        ...state,
        todos: {
          ...state.todos,
          [uid]: {
            ...state.todos[uid],
            [property]:
              property === "priority"
                ? data
                : [...state.todos[uid][property], data],
          },
        },
      };
      try {
        console.log("updating", action.payload);

        fetch("/.netlify/functions/updateTodo", {
          method: "PUT",
          body: JSON.stringify(updatedstate.todos[uid]),
        })
          .then((res) => res.json())
          .then((todo) => {
            console.log(todo);
          });
      } catch (err) {
        console.log(err);
      }
      console.log(updatedstate);
      return updatedstate;
    }
    case "SHOW_TOAST": {
      return {
        ...state,
        toast: {
          ...state.toast,
          show: true,
          uid: action.payload.uid ? action.payload.uid : action.payload,
          parentId: action.payload.parentId ? action.payload.parentId : null,
        },
      };
    }
    case "HIDE_TOAST": {
      return {
        ...state,
        toast: {
          show: false,
          id: null,
          parentId: null,
        },
      };
    }
    case "OPEN_BOTTOM_DRAWER": {
      const { isPermissionDialogOpen, todoDetailDrawer, rightDrawer } = state;
      if (action.payload) {
        window.history.pushState(
          {
            isPermissionDialogOpen,
            rightDrawer,
            todoDetailDrawer,
            bottomDrawer: {
              open: true,
              subTodo: true,
              uid: action.payload,
            },
          },
          "",
          "/AddNew"
        );
        return {
          ...state,
          bottomDrawer: {
            open: true,
            subTodo: true,
            uid: action.payload,
          },
        };
      } else {
        window.history.pushState(
          {
            isPermissionDialogOpen,
            rightDrawer,
            todoDetailDrawer,
            bottomDrawer: {
              open: true,
            },
          },
          "",
          "/AddNew"
        );
        return {
          ...state,
          bottomDrawer: {
            open: true,
          },
        };
      }
    }
    case "CLOSE_BOTTOM_DRAWER": {
      window.history.back();
      return {
        ...state,
        bottomDrawer: {
          open: false,
        },
      };
    }
    case "ADD_SUB_TODO": {
      const { parentId, newTodo } = action.payload;

      try {
        fetch("/.netlify/functions/addSubTodo", {
          method: "POST",
          body: JSON.stringify(action.payload),
        })
          .then((res) => res.json())
          .then((formated) => {
            console.log(formated);
          });
      } catch (err) {
        console.log(err);
      }
      state.todos[newTodo.uid] = newTodo;
      return {
        ...state,
        todos: {
          ...state.todos,
          [parentId]: {
            ...state.todos[parentId],
            subtodos: [...state.todos[parentId].subtodos, { uid: newTodo.uid }],
          },
        },
      };
    }
    case "OPEN_TODO_DETAIL": {
      const { isPermissionDialogOpen, bottomDrawer, rightDrawer } = state;
      window.history.pushState(
        {
          isPermissionDialogOpen,
          bottomDrawer,
          rightDrawer,
          todoDetailDrawer: {
            open: true,
            uid: action.payload,
          },
        },
        "",
        "/TodoDetail"
      );
      return {
        ...state,
        todoDetailDrawer: {
          open: true,
          uid: action.payload,
        },
      };
    }
    case "CLOSE_TODO_DETAIL": {
      if (action.payload !== "noWimdowHistoryBack") {
        window.history.back();
      }

      return {
        ...state,
        todoDetailDrawer: {
          ...state.todoDetailDrawer,
          open: false,
          uid: null,
        },
      };
    }
    case "OPEN_RIGHT_DRAWER": {
      const { isPermissionDialogOpen, bottomDrawer, todoDetailDrawer } = state;
      window.history.pushState(
        {
          isPermissionDialogOpen,
          bottomDrawer,
          todoDetailDrawer,
          rightDrawer: {
            open: true,
            type: action.payload.type,
            uid: action.payload.uid,
          },
        },
        "",
        `/${action.payload.type}`
      );
      return {
        ...state,
        rightDrawer: {
          open: true,
          type: action.payload.type,
          uid: action.payload.uid,
        },
      };
    }
    case "CLOSE_RIGHT_DRAWER": {
      window.history.back();
      return {
        ...state,
        rightDrawer: {
          ...state.rightDrawer,
          open: false,
        },
      };
    }
    case "SET_REMINDER": {
      const { uid, data } = action.payload;
      const { todo } = state.todos[uid];
      if ("showTrigger" in Notification.prototype) {
        Notification.requestPermission();
        createScheduledNotification(uid, todo, data);
      } else {
        const { rightDrawer, bottomDrawer, todoDetailDrawer } = state;
        window.history.pushState(
          {
            bottomDrawer,
            todoDetailDrawer,
            rightDrawer,
            isPermissionDialogOpen: true,
          },
          "",
          "/PermissionRequest"
        );
        return {
          ...state,
          isPermissionDialogOpen: true,
        };
      }
      return {
        ...state,
      };
    }
    case "CLOSE_PERMISSION_DIALOG": {
      window.history.back();
      return {
        ...state,
        isPermissionDialogOpen: false,
      };
    }
    case "POP_STATE": {
      if (window.history.state !== null) {
        const {
          bottomDrawer,
          rightDrawer,
          todoDetailDrawer,
        } = window.history.state;
        return {
          ...state,
          bottomDrawer,
          rightDrawer,
          todoDetailDrawer,
        };
      } else {
        break;
      }
    }
    case "CHANGE_THEME": {
      localStorage.setItem("theme", action.payload);
      return {
        ...state,
        theme: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};
