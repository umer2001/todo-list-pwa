import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
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
  return (
    <div className="App">
      <Appbar />
      <GlobalProvider>
        <TodoList />
        {/*  */}
        <Router>
          <Link to="/add-new">
            <AddTodoButton />
          </Link>

          <Route path="/add-new">
            <AddTodoDrawer />
          </Route>

          <RightDrawer />
          <TodoDetailDrawer />
        </Router>
        {/*  */}
        <Toast />
      </GlobalProvider>
    </div>
  );
}

export default App;
