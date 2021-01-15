import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import IconButton from "@material-ui/core/IconButton";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import AccessTimeIcon from "@material-ui/icons/AccessTime";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    bottom: 0,
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
  dateTime: {
    width: "40%",
    marginRight: theme.spacing(1),
  },
}));

export const DateAndTime = () => {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState(
    // new Date("2014-08-18T21:11:54")
    null
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div className={classes.root}>
      <form onSubmit={handleSubmit}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            className={classes.dateTime}
            margin="normal"
            id="date-picker-dialog"
            label="Pick date"
            disablePast={true}
            InputProps={{ disableUnderline: true }}
            format="MM/dd/yyyy"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
          <KeyboardTimePicker
            className={classes.dateTime}
            margin="normal"
            id="time-picker"
            label="Pick time"
            keyboardIcon={<AccessTimeIcon />}
            InputProps={{ disableUnderline: true }}
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change time",
            }}
          />
        </MuiPickersUtilsProvider>
        <IconButton
          type="submit"
          color="inherit"
          style={{ float: "right", marginTop: "20px" }}
        >
          <SendRoundedIcon />
        </IconButton>
      </form>
    </div>
  );
};

export default DateAndTime;
