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
const userId = localStorage.getItem("unique_user_id");

const AddTextDialog = ({ open, onClose, onSave, userId }) => {
  const [text, setText] = useState("");
  const [loadingSave, setLoadingSave] = useState(false);

  const handleSave = async () => {
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
        alert("Failed to save");
      }
    } catch (err) {
      alert("Failed to save");
    } finally {
      setLoadingSave(false);
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
          loading={loadingSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTextDialog;
