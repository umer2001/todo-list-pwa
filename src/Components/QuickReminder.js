import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import AccessAlarmRoundedIcon from "@material-ui/icons/AccessAlarmRounded";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export const QuickReminder = ({ onReminder, numberOfReminders }) => {
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
