import React, { useContext } from "react";
import { GlobalDispatchContext } from "../Context/GlobalContext";
import Checkbox from "@material-ui/core/Checkbox";
import CircleCheckedFilled from "@material-ui/icons/CheckCircle";
import CircleUnchecked from "@material-ui/icons/RadioButtonUnchecked";

export const TodoCheckbox = ({ id, priority, todo }) => {
  const priorities = {
    P1: "#b71c1c",
    P2: "#ffd600",
    P3: "blue",
    P4: "inherit",
  };

  const dispatch = useContext(GlobalDispatchContext);

  const checkboxClicked = (e) => {
    if (e.target.checked) {
      //TODO: Hide that to item
      dispatch({
        type: "SHOW_TOAST",
        payload: id,
      });

      dispatch({
        type: "DELETE_TODO_TMP",
        payload: todo,
      });
    }
  };

  return (
    <>
      <Checkbox
        style={{ color: priorities[priority] }}
        icon={<CircleUnchecked />}
        checkedIcon={<CircleCheckedFilled />}
        onChange={checkboxClicked}
      />
    </>
  );
};

export default TodoCheckbox;
