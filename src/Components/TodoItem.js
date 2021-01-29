import React, { useContext } from "react";
import { GlobalDispatchContext } from "../Context/GlobalContext";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Secondries } from "./Secondries";
import TodoCheckbox from "./TodoCheckbox";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

export const TodoItem = ({ todo }) => {
  const dispatch = useContext(GlobalDispatchContext);

  const openTodoDetail = () => {
    dispatch({
      type: "OPEN_TODO_DETAIL",
      payload: todo._id,
    });
  };

  return (
    <ListItem button divider onClick={openTodoDetail}>
      <ListItemText
        disableTypography
        primary={todo.todo}
        style={{ paddingLeft: "45px" }}
        secondary={
          <Secondries
            date={todo.date}
            numberOfComments={todo.comments.length}
            numberOfReminders={todo.reminders.length}
          />
        }
      />
      <ListItemSecondaryAction style={{ width: "min-content", left: "10px" }}>
        <TodoCheckbox id={todo._id} priority={todo.priority} todo={todo} />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default TodoItem;
