import React from "react";
import { Paper, Typography, Button, Box } from "@mui/material";
import Grid from "@mui/material/Grid";

const DashboardCard = ({ title, description, buttonText, icon, onClick, bgColor }) => {
  return (
    <Grid item xs={12} md={6} lg={4}>
      <Paper
        sx={{
          height: '100%',
          minHeight: 200,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 3,
          p: 3,
          background: bgColor || "linear-gradient(135deg, #1976D2, #64B5F6)",
          color: "#fff",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: (theme) => theme.shadows[8],
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0))",
            opacity: 0,
            transition: "opacity 0.3s ease-in-out",
          },
          "&:hover::before": {
            opacity: 1,
          },
        }}
      >
        <Box sx={{ mb: 2, opacity: 0.9 }}>
          {icon}
        </Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
          {description}
        </Typography>
        <Box sx={{ mt: 'auto' }}>
          <Button
            variant="contained"
            color="inherit"
            startIcon={icon}
            onClick={onClick}
            sx={{
              bgcolor: 'rgba(255,255,255,0.15)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.25)',
              },
            }}
          >
            {buttonText}
          </Button>
        </Box>
      </Paper>
    </Grid>
  );
};

export default DashboardCard; 