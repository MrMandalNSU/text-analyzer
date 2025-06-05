import React from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import theme from "../theme";

const Layout = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: "auto",
        padding: "20px",
        backgroundImage: `url("img/cover-bg.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {children}
    </Box>
  </ThemeProvider>
);

export default Layout;
