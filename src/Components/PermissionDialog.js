import React, { useState, useContext } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import {
  GlobalStateContext,
  GlobalDispatchContext,
} from "../Context/GlobalContext";

const PermissionDialog = () => {
  const [permission, setPermission] = useState(Notification.permission);

  const { isPermissionDialogOpen } = useContext(GlobalStateContext);
  const dispatch = useContext(GlobalDispatchContext);

  const handleClose = () => {
    permission !== "granted"
      ? Notification.requestPermission().then((permissionState) =>
          setPermission(permissionState)
        )
      : dispatch({ type: "CLOSE_PERMISSION_DIALOG" });
  };
  return (
    <Dialog
      open={isPermissionDialogOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Permissions Request</DialogTitle>
      <DialogContent>
        <DialogContentText>
          In order for this app to run properly you need to enable some
          permissions &#38; features
        </DialogContentText>
        <ul>
          <li>
            <DialogContentText>
              <b>Enable Experimental Web Platform features</b>
              <br />
              Go to url =&gt; &#160;
              <b>chrome://flags/#enable-experimental-web-platform-features</b>,
              find &#38; enable &#160;
              <b>Experimental Web Platform features</b>
            </DialogContentText>
          </li>
          <li>
            <DialogContentText>
              <b>Allow notification permissions</b>
            </DialogContentText>
          </li>
        </ul>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {permission !== "granted" ? "Ask notifivation permission" : "Done"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PermissionDialog;
