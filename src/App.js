import React, { useEffect } from "react";
import Appbar from "./Components/Partials/Appbar";
import GlobalProvider from "./Context/GlobalContext";
import "./App.css";
import TodoList from "./Components/TodoList";
import AddTodoDrawer from "./Components/AddTodoDrawer";
import Toast from "./Components/Toast";
import RightDrawer from "./Components/RightDrawer";
import TodoDetailDrawer from "./Components/TodoDetailDrawer";
import AddTodoButton from "./Components/Partials/AddTodoButton";
import PermissionDialog from "./Components/PermissionDialog";
import { createScheduledNotification } from "./Context/helperFunctions";

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
              await registration.periodicSync.register("news", {
                minInterval: 60 * 1000, // 1 sec
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
    <div className="App">
      <Appbar />
      <GlobalProvider>
        <TodoList />
        <AddTodoButton />
        <AddTodoDrawer />
        <RightDrawer />
        <TodoDetailDrawer />
        <Toast />
        <PermissionDialog />
      </GlobalProvider>
    </div>
  );
}

export default App;
