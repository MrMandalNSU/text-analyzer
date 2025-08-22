import React from "react";
import { Paper, Typography, Chip } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";

const Header = ({ count, userId, userCount }) => (
  <Paper
    elevation={3}
    sx={{ p: 4, textAlign: "center", bgcolor: "white", borderRadius: 2 }}
  >
    <Typography variant="h3" component="h1" gutterBottom color="primary">
      Text Analysis Dashboard
    </Typography>
    <Typography variant="subtitle1" color="text.secondary">
      Total Unique User{" "}
      <Chip
        icon={<PeopleIcon />}
        label={userCount}
        size="small"
        color="primary"
        variant="filled"
      />
    </Typography>
    <Typography variant="subtitle1" color="text.secondary">
      {count} text{count !== 1 ? "s" : ""} found for{" "}
      <Chip label={userId} size="small" color="primary" variant="outlined" />
    </Typography>
  </Paper>
);

export default Header;
