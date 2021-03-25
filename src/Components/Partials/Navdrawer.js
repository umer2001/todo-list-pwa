import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import SettingsIcon from "@material-ui/icons/Settings";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  profile: {
    backgroundColor: "#3f51b5",
    minHeight: 80,
    display: "flex",
    justifyContent: "left",
    alignItems: "center",
  },
  avatar: {
    display: "inline-flex",
    marginRight: 7,
  },
  userName: {
    display: "inline",
    color: "#fff",
  },
});

export default function Navdrawer() {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setIsOpen(!isOpen);
  };

  const list = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      <Container className={classes.profile}>
        <Avatar
          alt="Remy Sharp"
          src="/broken-image.jpg"
          className={classes.avatar}
        >
          R
        </Avatar>
        <Typography variant="h6" className={classes.userName}>
          Raheel Khan
        </Typography>
      </Container>
      <Divider />
      <List>
        <ListItem button key="Settings">
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Setings" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="open drawer"
        onClick={toggleDrawer}
      >
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer
        anchor={"left"}
        open={isOpen}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
      >
        {list()}
      </SwipeableDrawer>
    </>
  );
}
