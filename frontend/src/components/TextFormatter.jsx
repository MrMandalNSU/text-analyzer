import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  IconButton,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  useTheme,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import LayersIcon from "@mui/icons-material/Layers";
import SubjectIcon from "@mui/icons-material/Subject";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import BrushIcon from "@mui/icons-material/Brush";

function TextFormatter() {
  const theme = useTheme();
  const [inputText, setInputText] = useState("");
  const [targetScope, setTargetScope] = useState("line"); // "text" | "line"
  const [joinDelimiter, setJoinDelimiter] = useState("space"); // "space" | "collapse" | "comma" | "pipe"
  const [selectionToRestore, setSelectionToRestore] = useState(null);

  // History Stack for Input Pane (Undo/Redo)
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Ref to access the HTML textarea element for selection bounding
  const textareaRef = useRef(null);

  // Focus and restore cursor selection after state finishes rendering
  useEffect(() => {
    if (selectionToRestore && textareaRef.current) {
      const { start, end } = selectionToRestore;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(start, end);
      setSelectionToRestore(null);
    }
  }, [inputText, selectionToRestore]);

  // Central state update function that pushes to undo stack
  const updateInput = (newVal) => {
    setUndoStack((prev) => [...prev, inputText]);
    setRedoStack([]);
    setInputText(newVal);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prevVal = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, inputText]);
    setInputText(prevVal);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextVal = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, inputText]);
    setInputText(nextVal);
  };

  const handleClear = () => {
    updateInput("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputText);
  };

  // Helper function to apply a formatting rule to the entire text or selected text only
  const applyTransformation = (transformFn) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;

    if (start === end) {
      // No selection: format entire content
      const transformed = transformFn(currentText);
      updateInput(transformed);
      setSelectionToRestore({ start, end });
    } else {
      // Selection exists: format only the highlighted range
      const selectedText = currentText.substring(start, end);
      const transformedSelected = transformFn(selectedText);
      const newText =
        currentText.substring(0, start) +
        transformedSelected +
        currentText.substring(end);

      updateInput(newText);
      setSelectionToRestore({
        start: start,
        end: start + transformedSelected.length,
      });
    }
  };

  // ONE-BY-ONE CHAR SHAVING
  const shaveChar = () => {
    applyTransformation((text) => {
      if (!text) return "";
      if (targetScope === "text") {
        return text.substring(1);
      } else {
        const lines = text.split("\n");
        return lines.map((line) => line.substring(1)).join("\n");
      }
    });
  };

  // BATCH LAYOUT OPERATIONS
  const removeEmptyLines = () => {
    applyTransformation((text) => {
      return text
        .split("\n")
        .filter((line) => line.trim() !== "")
        .join("\n");
    });
  };

  const applyJoinLinesWithDelim = (delimVal) => {
    applyTransformation((text) => {
      let delim = " ";
      if (delimVal === "collapse") delim = "";
      else if (delimVal === "comma") delim = ", ";
      else if (delimVal === "pipe") delim = " | ";

      return text.replace(/[\r\n]+/g, delim);
    });
  };

  const joinLines = () => {
    applyJoinLinesWithDelim(joinDelimiter);
  };

  // CASE TRANSFORMATIONS
  const formatUppercase = () => {
    applyTransformation((text) => text.toUpperCase());
  };

  const formatLowercase = () => {
    applyTransformation((text) => text.toLowerCase());
  };

  const formatTitleCase = () => {
    applyTransformation((text) =>
      text.toLowerCase().replace(/\b([a-z])/g, (m, p1) => p1.toUpperCase())
    );
  };

  const formatSentenceCase = () => {
    applyTransformation((text) =>
      text.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase())
    );
  };

  // Metrics computation for current editor state
  const charCount = inputText.length;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const lineCount = inputText ? inputText.split("\n").length : 0;

  return (
    <Box
      className="fade-in"
      sx={{
        width: "100%",
        height: { xs: "auto", md: "calc(100vh - 72px)" },
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Title & Description row */}
      <Box sx={{ mb: 0.5 }}>
        <Typography variant="h5" color="text.primary" sx={{ fontWeight: 800 }}>
          Text Formatter Suite
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Format selected text or full paragraphs. Highlight a text range to apply tools selectively.
        </Typography>
      </Box>

      {/* Top Row: Horizontal Toolbar Card (Clean Single Row) */}
      <Card sx={{ border: "1px solid", borderColor: "divider", shrink: 0 }}>
        <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "nowrap",
              alignItems: "center",
              gap: 2.5,
              width: "100%",
              overflowX: "auto",
              py: 0.5,
              "&::-webkit-scrollbar": {
                height: 6,
              },
              "&::-webkit-scrollbar-track": {
                bgcolor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.12)"
                    : "rgba(0, 0, 0, 0.12)",
                borderRadius: 3,
              },
            }}
          >
            {/* Group 1: Shaving (Shave + Inline Scope Toggle) */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
              <Tooltip title="One-by-one character shaving tools">
                <KeyboardTabIcon sx={{ fontSize: 16, color: "warning.main" }} />
              </Tooltip>
              <Button
                variant="outlined"
                color="warning"
                size="small"
                onClick={shaveChar}
                disabled={!inputText}
                sx={{ height: 32, fontSize: "0.75rem", px: 1.5 }}
              >
                Shave Char
              </Button>
              <ToggleButtonGroup
                value={targetScope}
                exclusive
                onChange={(e, val) => val && setTargetScope(val)}
                size="small"
                sx={{ height: 32 }}
              >
                <ToggleButton value="line" sx={{ py: 0, px: 1, fontSize: "0.68rem", fontWeight: 600 }}>
                  Lines
                </ToggleButton>
                <ToggleButton value="text" sx={{ py: 0, px: 1, fontSize: "0.68rem", fontWeight: 600 }}>
                  Text
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ flexShrink: 0 }} />

            {/* Group 2: Layout (Join + Inline Delimiter + Clean) */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
              <Tooltip title="Line layout formatting tools">
                <LayersIcon sx={{ fontSize: 16, color: "primary.main" }} />
              </Tooltip>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  p: 0.25,
                  height: 32,
                  gap: 0.75,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.01)"
                      : "rgba(0, 0, 0, 0.01)",
                }}
              >
                <Button
                  variant="text"
                  size="small"
                  onClick={joinLines}
                  disabled={!inputText}
                  sx={{
                    height: 26,
                    fontSize: "0.75rem",
                    px: 1,
                    textTransform: "none",
                    minWidth: "auto",
                    fontWeight: 700,
                  }}
                >
                  Join Lines
                </Button>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.68rem", fontWeight: 600 }}
                >
                  with
                </Typography>
                <ToggleButtonGroup
                  value={joinDelimiter}
                  exclusive
                  onChange={(e, val) => {
                    if (val) {
                      setJoinDelimiter(val);
                      if (inputText.includes("\n") || inputText.includes("\r")) {
                        applyJoinLinesWithDelim(val);
                      }
                    }
                  }}
                  size="small"
                  sx={{
                    height: 24,
                    border: "none",
                    "& .MuiToggleButtonGroup-grouped": {
                      border: 0,
                      borderRadius: "4px !important",
                      mx: 0.1,
                      py: 0,
                      px: 0.8,
                      fontSize: "0.65rem",
                      textTransform: "none",
                      fontWeight: 600,
                    },
                  }}
                >
                  <ToggleButton value="space">Space</ToggleButton>
                  <ToggleButton value="collapse">None</ToggleButton>
                  <ToggleButton value="comma">Comma</ToggleButton>
                  <ToggleButton value="pipe">Pipe</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              
              <Button
                variant="outlined"
                size="small"
                onClick={removeEmptyLines}
                disabled={!inputText}
                sx={{ height: 32, fontSize: "0.75rem", px: 1.5 }}
              >
                Remove Empty
              </Button>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ flexShrink: 0 }} />

            {/* Group 3: Case Transformations */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
              <Tooltip title="Text casing formatters">
                <BrushIcon sx={{ fontSize: 16, color: "secondary.main" }} />
              </Tooltip>
              <Button
                variant="contained"
                size="small"
                onClick={formatSentenceCase}
                disabled={!inputText}
                sx={{ height: 32, fontSize: "0.72rem", px: 1.2 }}
              >
                Sentence
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={formatTitleCase}
                disabled={!inputText}
                sx={{ height: 32, fontSize: "0.72rem", px: 1.2 }}
              >
                Title
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={formatUppercase}
                disabled={!inputText}
                sx={{ height: 32, fontSize: "0.72rem", px: 1.2 }}
              >
                UPPER
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={formatLowercase}
                disabled={!inputText}
                sx={{ height: 32, fontSize: "0.72rem", px: 1.2 }}
              >
                lower
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Bottom Row: Single Text Editor Workspace */}
      <Card sx={{ flexGrow: 1, display: "flex", flexDirection: "column", border: "1px solid", borderColor: "divider", minHeight: 0 }}>
        
        {/* Editor Toolbar Header */}
        <Box
          sx={{
            px: 2.5,
            py: 1,
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.01)"
                : "rgba(0, 0, 0, 0.01)",
          }}
        >
          {/* Editor Title & Undo/Redo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 0.5 }}>
              <SubjectIcon sx={{ fontSize: 16 }} /> Text Editor
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 14, alignSelf: "center" }} />
            <Tooltip title="Undo last formatting action">
              <span>
                <IconButton onClick={handleUndo} disabled={undoStack.length === 0} size="small">
                  <UndoIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Redo formatting action">
              <span>
                <IconButton onClick={handleRedo} disabled={redoStack.length === 0} size="small">
                  <RedoIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </span>
            </Tooltip>
          </Box>

          {/* Real-time stats & Copy/Clear actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, flexWrap: "wrap" }}>
            {/* Selective Formatting Info Chip */}
            <Chip
              icon={<InfoOutlinedIcon />}
              label="Supports selection-only formatting"
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontSize: "0.7rem", height: 24, display: { xs: "none", sm: "flex" } }}
            />

            {/* Live Stats Chips */}
            {inputText && (
              <Box sx={{ display: "flex", gap: 1.2 }}>
                <Chip label={`Lines: ${lineCount}`} size="small" variant="outlined" sx={{ fontFamily: "monospace", fontSize: "0.72rem", height: 24 }} />
                <Chip label={`Words: ${wordCount}`} size="small" variant="outlined" sx={{ fontFamily: "monospace", fontSize: "0.72rem", height: 24 }} />
                <Chip label={`Chars: ${charCount}`} size="small" variant="outlined" sx={{ fontFamily: "monospace", fontSize: "0.72rem", height: 24 }} />
              </Box>
            )}

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 14, alignSelf: "center" }} />

            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Tooltip title="Copy text to clipboard">
                <span>
                  <IconButton
                    onClick={handleCopy}
                    color="primary"
                    size="small"
                    disabled={!inputText}
                  >
                    <ContentCopyIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Clear editor content">
                <span>
                  <IconButton
                    onClick={handleClear}
                    color="error"
                    size="small"
                    disabled={!inputText}
                  >
                    <DeleteOutlineIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        {/* Full-size Text Area Workspace */}
        <Box
          sx={{
            p: 2.5,
            flexGrow: 1,
            height: "100%",
            minHeight: 0,
          }}
        >
          <TextField
            multiline
            fullWidth
            variant="outlined"
            inputRef={textareaRef}
            placeholder="Type or paste your text here, then click formatting actions in the toolkit above..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            sx={{
              height: "100%",
              "& .MuiOutlinedInput-root": {
                height: "100%",
                alignItems: "flex-start",
                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                fontSize: "0.85rem",
                lineHeight: 1.7,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(10, 15, 30, 0.2)"
                    : "rgba(240, 244, 248, 0.15)",
              },
              "& .MuiInputBase-input": {
                height: "100% !important",
                overflowY: "auto !important",
              },
            }}
          />
        </Box>
      </Card>
    </Box>
  );
}

export default TextFormatter;
