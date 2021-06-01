import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  makeStyles,
  SwipeableDrawer,
  Container,
  Avatar,
  Typography,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@material-ui/core";
import {
  Home as HomeIcon,
  Menu as MenuIcon,
  ArrowBack as ArrowBackIcon,
  Settings as SettingsIcon,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  list: {
    width: 250,
  },
  profile: {
    backgroundColor: theme.palette.primary.main,
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
    color: theme.palette.primary.contrastText,
  },
}));

export default function Navdrawer({ isHome }) {
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

    if (isHome) {
      setIsOpen(!isOpen);
    } else {
      window.history.back();
    }
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
          {localStorage.getItem("name")}
        </Typography>
      </Container>
      <Divider />
      <List>
        <Link to="/" className="link">
          <ListItem button key="home">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
        </Link>
        <Link to="/setting" className="link">
          <ListItem button key="Settings">
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Setings" />
          </ListItem>
        </Link>
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
        {isHome ? <MenuIcon /> : <ArrowBackIcon />}
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
