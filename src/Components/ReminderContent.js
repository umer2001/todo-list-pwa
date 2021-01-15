import React from "react";
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

export const ReminderContent = () => {
  return (
    <>
      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <AccessTimeIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Thursday 9:00AM" />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="delete">
              <MoreIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <DateAndTime />
    </>
  );
};

export default ReminderContent;
