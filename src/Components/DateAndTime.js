import React, { useState, useContext } from "react";
import { GlobalDispatchContext } from "../Context/GlobalContext";
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
    position: "fixed",
    bottom: 0,
    backgroundColor: theme.palette.background.paper,
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
  dateTime: {
    width: "40%",
    marginRight: theme.spacing(1),
  },

  inputLabel: {
    color: theme.palette.text.primary,
  },
}));

export const DateAndTime = ({ uid }) => {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState(null);
  const dispatch = useContext(GlobalDispatchContext);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedDate !== null) {
      if ("showTrigger" in Notification.prototype) {
        dispatch({
          type: "UPDATE_TODO",
          payload: {
            uid,
            property: "reminders",
            data: selectedDate,
          },
        });
      }

      dispatch({
        type: "SET_REMINDER",
        payload: {
          uid,
          data: selectedDate,
        },
      });
    }
    setSelectedDate(null);
  };

  return (
    <div className={classes.root}>
      <form onSubmit={handleSubmit}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            className={classes.dateTime}
            InputLabelProps={{ className: classes.inputLabel }}
            InputProps={{ disableUnderline: true }}
            margin="normal"
            id="date-picker-dialog"
            label="Pick date"
            disablePast={true}
            format="MM/dd/yyyy"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
          <KeyboardTimePicker
            className={classes.dateTime}
            InputLabelProps={{ className: classes.inputLabel }}
            InputProps={{ disableUnderline: true }}
            margin="normal"
            id="time-picker"
            label="Pick time"
            keyboardIcon={<AccessTimeIcon />}
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
          style={{ float: "right", marginTop: "24px" }}
        >
          <SendRoundedIcon />
        </IconButton>
      </form>
    </div>
  );
};

export default DateAndTime;
