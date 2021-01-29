import React, { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

//initial state
const initialState = {
  todos: {},
  bottomDrawer: {
    open: false,
    subTodo: false,
    id: null,
  },
  todoDetailDrawer: {
    open: false,
    id: null,
  },
  rightDrawer: {
    open: false,
    type: null,
    id: null,
  },
  toast: {
    show: false,
    id: null,
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
  const [state, dispatch] = useReducer(AppReducer, initialState);

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
};

export default GlobalProvider;
