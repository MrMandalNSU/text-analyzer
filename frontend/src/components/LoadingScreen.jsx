import React from "react";
import { Box, CircularProgress } from "@mui/material";

const LoadingScreen = () => (
  <Box sx={{ minHeight: "100vh", py: 4 }}>
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="50vh"
    >
      <CircularProgress size={60} />
    </Box>
  </Box>
);

export default LoadingScreen;
