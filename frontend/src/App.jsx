import React, { useState, useEffect } from "react";
import { Container, Box, Button } from "@mui/material";
import Layout from "./components/Layout";
import LoadingScreen from "./components/LoadingScreen";
import ErrorScreen from "./components/ErrorScreen";
import Header from "./components/Header";
import TextList from "./components/TextList";
import AddTextDialog from "./components/AddTextDialog";
import { getOrCreateUserId } from "./utils/generateUserId";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

getOrCreateUserId(); // Generate user id

function App() {
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [userId, setUserId] = useState(null);

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
    if (userId) fetchTexts(userId);
  }, [userId]);

  const fetchTexts = async () => {
    try {
      setLoading(true);
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
  };

  const handleDeleteText = (deletedId) => {
    setTexts((prev) => prev.filter((text) => text._id !== deletedId));
  };

  if (loading)
    return (
      <Layout>
        <LoadingScreen />
      </Layout>
    );
  if (error)
    return (
      <Layout>
        <ErrorScreen message={error} />
      </Layout>
    );

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            width: "100%",
            maxWidth: 900,
            mx: "auto",
          }}
        >
          <Header count={texts.length} />
          <Button
            variant="contained"
            sx={{ alignSelf: "flex-end", mb: 2 }}
            onClick={() => setAddDialogOpen(true)}
          >
            + Add Text
          </Button>

          <AddTextDialog
            open={addDialogOpen}
            onClose={() => setAddDialogOpen(false)}
            onSave={handleAddText}
            userId={userId}
          />

          <TextList
            texts={texts}
            formatDate={formatDate}
            onDelete={handleDeleteText}
          />
        </Box>
      </Container>
    </Layout>
  );
}

export default App;
