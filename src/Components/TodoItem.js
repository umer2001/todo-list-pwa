import React, { useContext } from "react";
import { GlobalDispatchContext } from "../Context/GlobalContext";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Secondries } from "./Secondries";
import TodoCheckbox from "./TodoCheckbox";

export const TodoItem = ({ todo }) => {
  const dispatch = useContext(GlobalDispatchContext);

  const openTodoDetail = () => {
    dispatch({
      type: "OPEN_TODO_DETAIL",
      payload: todo._id,
    });
  };

  return (
    <ListItem button>
      <TodoCheckbox id={todo._id} priority={todo.priority} todo={todo} />
      <ListItemText
        disableTypography
        primary={todo.todo}
        secondary={
          <Secondries
            date={todo.date}
            numberOfComments={todo.comments.length}
            numberOfReminders={todo.reminders.length}
          />
        }
        onClick={openTodoDetail}
      />
    </ListItem>
  );
};

export default TodoItem;
