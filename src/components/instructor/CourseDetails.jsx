import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import api from "../../services/api";
import ExamResultsTable from "./ExamResultsTable";

function CourseDetails({ course }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!course) return;
    loadExams();
  }, [course]);

  const loadExams = async () => {
    try {
      setLoading(true);
      const data = await api.instructor.getExamsByCourse(course.id);
      setExams(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load exams for this course");
    } finally {
      setLoading(false);
    }
  };

  if (!course) return <Typography>No course selected</Typography>;
  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {course.name} - Exams & Scores
      </Typography>
      {exams.length === 0 ? (
        <Typography>No published exams in this course.</Typography>
      ) : (
        exams.map((exam) => (
          <Box key={exam.id} mb={4}>
            <Typography variant="h6" gutterBottom>
              {exam.title} (Questions: {exam.numberOfQuestions || (exam.questions ? exam.questions.length : 0)})
            </Typography>
            <ExamResultsTable examId={exam.id} />
          </Box>
        ))
      )}
    </Box>
  );
}

export default CourseDetails;
