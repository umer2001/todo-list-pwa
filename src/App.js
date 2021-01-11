import React from "react";
import Appbar from "./Components/Partials/Appbar";
import "./App.css";
import { Todoitem } from "./Components/Todoitem";
import Addtodo from "./Components/Partials/Addtodo";

function App() {
  return (
    <div className="App">
      <Appbar />
      <Addtodo />
      <Todoitem />
      <Addtodo />
    </div>
  );
}

export default App;
