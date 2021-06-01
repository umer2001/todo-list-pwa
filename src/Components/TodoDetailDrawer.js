import React, { useContext } from "react";
import {
  makeStyles,
  Drawer,
  Button,
  Typography,
  Badge,
  List,
  Divider,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@material-ui/core";
import {
  ChatBubbleOutline,
  MoreVert,
  LocalLaundryServiceOutlined,
  AccessAlarmRounded,
  LocalOfferOutlined,
  FilterListRounded,
  Add,
  FiberManualRecord,
} from "@material-ui/icons";
import {
  GlobalDispatchContext,
  GlobalStateContext,
} from "../Context/GlobalContext";
import { displayWhat } from "../Context/helperFunctions";
import Priority from "./Priority";
import TodoCheckbox from "./TodoCheckbox";

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
  add: {
    margin: theme.spacing(0, 1),
  },
  catHead: {
    display: "flex",
    alignItems: "center",
  },
  point: {
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
  date,
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
        <FiberManualRecord className={classes.point} />
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
        color="secondary"
        start={<LocalLaundryServiceOutlined />}
      >
        {displayWhat(date)}
      </Button>
      <div className={classes.dateAndSecondries}>
        <Button color="inherit">
          <LocalOfferOutlined />
        </Button>
        <Priority
          priority={priority}
          onPrioritySelection={(priorityType) =>
            dispatch({
              type: "UPDATE_TODO",
              payload: {
                uid,
                property: "priority",
                data: priorityType,
              },
            })
          }
        />
        <Button
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
            <AccessAlarmRounded />
          </Badge>
        </Button>

        <Button
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
            <ChatBubbleOutline />
          </Badge>
        </Button>

        <Button type="submit" color="inherit" style={{ float: "right" }}>
          <MoreVert />
        </Button>
      </div>
      <hr className="divider" />
      <div className={classes.subTaskHead}>
        <FilterListRounded style={{ margin: "0px 10px" }} />
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
          <Add className={classes.add} />
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
          date={todos[uid].date}
          uid={uid}
        />
      ) : (
        "unknown item"
      )}
    </Drawer>
  );
};

export default TodoDetailDrawer;
