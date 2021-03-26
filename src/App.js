import React, { useEffect } from "react";
import Appbar from "./Components/Partials/Appbar";
import GlobalProvider from "./Context/GlobalContext";
import "./App.css";
import { createScheduledNotification } from "./Context/helperFunctions";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Home";
import Setting from "./Setting";
import Theme from "./Theme";

function App() {
  useEffect(() => {
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
    registerPeriodicSync();
  }, []);
  return (
    <GlobalProvider>
      <Router>
        <div className="App">
          <Appbar />
          <Switch>
            <Route path="/setting" exect component={Setting} />
            <Route path="/theme" exect component={Theme} />
            <Route path="/" component={Home} />
          </Switch>
        </div>
      </Router>
    </GlobalProvider>
  );
}

export default App;
