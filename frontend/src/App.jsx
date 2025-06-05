import React, { useState, useEffect } from "react";
import { Container, Box } from "@mui/material";
import Layout from "./components/Layout";
import LoadingScreen from "./components/LoadingScreen";
import ErrorScreen from "./components/ErrorScreen";
import Header from "./components/Header";
import TextList from "./components/TextList";

function App() {
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTexts();
  }, []);

  const fetchTexts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/texts");
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
