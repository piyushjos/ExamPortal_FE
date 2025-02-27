import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import DashboardCard from "../shared/DashboardCard";
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import QuizIcon from "@mui/icons-material/Quiz";
import api from "../../services/api";

function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [openAddCourse, setOpenAddCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: "", description: "" });
  const [error, setError] = useState("");

  const handleAddCourse = async () => {
    try {
      await api.instructor.createCourse(newCourse);
      setOpenAddCourse(false);
      loadCourses();
    } catch (err) {
      setError("Failed to add course");
    }
  };

  const loadCourses = async () => {
    try {
      // Endpoint needs to be implemented in the backend
      const response = await api.instructor.getCourses();
      setCourses(response.data);
    } catch (err) {
      setError("Failed to load courses");
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Instructor Dashboard
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6} lg={3}>
            <DashboardCard
              title="Create Course"
              description="Add a new course"
              buttonText="Create"
              icon={<AddIcon />}
              onClick={() => setOpenAddCourse(true)}
              bgColor="linear-gradient(135deg, #2196F3, #64B5F6)"
            />
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <DashboardCard
              title="Update Courses"
              description={`${courses.length} Active Courses`}
              buttonText="Update"
              icon={<UpdateIcon />}
              onClick={() => {/* Implement update courses */}}
              bgColor="linear-gradient(135deg, #4CAF50, #81C784)"
            />
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <DashboardCard
              title="Create Exam"
              description="Create a new exam"
              buttonText="Create"
              icon={<QuizIcon />}
              onClick={() => {/* Implement create exam */}}
              bgColor="linear-gradient(135deg, #FF9800, #FFB74D)"
            />
          </Grid>
        </Grid>

        {/* Add Course Dialog */}
        <Dialog open={openAddCourse} onClose={() => setOpenAddCourse(false)}>
          <DialogTitle>Create New Course</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Course Name"
              fullWidth
              value={newCourse.name}
              onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddCourse(false)}>Cancel</Button>
            <Button onClick={handleAddCourse} variant="contained">Create</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
}

export default InstructorDashboard; 