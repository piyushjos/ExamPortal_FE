import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AddQuestionDialog } from "../instructor/AddQuestionDialog";

export const EnhancedAddExamDialog = ({ open, onClose, onAddExam }) => {
  const [examData, setExamData] = useState({
    title: "",
    description: "",
    courseId: "",
    duration: 60,
    totalMarks: 100,
    startTime: new Date(),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 1 week from now
  });

  const [currentStep, setCurrentStep] = useState("exam-details");
  const [createdExamId, setCreatedExamId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExamData({
      ...examData,
      [name]: value,
    });
  };

  const handleDateChange = (name, value) => {
    setExamData({
      ...examData,
      [name]: value,
    });
  };

  const handleSubmitExam = async () => {
    try {
      // Log the form data for debugging
      console.log("Exam data submitted:", examData);

      // Comment out API calls for now
      // const response = await api.instructor.createExam(examData);
      // const newExamId = response.data.id;

      // Important: Simply change the step without waiting for API
      setCurrentStep("add-questions");

      // Optional: Notify parent component with the form data
      if (onAddExam) {
        onAddExam({
          ...examData,
          id: "temp-" + Date.now(),
        });
      }
    } catch (error) {
      console.error("Failed to create exam:", error);
      alert("Failed to create exam. Please try again.");
    }
  };

  const handleClose = () => {
    // Reset state
    setExamData({
      title: "",
      description: "",
      courseId: "",
      duration: 60,
      totalMarks: 100,
      startTime: new Date(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    setCurrentStep("exam-details");
    setCreatedExamId(null);

    // Close dialog
    onClose();
  };

  const handleQuestionAdded = () => {
    // Successfully added questions
    handleClose();
  };

  return (
    <>
      {/* Exam Details Dialog */}
      <Dialog
        open={open && currentStep === "exam-details"}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
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

          <TextField
            margin="dense"
            label="Description"
            name="description"
            multiline
            rows={3}
            fullWidth
            value={examData.description}
            onChange={handleChange}
          />

          {/* Simple text field for course ID instead of dropdown */}
          <TextField
            margin="dense"
            label="Course ID"
            name="courseId"
            fullWidth
            value={examData.courseId}
            onChange={handleChange}
            required
          />

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
                label="Total Marks"
                name="totalMarks"
                type="number"
                fullWidth
                value={examData.totalMarks}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 1 } }}
                required
              />
            </Grid>
          </Grid>

          {/* Add date pickers for start and end time */}
          {/* Note: You'll need to implement date pickers based on the library you're using */}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Note: After creating the exam, you'll be able to add questions.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmitExam}
            variant="contained"
            disabled={!examData.title || !examData.courseId}
          >
            Create Exam & Add Questions
          </Button>
        </DialogActions>
      </Dialog>

      {/* Question Creation Dialog */}
      <AddQuestionDialog
        open={open && currentStep === "add-questions"}
        onClose={handleClose}
        examId={"temp-exam-id"} // For now just use a temp ID
        onQuestionAdded={handleQuestionAdded}
      />
    </>
  );
};
