import React, { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

//initial state
const initialState = {
  todos: {},
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
    id: 0,
  },
  lastTodosState: {},
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
