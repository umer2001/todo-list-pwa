import React, { useContext } from "react";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@material-ui/core";
import { GlobalDispatchContext } from "../Context/GlobalContext";
import { Secondries } from "./Secondries";
import TodoCheckbox from "./TodoCheckbox";

export const TodoItem = ({ todo }) => {
  const dispatch = useContext(GlobalDispatchContext);

  const openTodoDetail = () => {
    dispatch({
      type: "OPEN_TODO_DETAIL",
      payload: todo.uid,
    });
  };

  return (
    <ListItem
      button
      divider
      style={{ paddingRight: "16px" }}
      onClick={openTodoDetail}
    >
      <ListItemText
        primaryTypographyProps={{ color: "textPrimary" }}
        primary={todo.todo}
        style={{ paddingLeft: "45px" }}
        secondaryTypographyProps={{ component: "div" }}
        secondary={
          <Secondries
            date={todo.date}
            numberOfSubTodos={todo.subtodos.length}
            numberOfComments={todo.comments.length}
            numberOfReminders={todo.reminders.length}
          />
        }
      />
      <ListItemSecondaryAction style={{ width: "min-content", left: "10px" }}>
        {/* TODO: check if we can remove  priority={todo.priority}*/}
        <TodoCheckbox uid={todo.uid} priority={todo.priority} todo={todo} />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default TodoItem;
