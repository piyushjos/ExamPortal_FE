import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import DashboardLayout from "../shared/DashboardLayout";
import DashboardCard from "../shared/DashboardCard";
import ManageCourses from "./ManageCourses";
import CourseDetails from "./CourseDetails";
import ManageExams from "./ManageExams";
import { EnhancedAddExamDialog } from "./EnhancedAddExamDialog";
import api from "../../services/api";

function InstructorDashboard() {
  const [currentView, setCurrentView] = useState("overview");
  const [myCourses, setMyCourses] = useState([]);
  const [myExams, setMyExams] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [error, setError] = useState("");
  const [openAddExam, setOpenAddExam] = useState(false);

  const loadCourses = async () => {
    try {
      const coursesData = await api.instructor.getCourses();
      setMyCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (err) {
      console.error("Failed to load courses:", err);
      setError("Failed to load courses");
    }
  };

  const loadExams = async () => {
    try {
      const examsData = await api.instructor.getMyExams();
      setMyExams(Array.isArray(examsData) ? examsData : []);
    } catch (err) {
      console.error("Failed to load exams:", err);
      setError("Failed to load exams");
    }
  };

  useEffect(() => {
    loadCourses();
    loadExams();
  }, []);

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setCurrentView("courseDetails");
  };

  const handleBack = () => {
    if (currentView === "courseDetails") {
      setCurrentView("courses");
    } else {
      setCurrentView("overview");
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case "overview":
        return (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            
              <DashboardCard
                title="My Courses"
                description={`${myCourses.length} Courses Assigned`}
                buttonText="View Courses"
                onClick={() => setCurrentView("courses")}
                bgColor="linear-gradient(135deg, #2196F3, #64B5F6)"
              />
            
              <DashboardCard
                title="Manage Exams"
                description={`${myExams.length} Exams`}
                buttonText="View Exams"
                onClick={() => setCurrentView("exams")}
                bgColor="linear-gradient(135deg, #FF9800, #FFB74D)"
              />
            
              <DashboardCard
                title="Create Exam"
                description="Add a new exam"
                buttonText="Create Exam"
                onClick={() => setOpenAddExam(true)}
                bgColor="linear-gradient(135deg, #4CAF50, #81C784)"
              />
          </Grid>
        );
      case "courses":
        return <ManageCourses courses={myCourses} onCourseClick={handleCourseClick} />;
      case "courseDetails":
        return (
          <Box>
            <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
              Back to Courses
            </Button>
            <CourseDetails course={selectedCourse} />
          </Box>
        );
      case "exams":
        return <ManageExams exams={myExams} refreshExams={loadExams} />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout title="Instructor Dashboard">
      <Box sx={{ p: 3 }}>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {currentView !== "overview" && (
          <Box sx={{ mb: 2 }}>
            <Button variant="outlined" onClick={handleBack}>
              Back to Overview
            </Button>
          </Box>
        )}
        {renderContent()}
      </Box>
      <EnhancedAddExamDialog
        open={openAddExam}
        onClose={() => setOpenAddExam(false)}
        onAddExam={async (examData) => {
          const newExam = await api.instructor.createExam(examData);
          await loadExams();
          return newExam.id;
        }}
        courses={myCourses}
      />
    </DashboardLayout>
  );
}

export default InstructorDashboard;
