import React from "react";
import { Paper, Box, Typography } from "@mui/material";
import TextCard from "./TextCard";

const TextList = ({ texts, formatDate, onDelete }) => (
  <Paper elevation={2} sx={{ p: 3, bgcolor: "white", borderRadius: 2, mb: 4 }}>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {texts.map((textItem) => (
        <TextCard
          key={textItem._id}
          textItem={textItem}
          formatDate={formatDate}
          onDelete={onDelete}
        />
      ))}

      {texts.length === 0 && (
        <Box textAlign="center" sx={{ py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No texts found
          </Typography>
        </Box>
      )}
    </Box>
  </Paper>
);

export default TextList;
