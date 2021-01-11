import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import FlagOutlinedIcon from "@material-ui/icons/FlagOutlined";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
}));

export default function Priority() {
  const classes = useStyles();
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
          <ListItem button>
            <ListItemIcon>
              <FlagOutlinedIcon style={{ color: "#b71c1c" }} />
            </ListItemIcon>
            <ListItemText primary="Proirity 1" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <FlagOutlinedIcon style={{ color: "#ffd600" }} />
            </ListItemIcon>
            <ListItemText primary="Proirity 2" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <FlagOutlinedIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Proirity 3" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <FlagOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Proirity 4" />
          </ListItem>
        </List>
      </Popover>
    </>
  );
}
