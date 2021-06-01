import React from "react";
import { Error, Warning, Info, ThumbUp } from "@material-ui/icons/";

const components = {
  success: ThumbUp,
  info: Info,
  warning: Warning,
  error: Error,
};

const Icon = ({ iconName }) => {
  const SpecificIcon = components[iconName];
  return <SpecificIcon />;
};

export default Icon;
