import React from "react";
import { makeStyles, Chip, Typography } from "@material-ui/core";
import {
  FilterListRounded,
  ChatBubbleOutline,
  AccessAlarmRounded,
  LocalLaundryServiceOutlined,
} from "@material-ui/icons";

import { displayWhat } from "../Context/helperFunctions";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "left",
    alignItems: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },

  icon: {
    color: theme.palette.text.primary,
    fontSize: 18,
  },

  number: {
    display: "inline-block",
  },
}));

export const Secondries = ({
  date,
  numberOfSubTodos,
  numberOfComments,
  numberOfReminders,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Chip
        color="secondary"
        label={displayWhat(date)}
        icon={<LocalLaundryServiceOutlined />}
        size="small"
        variant="outlined"
      />
      {numberOfSubTodos ? (
        <>
          <FilterListRounded className={classes.icon} />
          <Typography color="textPrimary" className={classes.number}>
            {numberOfSubTodos}
          </Typography>
        </>
      ) : (
        ""
      )}
      {numberOfComments ? (
        <>
          <ChatBubbleOutline className={classes.icon} />
          <Typography color="textPrimary" className={classes.number}>
            {numberOfComments}
          </Typography>
        </>
      ) : (
        ""
      )}
      {numberOfReminders ? (
        <>
          <AccessAlarmRounded className={classes.icon} />
          <Typography color="textPrimary" className={classes.number}>
            {numberOfReminders}
          </Typography>
        </>
      ) : (
        ""
      )}
      <Chip
        label="Inbox"
        size="small"
        color="default"
        variant="outlined"
        style={{ marginLeft: "auto" }}
      />
    </div>
  );
};
