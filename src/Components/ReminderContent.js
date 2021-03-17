import React, { useContext } from "react";
import { GlobalStateContext } from "../Context/GlobalContext";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import MoreIcon from "@material-ui/icons/MoreVert";
import DateAndTime from "./DateAndTime";
import { displayTime } from "../Context/helperFunctions";

export const ReminderContent = ({ uid }) => {
  const { todos } = useContext(GlobalStateContext);
  const reminders = todos[uid].reminders;
  return (
    <>
      <List style={{ paddingBottom: "4em" }}>
        {reminders.map((reminder, index) => {
          const reminderObj = new Date(reminder);
          const month = reminderObj.toLocaleString("default", {
            month: "short",
          });
          const date = reminderObj.getDate();
          return (
            <ListItem key={index}>
              <ListItemAvatar>
                <Avatar>
                  <AccessTimeIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${month} ${date} ${displayTime(reminder)}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete">
                  <MoreIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
      <DateAndTime uid={uid} />
    </>
  );
};

export default ReminderContent;
