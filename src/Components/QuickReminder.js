import React, { useState } from "react";
import {
  makeStyles,
  Button,
  IconButton,
  Badge,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import AccessAlarmRoundedIcon from "@material-ui/icons/AccessAlarmRounded";
import DateFnsUtils from "@date-io/date-fns";

const useStyles = makeStyles((theme) => ({
  inputLabel: {
    color: theme.palette.text.primary,
    "&.Mui-focused": {
      color: theme.palette.text.primary,
    },
  },
}));

export const QuickReminder = ({ onReminder, numberOfReminders }) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [reminder, setReminder] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleDateChange = (dateAndTime) => {
    setReminder(dateAndTime);
  };

  const handleClose = () => {
    setOpen(false);
    onReminder(reminder);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClickOpen}>
        <Badge color="primary" badgeContent={numberOfReminders}>
          <AccessAlarmRoundedIcon />
        </Badge>
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Quick reminder</DialogTitle>
        <DialogContent>
          <DialogContentText>
            you can add reminder about your todo..
          </DialogContentText>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              InputLabelProps={{ className: classes.inputLabel }}
              margin="normal"
              id="date-picker-dialog"
              label="Pick Date"
              format="MM/dd/yyyy"
              disablePast
              value={reminder}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
            <KeyboardTimePicker
              InputLabelProps={{ className: classes.inputLabel }}
              margin="normal"
              id="time-picker"
              label="Pick Time"
              value={reminder}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change time",
              }}
            />
          </MuiPickersUtilsProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default QuickReminder;
