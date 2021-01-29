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
        const res = await fetch("/.netlify/functions/getTodos");
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
    //TODO: eslint
    // eslint-disable-next-line
  }, []);

  return (
    <List width="100%" className={classes.root}>
      {Object.keys(todos).map((todo) => {
        if (!todos[todo].status) {
          return <TodoItem key={todo} todo={todos[todo]} />;
        } else {
          return "";
        }
      })}
    </List>
  );
};

export default TodoList;
