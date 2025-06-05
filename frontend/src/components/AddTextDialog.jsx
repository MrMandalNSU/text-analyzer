import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddTextDialog = ({ open, onClose, onSave }) => {
  const [text, setText] = useState("");

  const handleSave = async () => {
    const response = await fetch(`${API_BASE_URL}/texts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "user123",
        text: text,
      }),
    });

    if (response.ok) {
      const newText = await response.json();
      onSave(newText);
      onClose();
      setText("");
    } else {
      alert("Failed to save");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          multiline
          minRows={4}
          label="Enter your text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!text.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTextDialog;
