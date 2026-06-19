import { createTheme } from "@mui/material/styles";

export const getAppTheme = (mode) => {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? "#818cf8" : "#4f46e5", // Indigo
        light: isDark ? "#a5b4fc" : "#818cf8",
        dark: isDark ? "#4f46e5" : "#3730a3",
      },
      secondary: {
        main: isDark ? "#fb7185" : "#e11d48", // Rose
        light: isDark ? "#fda4af" : "#fb7185",
        dark: isDark ? "#e11d48" : "#be123c",
      },
      background: {
        default: isDark ? "#090d16" : "#f8fafc",
        paper: isDark ? "#111827" : "#ffffff",
      },
      text: {
        primary: isDark ? "#f1f5f9" : "#0f172a",
        secondary: isDark ? "#94a3b8" : "#475569",
      },
      divider: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
    },
    typography: {
      fontFamily: '"Plus Jakarta Sans", "Outfit", "Inter", sans-serif',
      h1: {
        fontWeight: 700,
        fontFamily: '"Outfit", sans-serif',
      },
      h2: {
        fontWeight: 700,
        fontFamily: '"Outfit", sans-serif',
      },
      h3: {
        fontWeight: 700,
        fontFamily: '"Outfit", sans-serif',
      },
      h4: {
        fontWeight: 600,
        fontFamily: '"Outfit", sans-serif',
      },
      h5: {
        fontWeight: 600,
        fontFamily: '"Outfit", sans-serif',
      },
      h6: {
        fontWeight: 600,
        fontFamily: '"Outfit", sans-serif',
      },
      button: {
        textTransform: "none",
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "10px",
            padding: "8px 18px",
            fontSize: "0.875rem",
            fontWeight: 600,
            transition: "all 0.2s ease",
            "&:focus": {
              outline: "none",
              boxShadow: "none",
            },
            "&:hover": {
              transform: "translateY(-1px)",
            },
          },
          contained: {
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
            "&:hover": {
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: "all 0.2s ease",
            "&:focus": {
              outline: "none",
              boxShadow: "none",
            },
            "&:hover": {
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "16px",
            border: isDark ? "1px solid rgba(255, 255, 255, 0.07)" : "1px solid rgba(0, 0, 0, 0.05)",
            boxShadow: isDark
              ? "0 4px 20px -2px rgba(0, 0, 0, 0.4)"
              : "0 4px 20px -2px rgba(100, 116, 139, 0.08)",
            backgroundImage: "none",
            backgroundColor: isDark ? "#111827" : "#ffffff",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: "20px",
            border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            transition: "all 0.2s ease",
          },
        },
      },
    },
  });
};

export default getAppTheme;
