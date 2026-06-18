import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import WrapTextIcon from "@mui/icons-material/WrapText";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";

function TextFormatterPlaceholder() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
  };

  const removeLeadingSpaces = () => {
    const res = inputText
      .split("\n")
      .map((line) => line.trimStart())
      .join("\n");
    setOutputText(res);
  };

  const removeTrailingSpaces = () => {
    const res = inputText
      .split("\n")
      .map((line) => line.trimEnd())
      .join("\n");
    setOutputText(res);
  };

  const removeInnerNewlines = () => {
    const res = inputText.replace(/[\r\n]+/g, " ");
    setOutputText(res);
  };

  const removeLeadingChar = () => {
    // Remove the very first character of the text (one-by-one)
    if (inputText.length > 0) {
      const updated = inputText.substring(1);
      setInputText(updated);
      setOutputText(updated);
    }
  };

  const toUppercase = () => {
    setOutputText(inputText.toUpperCase());
  };

  const toLowercase = () => {
    setOutputText(inputText.toLowerCase());
  };

  const cleanExtraSpaces = () => {
    const res = inputText.replace(/\s+/g, " ").trim();
    setOutputText(res);
  };

  return (
    <Box className="fade-in" sx={{ width: "100%", py: 1 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" color="text.primary" gutterBottom>
          Text Formatter
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Clean, transform, and format your raw text instantly.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Input Text Area */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" color="text.primary">
                  Input Text
                </Typography>
                <IconButton onClick={handleClear} color="error" size="small" disabled={!inputText}>
                  <DeleteOutlineIcon />
                </IconButton>
              </Box>
              <TextField
                multiline
                rows={12}
                fullWidth
                variant="outlined"
                placeholder="Paste or type your text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                    fontSize: "0.9rem",
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Output Text Area */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" color="text.primary">
                  Formatted Output
                </Typography>
                <Box>
                  <Tooltip title="Copy to Clipboard">
                    <span>
                      <IconButton
                        onClick={handleCopy}
                        color="primary"
                        size="small"
                        disabled={!outputText}
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              </Box>
              <TextField
                multiline
                rows={12}
                fullWidth
                variant="outlined"
                slotProps={{ input: { readOnly: true } }}
                placeholder="Output will appear here..."
                value={outputText}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                    fontSize: "0.9rem",
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.01)"
                        : "rgba(0, 0, 0, 0.01)",
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Formatting Controls Panel */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
                Formatting Operations
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={removeLeadingSpaces}
                  disabled={!inputText}
                  startIcon={<FormatAlignLeftIcon />}
                >
                  Trim Line Starts
                </Button>
                <Button
                  variant="outlined"
                  onClick={removeTrailingSpaces}
                  disabled={!inputText}
                >
                  Trim Line Ends
                </Button>
                <Button
                  variant="outlined"
                  onClick={removeInnerNewlines}
                  disabled={!inputText}
                  startIcon={<WrapTextIcon />}
                >
                  Join Lines
                </Button>
                <Button
                  variant="outlined"
                  onClick={removeLeadingChar}
                  disabled={!inputText}
                  color="warning"
                >
                  Remove First Char (One-by-One)
                </Button>
                <Button
                  variant="outlined"
                  onClick={cleanExtraSpaces}
                  disabled={!inputText}
                  startIcon={<AutoFixHighIcon />}
                >
                  Squeeze Extra Spaces
                </Button>
                <Divider orientation="vertical" flexItem />
                <Button
                  variant="contained"
                  onClick={toUppercase}
                  disabled={!inputText}
                >
                  UPPERCASE
                </Button>
                <Button
                  variant="contained"
                  onClick={toLowercase}
                  disabled={!inputText}
                >
                  lowercase
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TextFormatterPlaceholder;
