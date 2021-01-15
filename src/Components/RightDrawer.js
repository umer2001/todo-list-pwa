import React, { useState } from "react";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ReminderContent from "./ReminderContent";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: 360,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  toolbar: {
    minHeight: 40,
    alignItems: "flex-start",
    paddingTop: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
    padding: 7,
    display: "block",
    // alignSelf: "flex-end",
  },
  todo: {
    marginLeft: theme.spacing(9),
    display: "block",
    paddingLeft: 7,
    paddingRight: 7,
  },
  details: {
    marginLeft: theme.spacing(9),
    display: "flex",
    paddingLeft: 7,
    paddingRight: 7,
    paddingBottom: 7,
  },
  detailText: {
    paddingRight: 10,
  },
}));

export const DrawerContent = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="close drawer"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography className={classes.title} variant="h5">
            Reminder
          </Typography>
        </Toolbar>
        <Typography className={classes.todo} variant="h6">
          hig !!
        </Typography>
        <div className={classes.details}>
          <Typography variant="captions" className={classes.detailText}>
            Today 3:24PM
          </Typography>
          <Typography variant="captions" className={classes.detailText}>
            Inbox
          </Typography>
        </div>
      </AppBar>
      {/* TODO: display remainderContent or CommentContent */}
      <ReminderContent />
    </div>
  );
};

export const RightDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>LEFT</Button>
      <Drawer anchor="right" open={isOpen} onClose={() => setIsOpen(false)}>
        <DrawerContent />
      </Drawer>
    </>
  );
};

export default RightDrawer;
