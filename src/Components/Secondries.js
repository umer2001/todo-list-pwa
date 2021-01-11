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

export const Secondries = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ChatBubbleOutlineIcon style={{ fontSize: 15 }} />
      <Typography className={classes.number}>1</Typography>
      <Chip
        label="yesterday"
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
