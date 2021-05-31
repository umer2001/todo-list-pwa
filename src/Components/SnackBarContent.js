import React, { forwardRef } from "react";
import { SnackbarContent } from "notistack";
import { makeStyles, Grid, Paper, Typography } from "@material-ui/core";
import Icon from "./Icon";

const useStyles = makeStyles((theme) => ({
  info: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.info.contrastText,
  },
  warning: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.contrastText,
  },
  error: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
  success: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
}));

const SnackBarContent = ({ id, message, variant = "info" }, ref) => {
  const classes = useStyles();
  return (
    <SnackbarContent ref={ref}>
      <Paper
        key={id}
        className={classes[variant]}
        style={{
          padding: "10px",
        }}
      >
        <Grid container spacing={1}>
          <Grid item>
            <Icon iconName={variant} />
          </Grid>
          <Grid item>
            <Typography variant="button" gutterBottom>
              {message}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </SnackbarContent>
  );
};

export default forwardRef(SnackBarContent);
