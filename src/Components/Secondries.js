import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import LocalLaundryServiceOutlinedIcon from "@material-ui/icons/LocalLaundryServiceOutlined";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "left",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },

  number: {
    display: "inline-block",
  },
}));

export const Secondries = ({ comments, date }) => {
  const displayWhat = (udate) => {
    const dateToday = new Date();
    const testDate = new Date(udate);
    if (
      testDate.getMonth() === dateToday.getMonth() &&
      testDate.getFullYear() === dateToday.getFullYear()
    ) {
      if (testDate.getDate() === dateToday.getDate()) {
        return "Today";
      } else if (testDate.getDate() === dateToday.getDate() - 1) {
        return "Yesterday";
      } else {
        return `${testDate.toLocaleString("default", {
          month: "short",
        })} ${testDate.getDate()}`;
      }
    } else {
      // jan 10
      return `${testDate.toLocaleString("default", {
        month: "short",
      })} ${testDate.getDate()}`;
    }
  };

  const classes = useStyles();
  return (
    <div className={classes.root}>
      {comments.length ? (
        <>
          <ChatBubbleOutlineIcon style={{ fontSize: 18 }} />
          <Typography className={classes.number}>{comments.length}</Typography>
        </>
      ) : (
        ""
      )}

      <Chip
        label={displayWhat(date)}
        icon={<LocalLaundryServiceOutlinedIcon />}
        size="small"
        variant="outlined"
      />
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
