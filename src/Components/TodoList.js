import React, { useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import {
  GlobalDispatchContext,
  GlobalStateContext,
} from "../Context/GlobalContext";
import TodoItem from "./TodoItem";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

export const TodoList = () => {
  const classes = useStyles();

  const dispatch = useContext(GlobalDispatchContext);
  const { todos } = useContext(GlobalStateContext);

  useEffect(() => {
    const getTodos = async () => {
      try {
        const res = await fetch("/api/getTodos");
        const todos = await res.json();
        dispatch({
          type: "SET_TODOS",
          payload: todos,
        });
      } catch (err) {
        console.log(err);
      }
    };
    getTodos();
  }, []);

  return (
    <List width="100%" className={classes.root}>
      {todos.map((todo) => (
        <TodoItem key={todo._id} todo={todo} />
      ))}
    </List>
  );
};

export default TodoList;
