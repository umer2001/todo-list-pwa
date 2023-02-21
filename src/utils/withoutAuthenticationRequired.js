import React from "react";
import { Navigate } from "react-router-dom";

const withoutAuthenticationRequired = (ComposedComponent) => {
  if (localStorage.getItem("token")) {
    return <Navigate to={"/"} />;
  }
  return <ComposedComponent />;
};

export default withoutAuthenticationRequired;
