import React, { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  Button,
  Chip,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import CodeIcon from "@mui/icons-material/Code";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import PeopleIcon from "@mui/icons-material/People";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";

const drawerWidth = 280;

const Layout = ({
  children,
  currentTab,
  setCurrentTab,
  themeMode,
  toggleThemeMode,
  userId,
  userCount,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavClick = (tabIndex) => {
    setCurrentTab(tabIndex);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleCopyUserId = () => {
    if (userId) {
      navigator.clipboard.writeText(userId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const menuItems = [
    { text: "Text Analyzer", icon: <TextFieldsIcon />, index: 0 },
    { text: "Text Formatter", icon: <AutoFixHighIcon />, index: 1 },
    { text: "JSON Viewer & Tree", icon: <CodeIcon />, index: 2 },
  ];

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: theme.palette.mode === "dark" ? "#0f172a" : "#ffffff",
        color: theme.palette.text.primary,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            background: "linear-gradient(135deg, #6366f1 0%, #a5b4fc 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
          }}
        >
          <CodeIcon sx={{ color: "#ffffff", fontSize: 20 }} />
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontFamily: '"Outfit", sans-serif',
              lineHeight: 1.2,
              background: "linear-gradient(90deg, #6366f1, #fb7185)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Text Suite
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontSize: "0.7rem", fontWeight: 600 }}>
            DEVELOPER TOOLS
          </Typography>
        </Box>
      </Box>

      {/* Theme Toggle & User Info Block (Moved to Top) */}
      <Box sx={{ px: 2, pb: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Theme toggle row */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {themeMode === "dark" ? "Dark Mode" : "Light Mode"}
          </Typography>
          <IconButton onClick={toggleThemeMode} color="inherit" size="small">
            {themeMode === "dark" ? (
              <Brightness7Icon sx={{ fontSize: 20, color: "#f59e0b" }} />
            ) : (
              <Brightness4Icon sx={{ fontSize: 20, color: "#64748b" }} />
            )}
          </IconButton>
        </Box>

        {/* User Card */}
        {userId && (
          <Box
            sx={{
              p: 2,
              borderRadius: "12px",
              bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Your Session ID
              </Typography>
              <Tooltip title={copied ? "Copied!" : "Copy Session ID"}>
                <IconButton size="small" onClick={handleCopyUserId} sx={{ p: 0.5 }}>
                  {copied ? <CheckIcon sx={{ fontSize: 14, color: "success.main" }} /> : <ContentCopyIcon sx={{ fontSize: 14 }} />}
                </IconButton>
              </Tooltip>
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "monospace",
                fontWeight: 600,
                color: "primary.main",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: "0.8rem",
              }}
            >
              {userId}
            </Typography>

            {userCount !== null && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5 }}>
                <PeopleIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Platform Users: <strong>{userCount}</strong>
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      <Divider sx={{ mx: 2 }} />

      {/* Navigation List */}
      <List sx={{ px: 2, py: 3, flexGrow: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        {menuItems.map((item) => {
          const isActive = currentTab === item.index;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavClick(item.index)}
                sx={{
                  borderRadius: "10px",
                  py: 1.2,
                  px: 2,
                  bgcolor: isActive
                    ? theme.palette.mode === "dark"
                      ? "rgba(129, 140, 248, 0.12)"
                      : "rgba(79, 70, 229, 0.08)"
                    : "transparent",
                  color: isActive
                    ? theme.palette.mode === "dark"
                      ? "#a5b4fc"
                      : "#4f46e5"
                    : theme.palette.text.secondary,
                  fontWeight: isActive ? 600 : 400,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: isActive
                      ? theme.palette.mode === "dark"
                        ? "rgba(129, 140, 248, 0.16)"
                        : "rgba(79, 70, 229, 0.12)"
                      : theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.03)"
                        : "rgba(0, 0, 0, 0.02)",
                    color: isActive
                      ? undefined
                      : theme.palette.mode === "dark"
                        ? "#f1f5f9"
                        : "#0f172a",
                    transform: "translateX(2px)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "inherit",
                    minWidth: 40,
                    "& svg": { fontSize: 20 },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  slotProps={{
                    primary: {
                      fontSize: "0.9rem",
                      fontWeight: isActive ? 600 : 500,
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Sidebar Footer */}
      <Box
        sx={{
          px: 3,
          pb: 2.5,
          pt: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontWeight: 500,
            fontSize: "0.75rem",
          }}
        >
          Made with ♥ by{" "}
          <Box
            component="a"
            href="https://sudipta.xyz"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: "primary.main",
              textDecoration: "none",
              fontWeight: 700,
              transition: "all 0.2s ease",
              "&:hover": {
                color: "primary.dark",
                textShadow: (theme) =>
                  theme.palette.mode === "dark"
                    ? "0 0 8px rgba(129, 140, 248, 0.4)"
                    : "0 0 8px rgba(79, 70, 229, 0.2)",
              },
            }}
          >
            Sudipta Mandal
          </Box>
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden" }}>
      {/* Mobile AppBar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            bgcolor: theme.palette.mode === "dark" ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(12px)",
            color: "text.primary",
            boxShadow: "none",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif', fontSize: "1.1rem" }}>
                Text Suite
              </Typography>
            </Box>
            <IconButton onClick={toggleThemeMode} color="inherit">
              {themeMode === "dark" ? (
                <Brightness7Icon sx={{ color: "#f59e0b" }} />
              ) : (
                <Brightness4Icon sx={{ color: "#64748b" }} />
              )}
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar Navigation */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                borderRight: "none",
              },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                borderRight: "none",
              },
            }}
            open
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>

      {/* Main Content Pane */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          overflowY: "auto",
          bgcolor: theme.palette.background.default,
          pt: isMobile ? "72px" : 4,
          pb: 4,
          px: { xs: 2, sm: 3, md: 4 },
          transition: "background-color 0.3s ease",
          position: "relative",
          backgroundImage:
            theme.palette.mode === "dark"
              ? "radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.08) 0, transparent 50%), radial-gradient(at 50% 100%, rgba(244, 63, 94, 0.05) 0, transparent 50%)"
              : "radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.04) 0, transparent 50%), radial-gradient(at 50% 100%, rgba(244, 63, 94, 0.03) 0, transparent 50%)",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
