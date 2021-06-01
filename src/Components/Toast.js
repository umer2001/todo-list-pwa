import React, { useContext } from "react";
import { Snackbar, Button } from "@material-ui/core";
import {
  GlobalDispatchContext,
  GlobalStateContext,
} from "../Context/GlobalContext";

export const Toast = () => {
  const dispatch = useContext(GlobalDispatchContext);
  const { toast } = useContext(GlobalStateContext);
  const undoClicked = () => {
    //TODO: if from undo show that item
    // onBoxClick("inline-flex");
    // setIsSnackOpen(false);
    dispatch({
      type: "HIDE_TOAST",
    });
    if (toast.parentId) {
      dispatch({
        type: "RE_ADD_SUB_TODO_TO_STATE",
      });
    } else {
      dispatch({
        type: "RE_ADD_TODO_TO_STATE",
      });
    }
  };

  const handleClose = (event, reason) => {
    //TODO: if from undo show that item
    // setIsSnackOpen(false);
    console.log("reason : ", reason);
    if (reason === "timeout" || reason === "clickaway") {
      dispatch({
        type: "DELETE_TODO",
        payload: {
          id: toast.uid,
          parentId: toast.parentId ? toast.parentId : null,
        },
      });
    }

    dispatch({
      type: "HIDE_TOAST",
    });
  };

  return (
    <Snackbar
      open={toast.show}
      autoHideDuration={6000}
      onClose={handleClose}
      message="completed"
      action={
        <Button color="secondary" size="small" onClick={undoClicked}>
          UNDO
        </Button>
      }
    />
  );
};
export default Toast;
