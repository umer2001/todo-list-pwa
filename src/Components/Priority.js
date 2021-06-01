import React, { useState } from "react";
import {
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@material-ui/core";
import FlagIcon from "@material-ui/icons/Flag";

export default function Priority({ onPrioritySelection, priority }) {
  const priorities = {
    P1: {
      name: "P1",
      color: "#b71c1c",
    },
    P2: {
      name: "P2",
      color: "#ffd600",
    },
    P3: {
      name: "P3",
      color: "blue",
    },
    P4: {
      name: "P4",
      color: "inherit",
    },
  };
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <IconButton onClick={handleClick}>
        <FlagIcon
          style={{
            color: priorities[priority].color,
          }}
        />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <List>
          {Object.keys(priorities).map((priority, index) => (
            <ListItem
              key={index}
              button
              onClick={() => {
                onPrioritySelection(priorities[priority].name);
                handleClose();
              }}
            >
              <ListItemIcon>
                <FlagIcon style={{ color: priorities[priority].color }} />
              </ListItemIcon>
              <ListItemText primary={`Proirity ${index + 1}`} />
            </ListItem>
          ))}
        </List>
      </Popover>
    </>
  );
}
