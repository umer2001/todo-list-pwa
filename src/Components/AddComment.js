import React from "react";
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

export const AddComment = () => {
  const classes = useStyles();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div className={classes.root}>
      <form onSubmit={handleSubmit}>
        <InputBase
          className={classes.margin}
          autoFocus
          placeholder="Placeholder"
          label="Naked input"
          inputProps={{ "aria-label": "naked" }}
          //   onChange={(e) => setTodo(e.target.value)}
        />
        <IconButton type="submit" color="inherit" style={{ float: "right" }}>
          <SendRoundedIcon />
        </IconButton>
      </form>
    </div>
  );
};

export default AddComment;
