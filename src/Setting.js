import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import PaletteOutlinedIcon from "@material-ui/icons/PaletteOutlined";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  listItemText: {
    color: theme.palette.text.primary,
  },
}));

const Setting = () => {
  const classes = useStyles();
  return (
    <List>
      <Link to="/theme" className="link">
        <ListItem button key="theme">
          <ListItemIcon>
            <PaletteOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Theme" className={classes.listItemText} />
        </ListItem>
      </Link>
    </List>
  );
};

export default Setting;
