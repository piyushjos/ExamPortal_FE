import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  CircularProgress,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const ManageExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadExams = async () => {
    try {
      setLoading(true);
      const data = await api.instructor.getMyExams();
      setExams(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load exams:", err);
      setError("Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  const handlePublish = async (examId) => {
    try {
      await api.instructor.publishExam(examId);
      loadExams();
    } catch (err) {
      console.error("Failed to publish exam:", err);
      setError("Failed to publish exam");
    }
  };

  const handleUnpublish = async (examId) => {
    try {
      await api.instructor.unpublishExam(examId);
      loadExams();
    } catch (err) {
      console.error("Failed to unpublish exam:", err);
      setError("Failed to unpublish exam");
    }
  };

  const handleEdit = (examId) => {
    // Navigate to an exam edit page if implemented.
    navigate(`/instructor/exams/edit/${examId}`);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", p: 3 }}>
        <CircularProgress />
        <Typography>Loading exams...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Exams
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      {exams.length === 0 ? (
        <Typography>No exams found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Exam Title</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Duration (min)</TableCell>
                <TableCell># of Questions</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell>{exam.title}</TableCell>
                  <TableCell>{exam.course ? exam.course.name : "N/A"}</TableCell>
                  <TableCell>{exam.duration}</TableCell>
                  <TableCell>{exam.numberOfQuestions || "All"}</TableCell>
                  <TableCell>
                    {exam.published ? (
                      <Chip label="Live" color="success" />
                    ) : (
                      <Chip label="Not Live" color="default" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" onClick={() => handleEdit(exam.id)}>
                      Edit
                    </Button>
                    {exam.published ? (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleUnpublish(exam.id)}
                        sx={{ ml: 1 }}
                      >
                        Unpublish
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handlePublish(exam.id)}
                        sx={{ ml: 1 }}
                      >
                        Publish
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ManageExams;
