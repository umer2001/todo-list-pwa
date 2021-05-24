import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MoreIcon from "@material-ui/icons/MoreVert";
import { fade, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import Navdrawer from "./Navdrawer";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: "block",
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function Appbar() {
  const classes = useStyles();
  const location = useLocation();
  const [isHome, setIsHome] = useState(false);
  const [title, setTitle] = useState("Home");
  const path = location.pathname;

  useEffect(() => {
    const path = location.pathname;
    if (
      path === "/" ||
      path === "/AddNew" ||
      path === "/TodoDetail" ||
      path === "commentContent" ||
      path === "/reminderContent"
    ) {
      setIsHome(true);
      setTitle("Home");
    } else {
      setIsHome(false);
      const titleWithOutSlash = location.pathname.replace("/", "");
      setTitle(
        titleWithOutSlash.charAt(0).toUpperCase() + titleWithOutSlash.slice(1)
      );
    }
  }, [location]);

  return !path.startsWith("/sign") ? (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Navdrawer isHome={isHome} />
          <Typography className={classes.title} variant="h6" noWrap>
            {title}
          </Typography>
          <IconButton aria-label="search" color="inherit">
            <SearchIcon />
          </IconButton>
          <IconButton
            aria-label="display more actions"
            edge="end"
            color="inherit"
          >
            <MoreIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  ) : (
    ""
  );
}
