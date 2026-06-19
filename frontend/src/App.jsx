import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Box, Button, Container, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Layout from "./components/Layout";
import LoadingScreen from "./components/LoadingScreen";
import ErrorScreen from "./components/ErrorScreen";
import TextList from "./components/TextList";
import AddTextDialog from "./components/AddTextDialog";
import TextFormatter from "./components/TextFormatter";
import JsonViewer from "./components/JsonViewer";
import getAppTheme from "./theme";
import { getOrCreateUserId } from "./utils/generateUserId";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userCount, setUserCount] = useState(null);

  // Helper functions for hash routing
  const getTabFromHash = () => {
    const hash = window.location.hash;
    if (hash === "#/formatter" || hash === "#formatter") return 1;
    if (hash === "#/json-viewer" || hash === "#json-viewer") return 2;
    return 0; // Default or #/analyzer
  };

  const getHashFromTab = (tabIndex) => {
    if (tabIndex === 1) return "#/formatter";
    if (tabIndex === 2) return "#/json-viewer";
    return "#/analyzer";
  };

  // Layout Tab State: 0 = Analyzer, 1 = Formatter, 2 = JSON Viewer
  const [currentTab, setCurrentTab] = useState(getTabFromHash);

  // Sync state to URL hash on change
  useEffect(() => {
    window.location.hash = getHashFromTab(currentTab);
  }, [currentTab]);

  // Sync URL hash back to state (browser navigation or direct URL typing)
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentTab(getTabFromHash());
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Light/Dark Theme Mode State
  const [themeMode, setThemeMode] = useState(() => {
    const persisted = localStorage.getItem("app_theme");
    if (persisted) return persisted;
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  const toggleThemeMode = () => {
    setThemeMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("app_theme", next);
      return next;
    });
  };

  useEffect(() => {
    let existing = localStorage.getItem("unique_user_id");
    if (!existing) {
      const newId = getOrCreateUserId();
      localStorage.setItem("unique_user_id", newId);
      existing = newId;
    }
    setUserId(existing);
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTexts();
      fetchUserCount();
    }
  }, [userId]);

  const fetchTexts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${API_BASE_URL}/texts?userId=${encodeURIComponent(userId)}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setTexts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCount = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/texts/userCount`);
      const data = await response.json();
      setUserCount(data.count);
    } catch (err) {
      console.error("Failed to fetch user count:", err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAddText = (newTextItem) => {
    setTexts((prev) => [newTextItem, ...prev]);
    fetchUserCount(); // Refresh user count statistics in sidebar
  };

  const handleDeleteText = (deletedId) => {
    setTexts((prev) => prev.filter((text) => text._id !== deletedId));
    fetchUserCount();
  };

  const theme = getAppTheme(themeMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        themeMode={themeMode}
        toggleThemeMode={toggleThemeMode}
        userId={userId}
        userCount={userCount}
      >
        {/* Render Views based on tab selection */}
        {currentTab === 0 && (
          <Box className="fade-in" sx={{ maxWidth: 1000, mx: "auto", width: "100%" }}>
            {/* Header banner */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 2,
                mb: 4,
              }}
            >
              <Box>
                <Typography variant="h4" color="text.primary" sx={{ fontWeight: 800 }} gutterBottom>
                  Text Analyzer
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Create, update, and dissect texts with structural and lexical metrics.
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAddDialogOpen(true)}
                sx={{
                  bgcolor: "primary.main",
                  color: "#ffffff",
                  px: 2.5,
                  py: 1.2,
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                Add Text
              </Button>
            </Box>

            {loading ? (
              <LoadingScreen />
            ) : error ? (
              <ErrorScreen message={error} />
            ) : (
              <TextList
                texts={texts}
                formatDate={formatDate}
                onDelete={handleDeleteText}
              />
            )}

            <AddTextDialog
              open={addDialogOpen}
              onClose={() => setAddDialogOpen(false)}
              onSave={handleAddText}
              userId={userId}
            />
          </Box>
        )}

        {currentTab === 1 && <TextFormatter />}
        {currentTab === 2 && <JsonViewer />}
      </Layout>
    </ThemeProvider>
  );
}

export default App;
