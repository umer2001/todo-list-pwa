import React, { useEffect } from "react";
import Appbar from "./Components/Partials/Appbar";
import GlobalProvider from "./Context/GlobalContext";
import "./App.css";
import TodoList from "./Components/TodoList";
import AddTodoDrawer from "./Components/AddTodoDrawer";
import Toast from "./Components/Toast";
import RightDrawer from "./Components/RightDrawer";
import TodoDetailDrawer from "./Components/TodoDetailDrawer";
import AddTodoButton from "./Components/Partials/AddTodoButton";

function App() {
  useEffect(() => {
    window.addEventListener("load", function () {
      window.history.pushState({}, "");
    });

    window.addEventListener("popstate", function () {
      window.history.pushState({}, "");
    });
  }, []);
  return (
    <div className="App">
      <Appbar />
      <GlobalProvider>
        <TodoList />
        <AddTodoButton />
        <AddTodoDrawer />
        <RightDrawer />
        <TodoDetailDrawer />
        <Toast />
      </GlobalProvider>
    </div>
  );
}

export default App;
