import React, { useContext } from "react";
import {
  makeStyles,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@material-ui/core";
import {
  GlobalDispatchContext,
  GlobalStateContext,
} from "../Context/GlobalContext";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { displayWhat, displayTime } from "../Context/helperFunctions";
import ReminderContent from "./ReminderContent";
import CommentContent from "./CommentContent";

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

export const DrawerContent = ({ type, uid, todo, date }) => {
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
        <CommentContent uid={uid} />
      ) : type === "reminderContent" ? (
        <ReminderContent uid={uid} />
      ) : (
        ""
      )}
    </div>
  );
};

export const RightDrawer = () => {
  const {
    rightDrawer: { open, type, uid },
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
        uid={uid}
        todo={todos[uid] ? todos[uid].todo : ""}
        date={todos[uid] ? todos[uid].date : ""}
      />
    </Drawer>
  );
};

export default RightDrawer;
