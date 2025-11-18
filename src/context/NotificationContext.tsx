import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

type Severity = "error" | "warning" | "info" | "success";

interface NotificationContextType {
  notify: (message: string, severity?: Severity) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification must be used within NotificationProvider");
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<Severity>("error");

  const notify = (msg: string, sev: Severity = "error") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ minWidth: 200 }}>
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};
