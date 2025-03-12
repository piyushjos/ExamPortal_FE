import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import DashboardLayout from "../shared/DashboardLayout";
import DashboardCard from "../shared/DashboardCard";
import SubjectIcon from "@mui/icons-material/Subject";
import QuizIcon from "@mui/icons-material/Quiz";
import ManageCourses from "./ManageCourses";
import CourseDetails from "./CourseDetails";
import ManageExams from "./ManageExams";
import api from "../../services/api";

function InstructorDashboard() {
  // currentView can be "overview", "courses", "courseDetails", or "exams"
  const [currentView, setCurrentView] = useState("overview");
  const [myCourses, setMyCourses] = useState([]);
  const [myExams, setMyExams] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [error, setError] = useState("");

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

  const handleViewCourses = () => {
    setCurrentView("courses");
  };

  const handleViewExams = () => {
    setCurrentView("exams");
  };

  const handleBack = () => {
    // If in courseDetails, go back to courses; otherwise, go to overview.
    if (currentView === "courseDetails") {
      setCurrentView("courses");
    } else {
      setCurrentView("overview");
    }
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setCurrentView("courseDetails");
  };

  const renderContent = () => {
    switch (currentView) {
      case "overview":
        return (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {/* <Grid item xs={12} sm={6}> */}
              <DashboardCard
                title="My Courses"
                description={`${myCourses.length} Courses Assigned`}
                buttonText="View Courses"
                onClick={handleViewCourses}
                bgColor="linear-gradient(135deg, #2196F3, #64B5F6)"
              />
            {/* </Grid> */}
            {/* <Grid item xs={12} sm={6}> */}
              <DashboardCard
                title="Manage Exams"
                description={`${myExams.length} Exams`}
                buttonText="View Exams"
                onClick={handleViewExams}
                bgColor="linear-gradient(135deg, #FF9800, #FFB74D)"
              />
            {/* </Grid> */}
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
        {/* Top navigation: show Back button if not in overview */}
        {currentView !== "overview" && (
          <Box sx={{ mb: 2 }}>
            <Button variant="outlined" onClick={handleBack}>
              Back to Overview
            </Button>
          </Box>
        )}
        {/* Dynamic content area */}
        {renderContent()}
      </Box>
    </DashboardLayout>
  );
}

export default InstructorDashboard;
