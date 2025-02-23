import React, { useState } from "react";
import {  Paper, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";


const AdminDashboardCard = ({ title, description, buttonText, icon, onClick, bgColor,variant,colour }) => {
  return (
    <Grid item>
      <Paper
        sx={{
          height: 300,
          width: 300,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          p: 2,
          boxShadow: 4,
          borderRadius: 4,
          background: bgColor || "linear-gradient(135deg, #1976D2, #64B5F6)",
          color: "#fff",
          transition: "all 0.2s ease-in-out",
          "&:hover": { transform: "scale(1.03)", boxShadow: 6 },
        }}
      >
        <Typography variant="h6" fontWeight="bold">{title}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>{description}</Typography>
        <Button 
          variant="contained" 
          color={colour} 
          startIcon={icon} 
          sx={{ mt: 2 }} 
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </Paper>
    </Grid>
  );
};
export default AdminDashboardCard