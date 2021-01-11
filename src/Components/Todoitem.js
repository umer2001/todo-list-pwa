import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import CircleCheckedFilled from "@material-ui/icons/CheckCircle";
import CircleUnchecked from "@material-ui/icons/RadioButtonUnchecked";
import { Secondries } from "./Secondries";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

export const Todoitem = () => {
  const classes = useStyles();
  return (
    <List width="100%" className={classes.root}>
      <ListItem>
        <Checkbox
          icon={<CircleUnchecked />}
          checkedIcon={<CircleCheckedFilled />}
        />
        <ListItemText
          disableTypography
          primary="Photos"
          secondary={<Secondries />}
        />
      </ListItem>
    </List>
  );
};
