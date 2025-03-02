import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, CircularProgress } from "@mui/material";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import DashboardCard from "../shared/DashboardCard";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import api from "../../services/api";

function AdminDashboard() {
  const [instructors, setInstructors] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newInstructor, setNewInstructor] = useState({ 
    email: "", 
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInstructors();
  }, []);

  const loadInstructors = async () => {
    try {
      setLoading(true);
      const response = await api.admin.getAllUsers();
      console.log('Users response:', response);  // Debug log
      const users = Array.isArray(response) ? response : response.data || [];
      setInstructors(users.filter(user => user.role?.name === "INSTRUCTOR"));  // Changed from role to role.name
    } catch (err) {
      console.error('Load instructors error:', err);  // Debug log
      setError(err.message || "Failed to load instructors");
    } finally {
      setLoading(false);
    }
  };

  const handleAddInstructor = async () => {
    try {
      setLoading(true);
      await api.admin.addInstructor({
        email: newInstructor.email,
        password: newInstructor.password
      });
      setOpenAddDialog(false);
      setNewInstructor({ 
        email: "", 
        password: ""
      });
      await loadInstructors();
    } catch (err) {
      console.error('Add instructor error:', err);
      setError(err.message || "Failed to add instructor");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInstructor = async (instructorId) => {
    try {
      await api.admin.removeInstructor(instructorId);
      loadInstructors();
    } catch (err) {
      setError("Failed to delete instructor");
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          
            <DashboardCard
              title="Add Instructor"
              description="Add a new instructor to the system"
              buttonText="Add"
              icon={<AddIcon />}
              onClick={() => setOpenAddDialog(true)}
              bgColor="linear-gradient(135deg, #2196F3, #64B5F6)"
            />
       

         
            <DashboardCard
              title="Manage Instructors"
              description={`${instructors.length} Active Instructors`}
              buttonText="View"
              icon={<PersonIcon />}
              onClick={() => {/* Implement view instructors */}}
              bgColor="linear-gradient(135deg, #4CAF50, #81C784)"
            />
         

         
            <DashboardCard
              title="Analytics"
              description="View system analytics"
              buttonText="View"
              icon={<AnalyticsIcon />}
              onClick={() => {/* Implement analytics view */}}
              bgColor="linear-gradient(135deg, #FF9800, #FFB74D)"
            />
        
        </Grid>

        {/* Add Instructor Dialog */}
        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
          <DialogTitle>Add New Instructor</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Email Address"
              type="email"
              fullWidth
              value={newInstructor.email}
              onChange={(e) => setNewInstructor({ ...newInstructor, email: e.target.value })}
              error={!!error}
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              value={newInstructor.password}
              onChange={(e) => setNewInstructor({ ...newInstructor, password: e.target.value })}
              error={!!error}
            />
            {error && (
              <Typography color="error" variant="caption" display="block" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)} disabled={loading}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddInstructor} 
              variant="contained" 
              disabled={loading || !newInstructor.email || !newInstructor.password}
            >
              {loading ? <CircularProgress size={24} /> : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
}

export default AdminDashboard; 