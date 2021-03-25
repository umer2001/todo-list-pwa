import React, { useState, useContext } from "react";
import { GlobalDispatchContext } from "../Context/GlobalContext";
import { makeStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SendRoundedIcon from "@material-ui/icons/SendRounded";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
  },
  margin: {
    padding: theme.spacing(1, 0, 1, 2),
    width: "85%",
  },
}));

export const AddComment = ({ uid }) => {
  const classes = useStyles();
  const [comment, setComment] = useState("");
  const dispatch = useContext(GlobalDispatchContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment !== "") {
      dispatch({
        type: "UPDATE_TODO",
        payload: {
          uid,
          property: "comments",
          data: comment,
        },
      });
    }

    setComment("");
  };

  return (
    <div className={classes.root}>
      <form onSubmit={handleSubmit}>
        <InputBase
          className={classes.margin}
          autoFocus
          placeholder="Add comment"
          label="Naked input"
          inputProps={{ "aria-label": "naked" }}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <IconButton type="submit" color="inherit" style={{ float: "right" }}>
          <SendRoundedIcon />
        </IconButton>
      </form>
    </div>
  );
};

export default AddComment;
