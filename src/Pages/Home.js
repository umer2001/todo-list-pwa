import React from "react";
import AddTodoDrawer from "../Components/AddTodoDrawer";
import AddTodoButton from "../Components/Partials/AddTodoButton";
import PermissionDialog from "../Components/PermissionDialog";
import RightDrawer from "../Components/RightDrawer";
import Toast from "../Components/Toast";
import TodoDetailDrawer from "../Components/TodoDetailDrawer";
import TodoList from "../Components/TodoList";

const Home = () => {
  return (
    <>
      <TodoList />
      <AddTodoButton />
      <AddTodoDrawer />
      <RightDrawer />
      <TodoDetailDrawer />
      <Toast />
      <PermissionDialog />
    </>
  );
};

export default Home;
