import React, { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import DashboardLayout from "../shared/DashboardLayout";
import DashboardCard from "../shared/DashboardCard";
import QuizIcon from "@mui/icons-material/Quiz";
import SubjectIcon from "@mui/icons-material/Subject";
import api from "../../services/api";
import { EnhancedAddExamDialog } from "../instructor/EnhancedAddExamDialog";
import ManageExams from "../instructor/ManageExams"; // Import the new component
import { useNavigate } from "react-router-dom";

function InstructorDashboard() {
  const [myCourses, setMyCourses] = useState([]);
  const [openAddExam, setOpenAddExam] = useState(false);
  const [showManageExams, setShowManageExams] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadCourses = async () => {
    try {
      const response = await api.instructor.getCourses();
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
    console.log("Exam data from dashboard:", examData);
    try {
      const formattedExam = { ...examData };
      console.log("Formatted exam:", formattedExam);
      const response = await api.instructor.createExam(formattedExam);
      const createdExam = response.data || response;
      console.log("Created exam:", createdExam);
      const examId = typeof createdExam === "number" ? createdExam : createdExam.id;
      return examId;
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
            onClick={() => navigate("/instructor/courses")}
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
          <DashboardCard
            title="Manage Exams"
            description="View, edit, and publish/unpublish your exams"
            buttonText="Manage Exams"
            icon={<QuizIcon />}
            onClick={() => setShowManageExams(!showManageExams)}
            bgColor="linear-gradient(135deg, #FFC107, #FFD54F)"
          />
        </Grid>
        {showManageExams && (
          <Box sx={{ mt: 4 }}>
            <ManageExams />
          </Box>
        )}
        <EnhancedAddExamDialog
          open={openAddExam}
          onClose={() => setOpenAddExam(false)}
          onAddExam={handleAddExam}
          courses={myCourses}
        />
      </Box>
    </DashboardLayout>
  );
}

export default InstructorDashboard;
