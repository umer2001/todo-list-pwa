import React, { useContext } from "react";
import {
  GlobalDispatchContext,
  GlobalStateContext,
} from "../Context/GlobalContext";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import Priority from "./Priority";
import TodoCheckbox from "./TodoCheckbox";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import LocalLaundryServiceOutlinedIcon from "@material-ui/icons/LocalLaundryServiceOutlined";
import AccessAlarmRoundedIcon from "@material-ui/icons/AccessAlarmRounded";
import LocalOfferOutlinedIcon from "@material-ui/icons/LocalOfferOutlined";
import FilterListRoundedIcon from "@material-ui/icons/FilterListRounded";
import AddIcon from "@material-ui/icons/Add";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
  },
  subTaskHead: {
    display: "flex",
    alignItems: "center",
  },
  listItem: {
    marginLeft: "60px",
    width: "auto",
  },
  addIcon: {
    margin: theme.spacing(0, 1),
  },
  catHead: {
    display: "flex",
    alignItems: "center",
  },
  pointIcon: {
    padding: "0px 5px 0px 12px",
    color: "#d7d8dc",
    fontSize: "0.85rem",
  },
  dateAndSecondries: {
    marginLeft: theme.spacing(6),
  },
}));

export const Details = ({
  todo,
  uid,
  priority,
  numberOfComments,
  numberOfReminders,
  subTodos,
}) => {
  const classes = useStyles();
  const { todos } = useContext(GlobalStateContext);
  const dispatch = useContext(GlobalDispatchContext);

  return (
    <div className={classes.root}>
      <Typography variant="subtitle1" gutterBottom className={classes.catHead}>
        <FiberManualRecordIcon className={classes.pointIcon} />
        hello jani
      </Typography>
      <Typography variant="h5" gutterBottom>
        <TodoCheckbox uid={uid} priority={priority} todo={{ uid }} />
        {todo}
      </Typography>
      <Button
        className={classes.dateAndSecondries}
        size="small"
        variant="outlined"
        color="primary"
        startIcon={<LocalLaundryServiceOutlinedIcon />}
      >
        Today
      </Button>
      <div className={classes.dateAndSecondries}>
        <IconButton color="inherit">
          <LocalOfferOutlinedIcon />
        </IconButton>
        <Priority
          priority={priority}
          //   onPrioritySelection={(priorityType) => setPriority(priorityType)}
        />
        <IconButton
          color="inherit"
          onClick={() =>
            dispatch({
              type: "OPEN_RIGHT_DRAWER",
              payload: {
                type: "reminderContent",
                uid,
              },
            })
          }
        >
          <Badge color="primary" badgeContent={numberOfReminders}>
            <AccessAlarmRoundedIcon />
          </Badge>
        </IconButton>

        <IconButton
          color="inherit"
          onClick={() =>
            dispatch({
              type: "OPEN_RIGHT_DRAWER",
              payload: {
                type: "commentContent",
                uid,
              },
            })
          }
        >
          <Badge color="primary" badgeContent={numberOfComments}>
            <ChatBubbleOutlineIcon />
          </Badge>
        </IconButton>

        <IconButton type="submit" color="inherit" style={{ float: "right" }}>
          <MoreVertIcon />
        </IconButton>
      </div>
      <hr />
      <div className={classes.subTaskHead}>
        <FilterListRoundedIcon style={{ margin: "0px 10px" }} />
        <h4>Sub-tasks</h4>
      </div>
      <List className={classes.subTaskList}>
        {subTodos.map((todo) => {
          return todos[todo.uid] !== undefined ? (
            <ListItem
              button
              divider
              key={todo.uid}
              className={classes.listItem}
              onClick={() =>
                dispatch({
                  type: "OPEN_TODO_DETAIL",
                  payload: todo.uid,
                })
              }
            >
              <ListItemText
                disableTypography
                style={{ marginLeft: "50px" }}
                primary={todos[todo.uid].todo}
              />
              <ListItemSecondaryAction
                style={{ width: "min-content", left: "75px" }}
              >
                <TodoCheckbox
                  uid={todos[todo.uid].uid}
                  parentId={uid}
                  todo={todos[todo.uid]}
                  priority={todos[todo.uid].priority}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ) : (
            ""
          );
        })}
        <Divider variant="inset" component="li" />
        <ListItem
          button
          component="li"
          className={classes.listItem}
          onClick={() => dispatch({ type: "OPEN_BOTTOM_DRAWER", payload: uid })}
        >
          <AddIcon className={classes.addIcon} />
          <ListItemText primary="Add sub-task" />
        </ListItem>
      </List>
    </div>
  );
};

export const TodoDetailDrawer = () => {
  const {
    todoDetailDrawer: { open, uid },
    todos,
  } = useContext(GlobalStateContext);
  const dispatch = useContext(GlobalDispatchContext);

  const closeTodoDetailDrawer = () => {
    dispatch({
      type: "CLOSE_TODO_DETAIL",
    });
    dispatch({
      type: "UPDATE_TODO",
      payload: todos[uid],
    });
  };
  return (
    <Drawer anchor="bottom" open={open} onClose={closeTodoDetailDrawer}>
      {uid !== null ? (
        <Details
          todo={todos[uid].todo}
          priority={todos[uid].priority}
          numberOfComments={todos[uid].comments.length}
          numberOfReminders={todos[uid].reminders.length}
          subTodos={todos[uid].subtodos}
          uid={uid}
        />
      ) : (
        "unknown item"
      )}
    </Drawer>
  );
};

export default TodoDetailDrawer;
