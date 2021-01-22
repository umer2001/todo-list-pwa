import React, { useState, useContext } from "react";
import Quickcomment from "../Quickcomment";
import Priority from "../Priority";
import Button from "@material-ui/core/Button";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { GlobalDispatchContext } from "../../Context/GlobalContext";
import Drawer from "@material-ui/core/Drawer";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import InputBase from "@material-ui/core/InputBase";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import IconButton from "@material-ui/core/IconButton";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import InboxOutlinedIcon from "@material-ui/icons/InboxOutlined";
import LocalLaundryServiceOutlinedIcon from "@material-ui/icons/LocalLaundryServiceOutlined";
import LocalOfferOutlinedIcon from "@material-ui/icons/LocalOfferOutlined";
import QuickReminder from "../QuickReminder";

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
  const [todo, setTodo] = useState("");
  const [priority, setPriority] = useState("P4");
  const [comments, setComments] = useState([]);
  const [reminders, setReminders] = useState([]);

  const dispatch = useContext(GlobalDispatchContext);

  const createTodo = () => {
    dispatch({
      type: "ADD_TODO",
      payload: {
        todo,
        date: new Date(),
        priority,
        reminders,
        comments,
        _id: Math.random(),
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createTodo();
    setIsOpen(false);
  };

  const todoform = (anchor) => (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <div
        className={clsx(classes.todoform, {
          [classes.fullList]: anchor === "top" || anchor === "bottom",
        })}
        role="presentation"
      >
        <form onSubmit={handleSubmit}>
          <InputBase
            fullWidth
            autoFocus
            placeholder="Placeholder"
            label="Naked input"
            inputProps={{ "aria-label": "naked" }}
            onChange={(e) => setTodo(e.target.value)}
          />
          <Button
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<LocalLaundryServiceOutlinedIcon />}
          >
            Today
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            startIcon={<InboxOutlinedIcon />}
          >
            Inbox
          </Button>
          <div>
            <IconButton color="inherit">
              <LocalOfferOutlinedIcon />
            </IconButton>
            <Priority
              onPrioritySelection={(priorityType) => setPriority(priorityType)}
            />
            <QuickReminder
              onReminder={(reminder) => setReminders([...reminders, reminder])}
            />
            <Quickcomment
              onComment={(comment) => setComments([...comments, comment])}
            />
            <IconButton
              type="submit"
              color="inherit"
              style={{ float: "right" }}
            >
              <SendRoundedIcon />
            </IconButton>
          </div>
        </form>
      </div>
    </ClickAwayListener>
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
