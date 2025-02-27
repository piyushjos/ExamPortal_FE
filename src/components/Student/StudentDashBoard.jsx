import React, { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import DashboardCard from "../shared/DashboardCard";
import SubjectIcon from "@mui/icons-material/Subject";
import QuizIcon from "@mui/icons-material/Quiz";
import DetailsIcon from "@mui/icons-material/Details";
import api from "../../services/api";

function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      const [coursesResponse, examsResponse] = await Promise.all([
        api.student.getEnrolledCourses(),
        api.student.getAvailableExams()
      ]);
      
      // Ensure we have arrays even if the response is empty
      setCourses(Array.isArray(coursesResponse) ? coursesResponse : []);
      setExams(Array.isArray(examsResponse) ? examsResponse : []);
    } catch (err) {
      console.error('Failed to load student data:', err);
      setError("Failed to load student data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Loading...</Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Student Dashboard
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <DashboardCard
            title="Enrolled Courses"
            description={`${courses?.length || 0} Courses`}
            buttonText="View"
            icon={<SubjectIcon />}
            onClick={() => {/* Implement view courses */}}
            bgColor="linear-gradient(135deg, #2196F3, #64B5F6)"
          />

          <DashboardCard
            title="Available Exams"
            description={`${exams?.length || 0} Upcoming Exams`}
            buttonText="View"
            icon={<QuizIcon />}
            onClick={() => {/* Implement view exams */}}
            bgColor="linear-gradient(135deg, #4CAF50, #81C784)"
          />

          <DashboardCard
            title="Exam Results"
            description="View your exam results"
            buttonText="View"
            icon={<DetailsIcon />}
            onClick={() => {/* Implement view results */}}
            bgColor="linear-gradient(135deg, #FF9800, #FFB74D)"
          />
        </Grid>
      </Box>
    </DashboardLayout>
  );
}

export default StudentDashboard; 