import React from "react";
import {
  Paper,
  Radio,
  Typography,
  makeStyles,
  ButtonBase,
} from "@material-ui/core";
import Dummy from "../Images/pera-dummy.svg";

const ThemeCard = ({ onClick, themeName, selected, themePalette }) => {
  const useStyles = makeStyles({
    clickEffect: {
      width: "100%",
    },
    themeBox: {
      height: 130,
      width: "95%",
      margin: "20px auto 20px",
      borderRadius: 10,
      overflow: "hidden",
      backgroundColor: themePalette.palette.background.paper,
    },
    themeHead: {
      height: 60,
      display: "flex",
      alignItems: "center",
      padding: "0px 10px",
      backgroundColor: themePalette.palette.primary.main,
      color: "#ffffff",
    },
    themeBody: {
      height: 65,
      display: "flex",
      alignItems: "center",
      padding: "0px 10px",
    },
  });

  const classes = useStyles();

  return (
    <ButtonBase onClick={() => onClick()} className={classes.clickEffect}>
      <Paper elevation={2} className={classes.themeBox}>
        <div className={classes.themeHead}>
          <Typography variant="h6">{themeName}</Typography>
        </div>
        <div className={classes.themeBody}>
          <Radio
            checked={selected}
            value="a"
            name="radio-button-demo"
            inputProps={{ "aria-label": "A" }}
          />
          <img src={Dummy} className="pera-dummy" />
        </div>
      </Paper>
    </ButtonBase>
  );
};

export default ThemeCard;
