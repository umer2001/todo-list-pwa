import React, { useState, useContext, useRef, useEffect } from "react";
import { GlobalStateContext } from "../Context/GlobalContext";
import useLongPress from "../Hooks/useLongPress";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import AddComment from "./AddComment";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  comment: {
    width: "fit-content",
    backgroundColor: "#e8e7ec",
    padding: "12px",
    borderRadius: "30px",
  },
  list: {
    paddingBottom: "4em",
  },
}));

export const CommentContent = ({ id }) => {
  const classes = useStyles();
  const { todos } = useContext(GlobalStateContext);
  const comments = todos[id].comments;
  const lastComment = useRef(null);
  const [isdeleteDialogOpen, setIsdeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (lastComment.current !== null) {
      lastComment.current.scrollIntoView();
    }
  }, []);

  const onLongPress = (e) => {
    console.log(e);
    setIsdeleteDialogOpen(true);
  };

  const onClick = () => {
    console.log("click is triggered");
  };

  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 500,
  };
  const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);
  return (
    <>
      <List className={classes.list}>
        {comments.map((comment, index) => (
          <ListItem
            key={index}
            ref={index === comments.length - 1 ? lastComment : null}
          >
            <p {...longPressEvent} className={classes.comment}>
              {comment}
            </p>
          </ListItem>
        ))}
      </List>
      <AddComment id={id} />
      <Dialog
        open={isdeleteDialogOpen}
        onClose={() => setIsdeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Comment"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to delete this comment ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsdeleteDialogOpen(false)} color="primary">
            Yes
          </Button>
          <Button
            onClick={() => setIsdeleteDialogOpen(false)}
            color="primary"
            autoFocus
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CommentContent;
