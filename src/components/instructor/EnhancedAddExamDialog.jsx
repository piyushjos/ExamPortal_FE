import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { AddQuestionDialog } from "../instructor/AddQuestionDialog";

export const EnhancedAddExamDialog = ({ open, onClose, onAddExam, courses }) => {
  // Capture only the fields: title, courseId, duration, numberOfQuestions.
  const [examData, setExamData] = useState({
    title: "",
    courseId: "",
    duration: 60,
    numberOfQuestions: 0,
  });
  const [currentStep, setCurrentStep] = useState("exam-details");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExamData({
      ...examData,
      [name]: name === "courseId" ? Number(value) : value,
    });
  };

  const handleSubmitExam = async () => {
    try {
      console.log("Exam data:", examData);
      const response = await onAddExam(examData);
      const createdExam = response.data || response;
      console.log("Created exam from API:", createdExam);
      const examId = typeof createdExam === "number" ? createdExam : createdExam.id;
      if (examId) {
        setExamData({ ...examData, id: examId });
        setCurrentStep("add-questions");
      } else {
        alert("Failed to create exam. Please try again.");
      }
    } catch (error) {
      console.error("Failed to create exam:", error);
      alert("Failed to create exam. Please try again.");
    }
  };

  const handleClose = () => {
    setExamData({
      title: "",
      courseId: "",
      duration: 60,
      numberOfQuestions: 0,
    });
    setCurrentStep("exam-details");
    onClose();
  };

  const handleQuestionAdded = () => {
    handleClose();
  };

  return (
    <>
      <Dialog open={open && currentStep === "exam-details"} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Create New Exam</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Exam Title"
            name="title"
            fullWidth
            value={examData.title}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth margin="dense" required>
            <InputLabel id="course-select-label">Select Course</InputLabel>
            <Select
              labelId="course-select-label"
              name="courseId"
              value={examData.courseId}
              onChange={handleChange}
              label="Select Course"
            >
              {courses && courses.length > 0 ? (
                courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">
                  <em>No courses available</em>
                </MenuItem>
              )}
            </Select>
          </FormControl>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="Duration (minutes)"
                name="duration"
                type="number"
                fullWidth
                value={examData.duration}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 1 } }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="Number of Questions"
                name="numberOfQuestions"
                type="number"
                fullWidth
                value={examData.numberOfQuestions || ""}
                onChange={(e) =>
                  setExamData({
                    ...examData,
                    numberOfQuestions: parseInt(e.target.value, 10) || 0,
                  })
                }
                helperText="Leave blank or 0 to use all questions"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmitExam} variant="contained" disabled={!examData.title || !examData.courseId}>
            Create Exam & Add Questions
          </Button>
        </DialogActions>
      </Dialog>
      <AddQuestionDialog open={open && currentStep === "add-questions"} onClose={handleClose} examId={examData.id} onQuestionAdded={handleQuestionAdded} />
    </>
  );
};
