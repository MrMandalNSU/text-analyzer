import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import FontDownloadIcon from "@mui/icons-material/FontDownload";
import SegmentIcon from "@mui/icons-material/Segment";
import NotesIcon from "@mui/icons-material/Notes";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function TextCard({ textItem, formatDate, onDelete }) {
  const [analysisResults, setAnalysisResults] = useState({
    words: null,
    characters: null,
    sentences: null,
    paragraphs: null,
    longestWords: null,
  });
  const [loadingResult, setLoadingResult] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorResult, setErrorResult] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editText, setEditText] = useState(textItem.text);
  const [savingEdit, setSavingEdit] = useState(false);

  const isAnalyzed =
    analysisResults.words !== null ||
    textItem.analysisId?.wordCount !== undefined;

  const fetchAllAnalysis = async () => {
    setLoadingResult(true);
    setErrorResult(null);
    try {
      const types = ["words", "characters", "sentences", "paragraphs", "longest-words"];
      const keyMap = {
        words: "words",
        characters: "characters",
        sentences: "sentences",
        paragraphs: "paragraphs",
        "longest-words": "longestWords",
      };

      const promises = types.map(async (type) => {
        const response = await fetch(
          `${API_BASE_URL}/analysis/${textItem._id}/${type}`,
          { method: "POST" }
        );
        if (!response.ok) throw new Error(`Failed to fetch ${type}`);
        const data = await response.json();
        return { key: keyMap[type], data };
      });

      const resList = await Promise.all(promises);
      const newResults = {};
      resList.forEach((item) => {
        newResults[item.key] = item.data;
      });

      setAnalysisResults(newResults);
    } catch (err) {
      setErrorResult(err.message);
    } finally {
      setLoadingResult(false);
    }
  };

  const openConfirm = () => setConfirmOpen(true);
  const closeConfirm = () => setConfirmOpen(false);

  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      const response = await fetch(`${API_BASE_URL}/texts/${textItem._id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`Delete failed: ${response.status}`);
      onDelete(textItem._id);
      closeConfirm();
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    } finally {
      setLoadingDelete(false);
    }
  };

  const openEdit = () => {
    setEditText(textItem.text);
    setEditOpen(true);
  };

  const closeEdit = () => setEditOpen(false);

  const handleEditSave = async () => {
    setSavingEdit(true);
    try {
      const response = await fetch(`${API_BASE_URL}/texts/${textItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editText }),
      });

      if (!response.ok) throw new Error("Failed to update");

      const updated = await response.json();
      textItem.text = updated.text;
      textItem.updatedAt = updated.updatedAt;
      textItem.analysisId = null;

      setAnalysisResults({
        words: null,
        characters: null,
        sentences: null,
        paragraphs: null,
        longestWords: null,
      });

      closeEdit();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setSavingEdit(false);
    }
  };

  // Get current values
  const wordCount = analysisResults.words?.wordCount ?? textItem.analysisId?.wordCount;
  const charCount = analysisResults.characters?.charCount ?? textItem.analysisId?.charCount;
  const sentenceCount = analysisResults.sentences?.sentenceCount ?? textItem.analysisId?.sentenceCount;
  const paragraphCount = analysisResults.paragraphs?.paragraphCount ?? textItem.analysisId?.paragraphCount;
  const longestWords = analysisResults.longestWords?.longestWords ?? textItem.analysisId?.longestWords;

  const metrics = [
    { label: "Words", value: wordCount, icon: <StickyNote2Icon />, color: "#6366f1" },
    { label: "Characters", value: charCount, icon: <FontDownloadIcon />, color: "#f43f5e" },
    { label: "Sentences", value: sentenceCount, icon: <SegmentIcon />, color: "#10b981" },
    { label: "Paragraphs", value: paragraphCount, icon: <NotesIcon />, color: "#8b5cf6" },
  ];

  return (
    <Card
      sx={{
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 12px 30px -4px rgba(0, 0, 0, 0.6)"
              : "0 12px 30px -4px rgba(99, 102, 241, 0.12)",
          borderColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(129, 140, 248, 0.2)"
              : "rgba(79, 70, 229, 0.15)",
        },
      }}
    >
      <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
        {/* Card Header Toolbar */}
        <Box sx={{ mb: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Chip
            label={`ID: ${textItem.userId}`}
            size="small"
            variant="outlined"
            sx={{
              fontSize: "0.75rem",
              fontWeight: 600,
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.02)"
                  : "rgba(0, 0, 0, 0.01)",
              borderColor: "divider",
            }}
          />
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Tooltip title="Edit text">
              <IconButton onClick={openEdit} color="primary" size="small">
                <EditIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete text">
              <IconButton onClick={openConfirm} color="error" size="small">
                <DeleteIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Text Snippet Box */}
        <Typography
          variant="body1"
          sx={{
            mb: 3,
            lineHeight: 1.7,
            fontSize: "1rem",
            color: "text.primary",
            fontStyle: "italic",
            pl: 2,
            borderLeft: "3px solid",
            borderColor: "primary.light",
            maxHeight: "180px",
            overflowY: "auto",
            pr: 1,
          }}
        >
          "{textItem.text}"
        </Typography>

        {/* Action / Analyze Row */}
        {!isAnalyzed && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Button
              variant="contained"
              onClick={fetchAllAnalysis}
              disabled={loadingResult}
              startIcon={loadingResult ? <CircularProgress size={16} color="inherit" /> : <QueryStatsIcon />}
              sx={{
                py: 1,
                px: 3,
                borderRadius: "100px",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                color: "#ffffff",
                boxShadow: "0 4px 14px rgba(99, 102, 241, 0.25)",
                "&:hover": {
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  boxShadow: "0 6px 20px rgba(99, 102, 241, 0.35)",
                },
              }}
            >
              {loadingResult ? "Analyzing Text..." : "Analyze Text"}
            </Button>
          </Box>
        )}

        {/* Metrics Grid */}
        <Grid container spacing={2} sx={{ mb: 2.5 }}>
          {metrics.map((m) => (
            <Grid item xs={6} sm={3} key={m.label}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  textAlign: "center",
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.02)"
                      : "rgba(0, 0, 0, 0.02)",
                  border: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "90px",
                  transition: "all 0.2s ease",
                  "&:hover": isAnalyzed
                    ? {}
                    : {
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.04)",
                        transform: "scale(1.02)",
                        cursor: "pointer",
                      },
                }}
                onClick={!isAnalyzed ? fetchAllAnalysis : undefined}
              >
                <Box sx={{ color: m.color, mb: 0.5, display: "flex" }}>
                  {m.icon}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {loadingResult && m.value === undefined ? (
                    <CircularProgress size={18} thickness={5} sx={{ color: "text.secondary" }} />
                  ) : (
                    m.value ?? "-"
                  )}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mt: 0.2 }}>
                  {m.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Longest Words Display */}
        {longestWords && longestWords.length > 0 && (
          <Box
            sx={{
              p: 2,
              borderRadius: "12px",
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.01)"
                  : "rgba(0, 0, 0, 0.01)",
              border: "1px solid",
              borderColor: "divider",
              mb: 2.5,
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 700, mb: 1, textTransform: "uppercase" }}>
              Longest Word(s):
            </Typography>
            <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap" }}>
              {longestWords.map((word) => (
                <Chip
                  key={word}
                  label={word}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                    borderColor: "primary.light",
                    color: "primary.main",
                    fontWeight: 600,
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {errorResult && (
          <Typography variant="caption" color="error" sx={{ display: "block", mb: 2, textAlign: "center" }}>
            Analysis Error: {errorResult}
          </Typography>
        )}

        {/* Footer Meta Row */}
        <Box
          sx={{
            pt: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <AccessTimeIcon sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              Created {formatDate(textItem.createdAt)}
            </Typography>
          </Box>
          {textItem.updatedAt !== textItem.createdAt && (
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
              Updated
            </Typography>
          )}
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog open={confirmOpen} onClose={closeConfirm}>
          <DialogTitle>Delete Text</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to permanently delete this text and its analysis?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeConfirm} color="inherit">
              Cancel
            </Button>
            <Button
              color="error"
              onClick={handleDelete}
              disabled={loadingDelete}
            >
              {loadingDelete ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editOpen} onClose={closeEdit} fullWidth maxWidth="md">
          <DialogTitle sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 600 }}>Edit Text Content</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              multiline
              minRows={5}
              variant="outlined"
              placeholder="Type your text content here..."
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              sx={{
                mt: 1,
                "& .MuiOutlinedInput-root": {
                  fontSize: "1rem",
                  lineHeight: 1.6,
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={closeEdit} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={handleEditSave}
              variant="contained"
              disabled={savingEdit || !editText.trim()}
            >
              {savingEdit ? "Saving Changes..." : "Save Changes"}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default TextCard;
