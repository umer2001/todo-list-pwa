import React, { useState } from "react";
import Popover from "@material-ui/core/Popover";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import FlagIcon from "@material-ui/icons/Flag";
import IconButton from "@material-ui/core/IconButton";

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
