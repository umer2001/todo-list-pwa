import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Secondries } from "./Secondries";
import TodoCheckbox from "./TodoCheckbox";

export const TodoItem = ({ todo }) => {
  return (
    <ListItem button>
      <TodoCheckbox id={todo._id} priority={todo.priority} />
      <ListItemText
        disableTypography
        primary={todo.todo}
        secondary={<Secondries comments={todo.comments} date={todo.date} />}
      />
    </ListItem>
  );
};

export default TodoItem;
