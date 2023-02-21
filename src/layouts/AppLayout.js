import { useContext } from "react";
import { GlobalStateContext } from "../Context/GlobalContext";
import Themes from "../themes.json";
import { Outlet } from "react-router-dom";
import { createTheme, makeStyles } from "@material-ui/core";
import Appbar from "../Components/Partials/Appbar";

export default function AppLayout() {
  const { theme } = useContext(GlobalStateContext);
  const currentTheme = createTheme(Themes[theme]);

  const useStyles = makeStyles((theme) => ({
    bg: {
      minHeight: "100vh",
      backgroundColor: currentTheme.palette.background.paper,
    },
  }));

  const classes = useStyles();

  return (
    <div className={classes.bg}>
      <Appbar />
      <Outlet />
    </div>
  );
}
