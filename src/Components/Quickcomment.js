import React, { useState } from "react";
import {
  makeStyles,
  Button,
  IconButton,
  Badge,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";

const useStyles = makeStyles((theme) => ({
  inputLabel: {
    color: theme.palette.text.primary,
    "&.Mui-focused": {
      color: theme.palette.text.primary,
    },
  },
}));

export default function Quickcomment({ onComment, numberOfComments }) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onComment(comment);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClickOpen}>
        <Badge color="primary" badgeContent={numberOfComments}>
          <ChatBubbleOutlineIcon />
        </Badge>
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Quick comment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            you can add some comment or description about your todo..
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Comment"
            type="email"
            fullWidth
            InputLabelProps={{ className: classes.inputLabel }}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
