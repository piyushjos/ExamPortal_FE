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
  const [examData, setExamData] = useState({
    title: "",
    courseId: "",
    duration: 60,
    totalScore: 0,
    numberOfQuestions: 0, // Optional
    passingScore: 0,      // Optional
  });
  const [currentStep, setCurrentStep] = useState("exam-details");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExamData((prev) => ({
      ...prev,
      [name]: name === "courseId" ? Number(value) : value,
    }));
  };

  const handleSubmitExam = async () => {
    try {
      const examId = await onAddExam(examData);
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
      totalScore: 0,
      numberOfQuestions: 0,
      passingScore: 0,
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Exam Title"
                name="title"
                fullWidth
                value={examData.title}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
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
                label="Total Score"
                name="totalScore"
                type="number"
                fullWidth
                value={examData.totalScore}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 1 } }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="Number of Questions (Optional)"
                name="numberOfQuestions"
                type="number"
                fullWidth
                value={examData.numberOfQuestions || ""}
                onChange={handleChange}
                helperText="Leave blank or 0 to compute from Total Score & question marks"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="Passing Score (Optional)"
                name="passingScore"
                type="number"
                fullWidth
                value={examData.passingScore || ""}
                onChange={handleChange}
                helperText="Leave blank to default to 30% of Total Score"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmitExam}
            variant="contained"
            disabled={!examData.title || !examData.courseId || !examData.totalScore}
          >
            Create Exam & Add Questions
          </Button>
        </DialogActions>
      </Dialog>
      <AddQuestionDialog
        open={open && currentStep === "add-questions"}
        onClose={handleClose}
        examId={examData.id}
        onQuestionAdded={handleQuestionAdded}
      />
    </>
  );
};
