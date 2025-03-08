import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import DashboardLayout from "../shared/DashboardLayout";
import DashboardCard from "../shared/DashboardCard";
import QuizIcon from "@mui/icons-material/Quiz";
import SubjectIcon from "@mui/icons-material/Subject";
import api from "../../services/api";
import { EnhancedAddExamDialog } from "../instructor/EnhancedAddExamDialog";

function InstructorDashboard() {
  const [myCourses, setMyCourses] = useState([]);
  const [openAddExam, setOpenAddExam] = useState(false);
  const [error, setError] = useState("");

  const loadCourses = async () => {
    try {
      const response = await api.instructor.getCourses();
      // Assuming the API returns an array directly or in a data property
      setMyCourses(Array.isArray(response) ? response : response.data || []);
    } catch (err) {
      console.error("Failed to load courses:", err);
      setError("Failed to load courses");
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleAddExam = async (examData) => {
    console.log("my examdATA FROM HANDLEEXAM INSTRUCTOR DASHBOARD===>", examData) 
    try {""
      // Convert endTime to ISO string if needed
      const formattedExam = {
        ...examData,
        startTime: examData.startTime.toISOString(),
        endTime: examData.endTime.toISOString(),
      };
      console.log("my formatted exam===>",formattedExam)
      const response = await api.instructor.createExam(formattedExam);
      

      // Pass the real exam ID back to the dialog for question creation
      const createdExam = response.data || response;
      console.log("created exam api",createdExam)
      console.log("my exam creation id",createdExam.course.id)
      return createdExam.id;
    } catch (error) {
      console.error("Failed to create exam:", error);
      setError("Failed to create exam");
    }
  };

  return (
    <DashboardLayout title="Instructor Dashboard">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Instructor Dashboard
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <DashboardCard
            title="My Courses"
            description={`${myCourses.length} Courses Assigned`}
            buttonText="View Courses"
            icon={<SubjectIcon />}
            onClick={() => {
              // Implement navigation to courses page if desired.
            }}
            bgColor="linear-gradient(135deg, #2196F3, #64B5F6)"
          />
          <DashboardCard
            title="Create Exam"
            description="Create a new exam for one of your courses"
            buttonText="Create Exam"
            icon={<QuizIcon />}
            onClick={() => setOpenAddExam(true)}
            bgColor="linear-gradient(135deg, #FF9800, #FFB74D)"
          />
        </Grid>

        <EnhancedAddExamDialog
          open={openAddExam}
          onClose={() => setOpenAddExam(false)}
          onAddExam={handleAddExam}
          courses={myCourses} // Pass the courses loaded in your dashboard
        />
      </Box>
    </DashboardLayout>
  );
}

export default InstructorDashboard;
