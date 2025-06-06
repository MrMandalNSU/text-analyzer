import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Paper,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";

import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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

  const fetchAnalysis = async (type) => {
    setLoadingResult(true);
    setErrorResult(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/analysis/${textItem._id}/${type}`,
        { method: "POST" }
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();

      const keyMap = {
        words: "words",
        characters: "characters",
        sentences: "sentences",
        paragraphs: "paragraphs",
        "longest-words": "longestWords",
      };

      setAnalysisResults((prev) => ({
        ...prev,
        [keyMap[type]]: data,
      }));
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
    setEditText(textItem.text); // reset to original
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
      textItem.text = updated.text; // Update text in-place
      textItem.updatedAt = updated.updatedAt;

      // reset analysis
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

  return (
    <Card
      elevation={2}
      sx={{
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
          <Chip
            label={`User: ${textItem.userId}`}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Box>
            <IconButton onClick={openEdit} color="primary">
              <EditIcon />
            </IconButton>
            <IconButton
              variant="outlined"
              color="error"
              size="small"
              onClick={openConfirm}
              loading={loadingDelete}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Typography
          variant="body1"
          sx={{ mb: 3, lineHeight: 1.6, fontStyle: "italic" }}
        >
          "{textItem.text}"
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom color="secondary">
            Analysis Results
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Words:</strong>{" "}
              {analysisResults.words?.wordCount ??
                textItem.analysisId?.wordCount ??
                "-"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Characters:</strong>{" "}
              {analysisResults.characters?.charCount ??
                textItem.analysisId?.charCount ??
                "-"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Sentences:</strong>{" "}
              {analysisResults.sentences?.sentenceCount ??
                textItem.analysisId?.sentenceCount ??
                "-"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Paragraphs:</strong>{" "}
              {analysisResults.paragraphs?.paragraphCount ??
                textItem.analysisId?.paragraphCount ??
                "-"}
            </Typography>
          </Box>

          {(
            analysisResults.longestWords?.longestWords ??
            textItem.analysisId?.longestWords
          )?.length > 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Longest word(s):</strong>
              </Typography>
              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                {(
                  analysisResults.longestWords?.longestWords ??
                  textItem.analysisId?.longestWords
                ).map((word) => (
                  <Chip
                    key={word}
                    label={word}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </Paper>

        {errorResult && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {errorResult}
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
          {[
            "words",
            "characters",
            "sentences",
            "paragraphs",
            "longest-words",
          ].map((type) => (
            <Button
              key={type}
              variant="outlined"
              size="small"
              color="primary"
              onClick={() => fetchAnalysis(type)}
              disabled={loadingResult}
            >
              {type.replace("-", " ").toUpperCase()}
            </Button>
          ))}
        </Box>

        <Box
          sx={{ mt: 2, pt: 1, borderTop: "1px solid", borderColor: "divider" }}
        >
          <Typography variant="caption" color="text.secondary">
            <strong>Created:</strong> {formatDate(textItem.createdAt)}
          </Typography>
          {textItem.updatedAt !== textItem.createdAt && (
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              <strong>Updated:</strong> {formatDate(textItem.updatedAt)}
            </Typography>
          )}
        </Box>

        {/* Delete confirmation dialog */}
        <Dialog open={confirmOpen} onClose={closeConfirm}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this text?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeConfirm}>Cancel</Button>
            <Button
              color="error"
              onClick={handleDelete}
              autoFocus
              loading={loadingDelete}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={editOpen} onClose={closeEdit} fullWidth maxWidth="md">
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              multiline
              minRows={4}
              label="Enter your text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeEdit}>Cancel</Button>
            <Button
              onClick={handleEditSave}
              variant="contained"
              disabled={savingEdit}
            >
              {savingEdit ? "Updating..." : "Update"}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default TextCard;
