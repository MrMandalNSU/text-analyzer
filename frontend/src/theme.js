import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
    background: { default: "#f5f5f5" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          "&:focus": {
            outline: "none",
            boxShadow: "none",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:focus": {
            outline: "none",
            boxShadow: "none",
          },
        },
      },
    },
  },
});

export default theme;
