import React, { useState, useEffect, useContext } from "react";
import {
  Redirect,
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import { makeStyles, createMuiTheme, ThemeProvider } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import "./App.css";
import { createScheduledNotification } from "./Context/helperFunctions";
import {
  GlobalStateContext,
  GlobalDispatchContext,
} from "./Context/GlobalContext";
import Appbar from "./Components/Partials/Appbar";
import Home from "./Pages/Home";
import Setting from "./Pages/Setting";
import Theme from "./Pages/Theme";
import Themes from "./themes";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";

function App() {
  const [redirect, setRedirect] = useState(false);
  const { theme } = useContext(GlobalStateContext);
  const dispatch = useContext(GlobalDispatchContext);
  const currentTheme = createMuiTheme(Themes[theme]);

  const useStyles = makeStyles((theme) => ({
    bg: {
      minHeight: "100vh",
      backgroundColor: currentTheme.palette.background.paper,
    },
  }));

  const classes = useStyles();

  useEffect(() => {
    async function registerPeriodicSync() {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        // Check if periodicSync is supported
        if ("periodicSync" in registration) {
          // Request permission
          const status = await navigator.permissions.query({
            name: "periodic-background-sync",
          });
          if (status.state === "granted") {
            try {
              // Register new sync every 24 hours
              await registration.periodicSync.register("todos", {
                minInterval: 24 * 60 * 60 * 1000, // 1 day
              });
              console.log("Periodic background sync registered!");
            } catch (e) {
              console.error(`Periodic background sync failed:\n${e}`);
            }
          }
        }
      }
    }
    // retriving theme from localStorage
    const themeLocalStorage = localStorage.getItem("theme");
    if (
      themeLocalStorage &&
      themeLocalStorage !== "default" &&
      themeLocalStorage !== "null"
    ) {
      dispatch({
        type: "CHANGE_THEME",
        payload: themeLocalStorage,
      });
    }

    // checking if user is logged in
    if (!localStorage.getItem("token")) {
      console.error("No Token (not logged in...)");
      setRedirect(true);
    } else {
      if (navigator.serviceWorker) {
        navigator.serviceWorker.addEventListener("message", async (event) => {
          // Optional: ensure the message came from workbox-broadcast-update
          if (event.data.meta === "workbox-broadcast-update") {
            async function sheduleReminders(cacheName, updatedURL) {
              console.log(cacheName);
              console.log(updatedURL);

              // Do something with cacheName and updatedURL.
              // For example, get the cached content and update
              // the content on the page.
              const cache = await caches.open(cacheName);
              const updatedResponse = await cache.match(updatedURL);
              const todos = JSON.parse(await updatedResponse.text());
              // get sheduled notifications
              console.log(todos);

              // setting reminders
              Object.keys(todos).forEach((todo) => {
                const { uid, todo: title } = todos[todo];
                todos[todo].reminders.forEach((reminder) => {
                  if (new Date(reminder) > new Date()) {
                    createScheduledNotification(uid, title, reminder);
                  }
                });
              });
            }
            const { cacheName, updatedURL } = event.data.payload;
            sheduleReminders(cacheName, updatedURL);
          }
        });
      }
      registerPeriodicSync();
    }
  }, [dispatch]);
  return (
    <ThemeProvider theme={currentTheme}>
      <SnackbarProvider
        anchorOrigin={{ horizontal: "left", vertical: "top" }}
        autoHideDuration={1200}
      >
        <Router>
          {redirect ? <Redirect push to="/sign-in" /> : ""}
          <div className={classes.bg}>
            <Appbar />
            <Switch>
              <Route path="/sign-up" exect component={SignUp} />
              <Route path="/sign-in" exect component={SignIn} />
              <Route path="/setting" exect component={Setting} />
              <Route path="/theme" exect component={Theme} />
              <Route path="/" component={Home} />
            </Switch>
          </div>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
