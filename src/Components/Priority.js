import React, { useState } from "react";
import Popover from "@material-ui/core/Popover";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import FlagOutlinedIcon from "@material-ui/icons/FlagOutlined";
import IconButton from "@material-ui/core/IconButton";

export default function Priority({ onPrioritySelection }) {
  const priorities = [
    {
      name: "P1",
      color: "#b71c1c",
    },
    {
      name: "P2",
      color: "#ffd600",
    },
    {
      name: "P3",
      color: "blue",
    },
    {
      name: "P4",
      color: "inherit",
    },
  ];
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
      <IconButton color="inherit" onClick={handleClick}>
        <FlagOutlinedIcon />
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
          {priorities.map((priority, index) => (
            <ListItem
              button
              onClick={() => {
                onPrioritySelection(priority.name);
                handleClose();
              }}
            >
              <ListItemIcon>
                <FlagOutlinedIcon style={{ color: priority.color }} />
              </ListItemIcon>
              <ListItemText primary={`Proirity ${index + 1}`} />
            </ListItem>
          ))}
        </List>
      </Popover>
    </>
  );
}
