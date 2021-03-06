import React, { useContext } from "react";
import { GlobalDispatchContext } from "../Context/GlobalContext";
import Checkbox from "@material-ui/core/Checkbox";
import CircleCheckedFilled from "@material-ui/icons/CheckCircle";
import CircleUnchecked from "@material-ui/icons/RadioButtonUnchecked";

export const TodoCheckbox = ({ uid, parentId, priority, todo }) => {
  const priorities = {
    P1: "#b71c1c",
    P2: "#ffd600",
    P3: "blue",
    P4: "#e9e9e9",
  };

  const dispatch = useContext(GlobalDispatchContext);

  const checkboxClicked = (e) => {
    if (e.target.checked) {
      if (parentId) {
        dispatch({
          type: "SHOW_TOAST",
          payload: {
            uid,
            parentId,
          },
        });
        dispatch({
          type: "DELETE_SUB_TODO_TMP",
          payload: {
            uid,
            parentId,
          },
        });
      } else {
        dispatch({
          type: "CLOSE_TODO_DETAIL",
          payload: "noWimdowHistoryBack",
        });

        setTimeout(() => {
          dispatch({
            type: "SHOW_TOAST",
            payload: uid,
          });

          dispatch({
            type: "DELETE_TODO_TMP",
            payload: todo,
          });
        }, 200);
      }
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
