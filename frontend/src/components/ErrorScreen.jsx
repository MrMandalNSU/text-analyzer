import React from "react";
import { Box, Alert } from "@mui/material";

const ErrorScreen = ({ message }) => (
  <Box sx={{ minHeight: "100vh", py: 4 }}>
    <Box display="flex" justifyContent="center">
      <Alert severity="error" sx={{ mb: 2, maxWidth: 600 }}>
        Error loading texts: {message}
      </Alert>
    </Box>
  </Box>
);

export default ErrorScreen;
