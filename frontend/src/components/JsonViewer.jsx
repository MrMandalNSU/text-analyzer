import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Grid,
  Tabs,
  Tab,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import Alert from "@mui/material/Alert";

// Recursive Component for Interactive JSON Tree
function JsonTreeItem({ label, value, isLast = true }) {
  const [expanded, setExpanded] = useState(true);

  const toggleExpand = () => setExpanded(!expanded);

  if (value === null) {
    return (
      <Box sx={{ pl: 2, fontFamily: "monospace", fontSize: "0.85rem", my: 0.2 }}>
        <span style={{ color: "#a5b4fc" }}>{label}</span>:{" "}
        <span style={{ color: "#f43f5e", fontWeight: "bold" }}>null</span>
        {!isLast && ","}
      </Box>
    );
  }

  const type = typeof value;

  if (type === "string") {
    return (
      <Box sx={{ pl: 2, fontFamily: "monospace", fontSize: "0.85rem", my: 0.2 }}>
        <span style={{ color: "#a5b4fc" }}>{label}</span>:{" "}
        <span style={{ color: "#10b981" }}>"{value}"</span>
        {!isLast && ","}
      </Box>
    );
  }

  if (type === "number") {
    return (
      <Box sx={{ pl: 2, fontFamily: "monospace", fontSize: "0.85rem", my: 0.2 }}>
        <span style={{ color: "#a5b4fc" }}>{label}</span>:{" "}
        <span style={{ color: "#fb923c" }}>{value}</span>
        {!isLast && ","}
      </Box>
    );
  }

  if (type === "boolean") {
    return (
      <Box sx={{ pl: 2, fontFamily: "monospace", fontSize: "0.85rem", my: 0.2 }}>
        <span style={{ color: "#a5b4fc" }}>{label}</span>:{" "}
        <span style={{ color: "#38bdf8", fontWeight: "bold" }}>
          {value ? "true" : "false"}
        </span>
        {!isLast && ","}
      </Box>
    );
  }

  // Handle Arrays
  if (Array.isArray(value)) {
    return (
      <Box sx={{ pl: 2, my: 0.2 }}>
        <Box
          onClick={toggleExpand}
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            fontFamily: "monospace",
            fontSize: "0.85rem",
            userSelect: "none",
            "&:hover": { color: "primary.main" },
          }}
        >
          {expanded ? <ExpandMoreIcon sx={{ fontSize: 16 }} /> : <ChevronRightIcon sx={{ fontSize: 16 }} />}
          <span style={{ color: "#a5b4fc" }}>{label}</span>: Array({value.length}) [
        </Box>
        {expanded && (
          <Box sx={{ pl: 2, borderLeft: "1px dashed rgba(255,255,255,0.15)" }}>
            {value.map((item, idx) => (
              <JsonTreeItem
                key={idx}
                label={idx.toString()}
                value={item}
                isLast={idx === value.length - 1}
              />
            ))}
          </Box>
        )}
        <Box sx={{ pl: 2, fontFamily: "monospace", fontSize: "0.85rem" }}>
          ]{!isLast && ","}
        </Box>
      </Box>
    );
  }

  // Handle Objects
  if (type === "object") {
    const keys = Object.keys(value);
    return (
      <Box sx={{ pl: 2, my: 0.2 }}>
        <Box
          onClick={toggleExpand}
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            fontFamily: "monospace",
            fontSize: "0.85rem",
            userSelect: "none",
            "&:hover": { color: "primary.main" },
          }}
        >
          {expanded ? <ExpandMoreIcon sx={{ fontSize: 16 }} /> : <ChevronRightIcon sx={{ fontSize: 16 }} />}
          <span style={{ color: "#a5b4fc" }}>{label}</span>: Object {"{"}
        </Box>
        {expanded && (
          <Box sx={{ pl: 2, borderLeft: "1px dashed rgba(255,255,255,0.15)" }}>
            {keys.map((key, idx) => (
              <JsonTreeItem
                key={key}
                label={key}
                value={value[key]}
                isLast={idx === keys.length - 1}
              />
            ))}
          </Box>
        )}
        <Box sx={{ pl: 2, fontFamily: "monospace", fontSize: "0.85rem" }}>
          {"}"}
          {!isLast && ","}
        </Box>
      </Box>
    );
  }

  return null;
}

function JsonViewer() {
  const [jsonInput, setJsonInput] = useState("");
  const [parsedJson, setParsedJson] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [layoutMode, setLayoutMode] = useState("split"); // "split" | "input" | "viewer"

  const handleJsonChange = (val) => {
    setJsonInput(val);
    if (!val.trim()) {
      setParsedJson(null);
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(val);
      setParsedJson(parsed);
      setError(null);
    } catch (e) {
      setError(e.message);
      setParsedJson(null);
    }
  };

  const handleClear = () => {
    setJsonInput("");
    setParsedJson(null);
    setError(null);
  };

  const formatJson = () => {
    if (parsedJson) {
      setJsonInput(JSON.stringify(parsedJson, null, 2));
    }
  };

  const minifyJson = () => {
    if (parsedJson) {
      setJsonInput(JSON.stringify(parsedJson));
    }
  };

  const handleCopy = () => {
    if (parsedJson) {
      navigator.clipboard.writeText(JSON.stringify(parsedJson, null, 2));
    }
  };

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
      <Box sx={{ mb: 0.5, flexShrink: 0 }}>
        <Typography variant="h5" color="text.primary" sx={{ fontWeight: 800 }} gutterBottom>
          JSON Viewer & Explorer
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Format, minify, validate, and interactively explore raw JSON structures.
        </Typography>
      </Box>

      {/* Layout selector tabs */}
      <Box sx={{ borderBottom: "1px solid", borderColor: "divider", flexShrink: 0 }}>
        <Tabs
          value={layoutMode === "split" ? 0 : layoutMode === "input" ? 1 : 2}
          onChange={(e, val) => {
            if (val === 0) setLayoutMode("split");
            else if (val === 1) setLayoutMode("input");
            else if (val === 2) setLayoutMode("viewer");
          }}
          sx={{
            minHeight: 38,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 750,
              fontSize: "0.85rem",
              py: 1,
              minHeight: 38,
            }
          }}
        >
          <Tab label="Split View (50/50)" />
          <Tab label="Raw JSON Input" />
          <Tab label="JSON Explorer" />
        </Tabs>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          flexGrow: 1,
          height: "100%",
          minHeight: 0,
        }}
      >
        {/* Left Side: Paste Raw JSON */}
        {layoutMode !== "viewer" && (
          <Box
            sx={{
              flex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
            }}
          >
            <Card sx={{ flexGrow: 1, display: "flex", flexDirection: "column", border: "1px solid", borderColor: "divider", minHeight: 0 }}>
              <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2, flexGrow: 1, height: "100%", p: 2, "&:last-child": { pb: 2 } }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" color="text.primary" sx={{ fontWeight: 700 }}>
                    Raw JSON Input
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={!parsedJson}
                      onClick={formatJson}
                      sx={{ height: 28, fontSize: "0.75rem", py: 0.5 }}
                    >
                      Format
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={!parsedJson}
                      onClick={minifyJson}
                      sx={{ height: 28, fontSize: "0.75rem", py: 0.5 }}
                    >
                      Minify
                    </Button>
                    <IconButton onClick={handleClear} color="error" size="small" disabled={!jsonInput} sx={{ p: 0.5 }}>
                      <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <Tooltip title={layoutMode === "input" ? "Restore Split View" : "Maximize Input"}>
                      <IconButton
                        onClick={() => setLayoutMode(layoutMode === "input" ? "split" : "input")}
                        color="primary"
                        size="small"
                        sx={{ p: 0.5 }}
                      >
                        {layoutMode === "input" ? <FullscreenExitIcon sx={{ fontSize: 18 }} /> : <FullscreenIcon sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {error && (
                  <Alert severity="error" sx={{ py: 0.5 }}>
                    Invalid JSON: {error}
                  </Alert>
                )}

                <Box sx={{ flexGrow: 1, height: "100%", minHeight: 0 }}>
                  <TextField
                    multiline
                    fullWidth
                    variant="outlined"
                    placeholder='Paste raw JSON here...\ne.g. {"name": "Text Analyzer Suite", "version": 1.0, "active": true}'
                    value={jsonInput}
                    onChange={(e) => handleJsonChange(e.target.value)}
                    sx={{
                      height: "100%",
                      "& .MuiOutlinedInput-root": {
                        height: "100%",
                        alignItems: "flex-start",
                        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                        fontSize: "0.85rem",
                        lineHeight: 1.6,
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
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Right Side: Interactive Explorer / Pretty Print */}
        {layoutMode !== "input" && (
          <Box
            sx={{
              flex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
            }}
          >
            <Card sx={{ flexGrow: 1, display: "flex", flexDirection: "column", border: "1px solid", borderColor: "divider", minHeight: 0 }}>
              <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2, flexGrow: 1, height: "100%", p: 2, "&:last-child": { pb: 2 } }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: 1, borderColor: "divider", pb: 0.5 }}>
                  <Tabs
                    value={activeTab}
                    onChange={(e, val) => setActiveTab(val)}
                    sx={{
                      minHeight: 28,
                      "& .MuiTab-root": {
                        py: 0.5,
                        minHeight: 28,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        textTransform: "none",
                      }
                    }}
                  >
                    <Tab label="Interactive Tree" />
                    <Tab label="Pretty Raw" />
                  </Tabs>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Tooltip title="Copy Formatted JSON">
                      <span>
                        <IconButton
                          onClick={handleCopy}
                          color="primary"
                          size="small"
                          disabled={!parsedJson}
                          sx={{ p: 0.5 }}
                        >
                          <ContentCopyIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title={layoutMode === "viewer" ? "Restore Split View" : "Maximize Explorer"}>
                      <IconButton
                        onClick={() => setLayoutMode(layoutMode === "viewer" ? "split" : "viewer")}
                        color="primary"
                        size="small"
                        sx={{ p: 0.5 }}
                      >
                        {layoutMode === "viewer" ? <FullscreenExitIcon sx={{ fontSize: 18 }} /> : <FullscreenIcon sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Box
                  sx={{
                    flexGrow: 1,
                    height: "100%",
                    overflowY: "auto",
                    p: 2,
                    borderRadius: "12px",
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(10, 15, 30, 0.4)"
                        : "rgba(240, 244, 248, 0.5)",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  {!parsedJson && (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", minHeight: "250px" }}>
                      <Typography variant="body2" color="text.secondary">
                        {error ? "Fix syntax error to browse JSON" : "Enter valid JSON on the left to explore"}
                      </Typography>
                    </Box>
                  )}

                  {parsedJson && activeTab === 0 && (
                    <Box sx={{ color: "text.primary" }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1, fontStyle: "italic" }}>
                        Click on expandable fields to toggle node view
                      </Typography>
                      <Box sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                        Root Object {"{"}
                      </Box>
                      <Box sx={{ pl: 2, borderLeft: "1px dashed rgba(255,255,255,0.15)" }}>
                        {Object.keys(parsedJson).map((key, idx) => (
                          <JsonTreeItem
                            key={key}
                            label={key}
                            value={parsedJson[key]}
                            isLast={idx === Object.keys(parsedJson).length - 1}
                          />
                        ))}
                      </Box>
                      <Box sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                        {"}"}
                      </Box>
                    </Box>
                  )}

                  {parsedJson && activeTab === 1 && (
                    <pre
                      style={{
                        margin: 0,
                        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                        fontSize: "0.85rem",
                        color: "#a5b4fc",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                      }}
                    >
                      {JSON.stringify(parsedJson, null, 2)}
                    </pre>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default JsonViewer;
