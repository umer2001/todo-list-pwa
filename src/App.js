import React from "react";
import Appbar from "./Components/Partials/Appbar";
import GlobalProvider from "./Context/GlobalContext";
import "./App.css";
import TodoList from "./Components/TodoList";
import Addtodo from "./Components/Partials/Addtodo";
import Toast from "./Components/Toast";

function App() {
  return (
    <div className="App">
      <Appbar />
      <GlobalProvider>
        <Addtodo />
        <TodoList />
        <Addtodo />
        <Toast />
      </GlobalProvider>
    </div>
  );
}

export default App;
