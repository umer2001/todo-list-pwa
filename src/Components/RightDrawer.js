import React, { useContext } from "react";
import {
  GlobalDispatchContext,
  GlobalStateContext,
} from "../Context/GlobalContext";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ReminderContent from "./ReminderContent";
import CommentContent from "./CommentContent";
import { displayWhat, displayTime } from "../Context/helperFunctions";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: 360,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  toolbar: {
    minHeight: 40,
    alignItems: "flex-start",
    paddingTop: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
    padding: 7,
    display: "block",
    // alignSelf: "flex-end",
  },
  todo: {
    marginLeft: theme.spacing(9),
    display: "block",
    paddingLeft: 7,
    paddingRight: 7,
  },
  details: {
    marginLeft: theme.spacing(9),
    display: "flex",
    paddingLeft: 7,
    paddingRight: 7,
    paddingBottom: 7,
  },
  detailText: {
    paddingRight: 10,
  },
}));

export const DrawerContent = ({ type, id, todo, date }) => {
  const classes = useStyles();
  const dispatch = useContext(GlobalDispatchContext);
  return (
    <div className={classes.root}>
      <AppBar position="sticky">
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="close drawer"
            onClick={() =>
              dispatch({
                type: "CLOSE_RIGHT_DRAWER",
              })
            }
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography className={classes.title} variant="h5">
            {type === "commentContent"
              ? "Comments "
              : type === "reminderContent"
              ? "Reminders"
              : ""}
          </Typography>
        </Toolbar>
        <Typography className={classes.todo} variant="h6">
          {todo}
        </Typography>
        <div className={classes.details}>
          <Typography variant="caption" className={classes.detailText}>
            {`${displayWhat(date)} ${displayTime(date)}`}
          </Typography>
          <Typography variant="caption" className={classes.detailText}>
            Inbox
          </Typography>
        </div>
      </AppBar>
      {type === "commentContent" ? (
        <CommentContent id={id} />
      ) : type === "reminderContent" ? (
        <ReminderContent id={id} />
      ) : (
        ""
      )}
    </div>
  );
};

export const RightDrawer = () => {
  const {
    rightDrawer: { open, type, id },
    todos,
  } = useContext(GlobalStateContext);
  const dispatch = useContext(GlobalDispatchContext);
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() =>
        dispatch({
          type: "CLOSE_RIGHT_DRAWER",
        })
      }
    >
      <DrawerContent
        type={type}
        id={id}
        todo={todos[id] ? todos[id].todo : ""}
        date={todos[id] ? todos[id].date : ""}
      />
    </Drawer>
  );
};

export default RightDrawer;
