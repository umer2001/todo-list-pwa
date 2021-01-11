import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import Chip from "@material-ui/core/Chip";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import LocalLaundryServiceOutlinedIcon from "@material-ui/icons/LocalLaundryServiceOutlined";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },

  InputBase: {
    color: "#000",
  },
  todoform: {
    padding: "20px 20px 5px 20px",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export const Addtodo = () => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
  };

  const todoform = (anchor) => (
    <div
      className={clsx(classes.todoform, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <InputBase
        className={classes.margin}
        fullWidth
        placeholder="Placeholder"
        label="Naked input"
        inputProps={{ "aria-label": "naked" }}
      />
      <div>
        <ChatBubbleOutlineIcon />
        <Chip
          label="yesterday"
          icon={<LocalLaundryServiceOutlinedIcon />}
          size="small"
          variant="outlined"
        />
        <IconButton
          color="inherit"
          style={{ float: "right" }}
          onClick={() => setIsOpen(false)}
        >
          <SendRoundedIcon />
        </IconButton>
      </div>
    </div>
  );

  return (
    <>
      <Fab
        color="primary"
        aria-label="add"
        className="fab"
        onClick={() => setIsOpen(true)}
      >
        <AddIcon />
      </Fab>
      <Drawer
        anchor={"bottom"}
        open={isOpen}
        // onClose={toggleDrawer("bottom", false)}
      >
        {todoform("bottom")}
      </Drawer>
    </>
  );
};

export default Addtodo;
