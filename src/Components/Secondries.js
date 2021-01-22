import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
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

  number: {
    display: "inline-block",
  },
}));

export const Secondries = ({ date, numberOfComments, numberOfReminders }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Chip
        label={displayWhat(date)}
        icon={<LocalLaundryServiceOutlinedIcon />}
        size="small"
        variant="outlined"
      />
      {numberOfComments ? (
        <>
          <ChatBubbleOutlineIcon style={{ fontSize: 18 }} />
          <Typography className={classes.number}>{numberOfComments}</Typography>
        </>
      ) : (
        ""
      )}
      {numberOfReminders ? (
        <>
          <AccessAlarmRoundedIcon style={{ fontSize: 18 }} />
          <Typography className={classes.number}>
            {numberOfReminders}
          </Typography>
        </>
      ) : (
        ""
      )}
      <Chip
        label="Inbox"
        size="small"
        color="primary"
        variant="outlined"
        style={{ marginLeft: "auto" }}
      />
    </div>
  );
};
