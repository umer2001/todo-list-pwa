import React from "react";
import { Navigate } from "react-router-dom";

const withAuthenticationRequired = (ComposedComponent) => {
  if (localStorage.getItem("token")) {
    return <ComposedComponent />;
  }
  return <Navigate to={"/sign-in"} />;
};

export default withAuthenticationRequired;
