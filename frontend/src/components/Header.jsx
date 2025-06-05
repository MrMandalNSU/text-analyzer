import React from "react";
import { Paper, Typography } from "@mui/material";

const Header = ({ count }) => (
  <Paper
    elevation={3}
    sx={{ p: 4, textAlign: "center", bgcolor: "white", borderRadius: 2 }}
  >
    <Typography variant="h3" component="h1" gutterBottom color="primary">
      Text Analysis Dashboard
    </Typography>
    <Typography variant="subtitle1" color="text.secondary">
      {count} text{count !== 1 ? "s" : ""} found
    </Typography>
  </Paper>
);

export default Header;
