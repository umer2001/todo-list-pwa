import React, { useState, useContext } from "react";
import Quickcomment from "./Quickcomment";
import Priority from "./Priority";
import Button from "@material-ui/core/Button";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import {
  GlobalStateContext,
  GlobalDispatchContext,
} from "../Context/GlobalContext";
import Drawer from "@material-ui/core/Drawer";
import InputBase from "@material-ui/core/InputBase";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import IconButton from "@material-ui/core/IconButton";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import InboxOutlinedIcon from "@material-ui/icons/InboxOutlined";
import LocalLaundryServiceOutlinedIcon from "@material-ui/icons/LocalLaundryServiceOutlined";
import LocalOfferOutlinedIcon from "@material-ui/icons/LocalOfferOutlined";
import QuickReminder from "./QuickReminder";

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

export const AddTodoDrawer = () => {
  const classes = useStyles();
  const [todo, setTodo] = useState("");
  const [priority, setPriority] = useState("P4");
  const [comments, setComments] = useState([]);
  const [reminders, setReminders] = useState([]);

  const {
    bottomDrawer: { open, subTodo, id },
  } = useContext(GlobalStateContext);
  const dispatch = useContext(GlobalDispatchContext);

  const createTodo = () => {
    var newTodo = {
      todo,
      date: new Date(),
      priority,
      reminders,
      comments,
      subtodos: [],
      _id: Math.random(),
    };
    if (subTodo) {
      newTodo.status = true;
      dispatch({
        type: "ADD_SUB_TODO",
        payload: {
          newTodo,
          parentId: id,
        },
      });
    } else {
      newTodo.status = false;
      dispatch({
        type: "ADD_TODO",
        payload: newTodo,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (todo !== "") {
      createTodo();
    }
    dispatch({ type: "CLOSE_BOTTOM_DRAWER" });
  };

  const todoform = (anchor) => (
    <ClickAwayListener
      onClickAway={() => dispatch({ type: "CLOSE_BOTTOM_DRAWER" })}
    >
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
              priority={priority}
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
      <Drawer
        anchor="bottom"
        open={open}
        // onClose={toggleDrawer("bottom", false)}
      >
        {todoform("bottom")}
      </Drawer>
    </>
  );
};

export default AddTodoDrawer;
