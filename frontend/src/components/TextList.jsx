import React from "react";
import { Box, Typography } from "@mui/material";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import TextCard from "./TextCard";

const TextList = ({ texts, formatDate, onDelete }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 4 }}>
    {texts.map((textItem) => (
      <TextCard
        key={textItem._id}
        textItem={textItem}
        formatDate={formatDate}
        onDelete={onDelete}
      />
    ))}

    {texts.length === 0 && (
      <Box
        sx={{
          py: 8,
          px: 2,
          textAlign: "center",
          borderRadius: "16px",
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.01)"
              : "rgba(0, 0, 0, 0.01)",
          border: "1px dashed",
          borderColor: "divider",
        }}
      >
        <TextFieldsIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2, opacity: 0.6 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No texts found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click the "Add Text" button above to get started.
        </Typography>
      </Box>
    )}
  </Box>
);

export default TextList;
