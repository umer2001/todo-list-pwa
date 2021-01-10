import React from "react";
import Grid from "@material-ui/core/Grid";
import empty from "../Images/empty.svg";

export const Empty = () => {
  return (
    <Grid container className="container">
      <Grid item className="grid-item">
        <img src={empty} className="empty-img" alt="..." />
        <h2>You're all done for today!</h2>
        <h2>#TodoitZero</h2>
      </Grid>
    </Grid>
  );
};

export default Empty;
