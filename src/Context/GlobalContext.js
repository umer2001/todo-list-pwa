import React, { createContext, useReducer } from "react";
import logger from "use-reducer-logger";
import AppReducer from "./AppReducer";

//initial state
const initialState = {
  name: null,
  theme: "default",
  todos: {},
  isPermissionDialogOpen: false,
  bottomDrawer: {
    open: false,
    subTodo: false,
    id: null,
  },
  todoDetailDrawer: {
    open: false,
    uid: null,
  },
  rightDrawer: {
    open: false,
    type: null,
    uid: null,
  },
  toast: {
    show: false,
    uid: null,
    parentId: null,
  },
  lastTodosState: {},
  lastSubTodosState: {
    parentId: null,
    subTodos: [],
  },
};

//create context
export const GlobalStateContext = createContext();
export const GlobalDispatchContext = createContext();

//provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    process.env.REACT_APP_ENVIRONMENT === "development"
      ? logger(AppReducer)
      : AppReducer,
    initialState
  );

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
};

export default GlobalProvider;
