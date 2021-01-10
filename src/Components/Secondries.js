import React from "react";
import Chip from "@material-ui/core/Chip";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import LocalLaundryServiceOutlinedIcon from "@material-ui/icons/LocalLaundryServiceOutlined";

export const Secondries = () => {
  return (
    <div>
      <ChatBubbleOutlineIcon style={{ fontSize: 15 }} />
      <Chip
        label="yesterday"
        icon={<LocalLaundryServiceOutlinedIcon />}
        size="small"
        variant="outlined"
      />
      <Chip
        label="Inbox"
        size="small"
        color="primary"
        variant="outlined"
        style={{ float: "right" }}
      />
    </div>
  );
};
