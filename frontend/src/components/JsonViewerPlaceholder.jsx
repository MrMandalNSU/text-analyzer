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

function JsonViewerPlaceholder() {
  const [jsonInput, setJsonInput] = useState("");
  const [parsedJson, setParsedJson] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

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
    <Box className="fade-in" sx={{ width: "100%", py: 1 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" color="text.primary" gutterBottom>
          JSON Viewer & Explorer
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Format, minify, validate, and interactively explore raw JSON structures.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left Side: Paste Raw JSON */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2, flexGrow: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" color="text.primary">
                  Raw JSON Input
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={!parsedJson}
                    onClick={formatJson}
                  >
                    Format
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={!parsedJson}
                    onClick={minifyJson}
                  >
                    Minify
                  </Button>
                  <IconButton onClick={handleClear} color="error" size="small" disabled={!jsonInput}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>
              </Box>

              {error && (
                <Alert severity="error" sx={{ py: 0.5 }}>
                  Invalid JSON: {error}
                </Alert>
              )}

              <TextField
                multiline
                rows={14}
                fullWidth
                variant="outlined"
                placeholder='Paste raw JSON here...\ne.g. {"name": "Text Analyzer Suite", "version": 1.0, "active": true}'
                value={jsonInput}
                onChange={(e) => handleJsonChange(e.target.value)}
                sx={{
                  flexGrow: 1,
                  "& .MuiOutlinedInput-root": {
                    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                    fontSize: "0.85rem",
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Right Side: Interactive Explorer / Pretty Print */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2, flexGrow: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)}>
                  <Tab label="Interactive Tree" />
                  <Tab label="Pretty Raw" />
                </Tabs>
                <Tooltip title="Copy Formatted JSON">
                  <span>
                    <IconButton
                      onClick={handleCopy}
                      color="primary"
                      size="small"
                      disabled={!parsedJson}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>

              <Box
                sx={{
                  flexGrow: 1,
                  minHeight: "300px",
                  maxHeight: "500px",
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
        </Grid>
      </Grid>
    </Box>
  );
}

export default JsonViewerPlaceholder;
