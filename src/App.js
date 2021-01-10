import React from "react";
import Appbar from "./Components/Partials/Appbar";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import "./App.css";
import { Todoitem } from "./Components/Todoitem";

function App() {
  return (
    <div className="App">
      <Appbar />
      <Fab color="primary" aria-label="add" className="fab">
        <AddIcon />
      </Fab>
      <Todoitem />
    </div>
  );
}

export default App;
