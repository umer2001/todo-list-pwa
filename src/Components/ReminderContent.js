import React, { useContext } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Avatar,
  IconButton,
} from "@material-ui/core";
import { GlobalStateContext } from "../Context/GlobalContext";
import { AccessTime, MoreVert } from "@material-ui/icons";
import { displayTime } from "../Context/helperFunctions";
import DateAndTime from "./DateAndTime";

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
                  <AccessTime />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${month} ${date} ${displayTime(reminder)}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete">
                  <MoreVert />
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
