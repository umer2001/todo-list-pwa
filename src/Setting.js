import React from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import PaletteOutlinedIcon from "@material-ui/icons/PaletteOutlined";
import { Link } from "react-router-dom";

const Setting = () => {
  return (
    <List>
      <Link to="/theme" className="link">
        <ListItem button key="theme">
          <ListItemIcon>
            <PaletteOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Theme" />
        </ListItem>
      </Link>
    </List>
  );
};

export default Setting;
