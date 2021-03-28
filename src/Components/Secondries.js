import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import FilterListRoundedIcon from "@material-ui/icons/FilterListRounded";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import AccessAlarmRoundedIcon from "@material-ui/icons/AccessAlarmRounded";
import LocalLaundryServiceOutlinedIcon from "@material-ui/icons/LocalLaundryServiceOutlined";
import Typography from "@material-ui/core/Typography";
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
        icon={<LocalLaundryServiceOutlinedIcon />}
        size="small"
        variant="outlined"
      />
      {numberOfSubTodos ? (
        <>
          <FilterListRoundedIcon color="textPrimary" className={classes.icon} />
          <Typography color="textPrimary" className={classes.number}>
            {numberOfSubTodos}
          </Typography>
        </>
      ) : (
        ""
      )}
      {numberOfComments ? (
        <>
          <ChatBubbleOutlineIcon color="textPrimary" className={classes.icon} />
          <Typography color="textPrimary" className={classes.number}>
            {numberOfComments}
          </Typography>
        </>
      ) : (
        ""
      )}
      {numberOfReminders ? (
        <>
          <AccessAlarmRoundedIcon
            color="textPrimary"
            className={classes.icon}
          />
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
