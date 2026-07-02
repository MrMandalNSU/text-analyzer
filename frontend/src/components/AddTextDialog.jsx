import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { API_BASE_URL } from "../config/api";

const AddTextDialog = ({ open, onClose, onSave, userId }) => {
  const [text, setText] = useState("");
  const [loadingSave, setLoadingSave] = useState(false);

  const handleSave = async () => {
    if (!text.trim()) return;
    setLoadingSave(true);
    try {
      const response = await fetch(`${API_BASE_URL}/texts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          text: text,
        }),
      });

      if (response.ok) {
        const newText = await response.json();
        onSave(newText);
        onClose();
        setText("");
      } else {
        alert("Failed to save text");
      }
    } catch (err) {
      alert("Failed to save text");
    } finally {
      setLoadingSave(false);
    }
  };

  const handleClose = () => {
    if (!loadingSave) {
      setText("");
      onClose();
    }
  };

  // Helper metrics for dialog display
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          fontFamily: '"Outfit", sans-serif',
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          pb: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            p: 1,
            borderRadius: "8px",
            bgcolor: "primary.light",
            color: "primary.dark",
          }}
        >
          <PostAddIcon sx={{ fontSize: 22 }} />
        </Box>
        Add Text for Analysis
      </DialogTitle>

      <DialogContent sx={{ pb: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Your text will be saved under your current session and can be analyzed for word, character, and sentence counts.
        </Typography>

        <TextField
          autoFocus
          fullWidth
          multiline
          minRows={6}
          placeholder="Paste or type your document content here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loadingSave}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "0.95rem",
              lineHeight: 1.6,
            },
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 3, mt: 1.5, px: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            Words: <strong>{wordCount}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Characters: <strong>{charCount}</strong>
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={handleClose} color="inherit" disabled={loadingSave}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!text.trim() || loadingSave}
          sx={{
            px: 3,
            bgcolor: "primary.main",
            color: "#ffffff",
          }}
        >
          {loadingSave ? "Saving..." : "Save Text"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTextDialog;
