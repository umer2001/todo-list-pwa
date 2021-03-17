import React, { useContext } from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { GlobalDispatchContext } from "../../Context/GlobalContext";

export const AddTodoButton = () => {
  const dispatch = useContext(GlobalDispatchContext);
  return (
    <Fab
      color="primary"
      aria-label="add"
      className="fab"
      onClick={() => {
        dispatch({ type: "OPEN_BOTTOM_DRAWER" });
        window.history.pushState({}, "Add New Todo", "/add-todo");
      }}
    >
      <AddIcon />
    </Fab>
  );
};

export default AddTodoButton;
