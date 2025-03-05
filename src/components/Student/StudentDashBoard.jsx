import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import DashboardLayout from "../shared/DashboardLayout";
import DashboardCard from "../shared/DashboardCard";
import SubjectIcon from "@mui/icons-material/Subject";
import QuizIcon from "@mui/icons-material/Quiz";
import DetailsIcon from "@mui/icons-material/Details";
import api from "../../services/api";

function StudentDashboard() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableExams, setAvailableExams] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [openEnrollDialog, setOpenEnrollDialog] = useState(false);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      const enrolled = await api.student.getEnrolledCourses();
      const exams = await api.student.getAvailableExams();
      const available = await api.student.getAvailableCourses();
      setEnrolledCourses(Array.isArray(enrolled) ? enrolled : []);
      setAvailableExams(Array.isArray(exams) ? exams : []);
      setAvailableCourses(Array.isArray(available) ? available : []);
    } catch (err) {
      console.error("Failed to load student data:", err);
      setError("Failed to load student data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentData();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await api.student.enrollInCourse(courseId);
      setOpenEnrollDialog(false);
      await loadStudentData();
    } catch (err) {
      console.error("Failed to enroll in course:", err);
      setError("Failed to enroll in course");
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Student Dashboard">
        <Box sx={{ p: 3, textAlign: "center" }}>
          <CircularProgress />
          <Typography>Loading...</Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Student Dashboard">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Student Dashboard
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* Enrolled Courses Section */}
        <Typography variant="h5" sx={{ mt: 4 }}>
          Enrolled Courses
        </Typography>

        {enrolledCourses.length === 0 ? (
          <Typography sx={{ mt: 2 }}>You are not enrolled in any courses.</Typography>
        ) : (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {enrolledCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Card sx={{ p: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{course.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.description}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Instructor:{" "}
                      {course.instructors && course.instructors.length > 0
                        ? course.instructors[0].email
                        : "Not assigned"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Dashboard Cards */}
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <DashboardCard
            title="Available Courses"
            description={`${availableCourses.length} Courses`}
            buttonText="Enroll"
            icon={<SubjectIcon />}
            onClick={() => setOpenEnrollDialog(true)}
            bgColor="linear-gradient(135deg, #2196F3, #64B5F6)"
          />
          <DashboardCard
            title="Available Exams"
            description={`${availableExams.length} Upcoming Exams`}
            buttonText="View Exams"
            icon={<QuizIcon />}
            onClick={() => {
              // Implement navigation to exams page if desired.
            }}
            bgColor="linear-gradient(135deg, #4CAF50, #81C784)"
          />
          <DashboardCard
            title="Exam Results"
            description="View your exam results"
            buttonText="View Results"
            icon={<DetailsIcon />}
            onClick={() => {
              // Implement navigation to exam results page if desired.
            }}
            bgColor="linear-gradient(135deg, #FF9800, #FFB74D)"
          />
        </Grid>

        {/* Enrollment Dialog */}
        <Dialog 
          open={openEnrollDialog} 
          onClose={() => setOpenEnrollDialog(false)} 
          fullWidth 
          maxWidth="sm"
        >
          <DialogTitle>Enroll in a Course</DialogTitle>
          <DialogContent>
            {availableCourses.length === 0 ? (
              <Typography>No courses available for enrollment.</Typography>
            ) : (
              <List>
                {availableCourses.map((course) => (
                  <React.Fragment key={course.id}>
                    <ListItem
                      secondaryAction={
                        <Button 
                          variant="contained" 
                          onClick={() => handleEnroll(course.id)}
                        >
                          Enroll
                        </Button>
                      }
                    >
                      <ListItemText 
                        primary={course.name} 
                        secondary={course.description} 
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEnrollDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
}

export default StudentDashboard;
