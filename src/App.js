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

function App() {
  useEffect(() => {
    navigator.serviceWorker.addEventListener("message", async (event) => {
      // Optional: ensure the message came from workbox-broadcast-update
      console.log(event);
      if (event.data.meta === "workbox-broadcast-update") {
        console.log("from workbox");
        const { cacheName, updatedUrl } = event.data.payload;
        console.log(cacheName);
        console.log(updatedUrl);
        // Do something with cacheName and updatedUrl.
        // For example, get the cached content and update
        // the content on the page.
        // const cache = await caches.open(cacheName);
        // const updatedResponse = await cache.match(updatedUrl);
        // const updatedText = await updatedResponse.text();
      }
    });
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
