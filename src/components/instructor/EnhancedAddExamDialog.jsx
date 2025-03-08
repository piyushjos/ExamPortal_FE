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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AddQuestionDialog } from "../instructor/AddQuestionDialog";

export const EnhancedAddExamDialog = ({
  open,
  onClose,
  onAddExam,
  courses,
}) => {
  const [examData, setExamData] = useState({
    title: "",
    description: "",
    courseId: "",
    duration: 60,
    totalMarks: 100,
    startTime: new Date(),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
     // Default 1 week from now
  });
  const [currentStep, setCurrentStep] = useState("exam-details");

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
      console.log("my exam data",examData)
      const realExamId = await onAddExam(examData);
      console.log("getting id in enhanced Add exam dialog===>", realExamId);

      if (realExamId) {
        // Store the real ID
        setExamData({
          ...examData,
          id: realExamId,
        });
        // Move to question adding step
        setCurrentStep("add-questions");
      } else {
        // Handle error case
        alert("Failed to create exam. Please try again.");
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
    onClose();
  };

  const handleQuestionAdded = () => {
    // After adding questions, close the dialog.
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

          {/* Dropdown for selecting a course */}
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

          {/* Date & Time Pickers */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Start Time"
              value={examData.startTime}
              onChange={(newValue) => handleDateChange("startTime", newValue)}
              renderInput={(params) => (
                <TextField {...params} margin="dense" fullWidth required />
              )}
            />
            <DateTimePicker
              label="End Time"
              value={examData.endTime}
              onChange={(newValue) => handleDateChange("endTime", newValue)}
              renderInput={(params) => (
                <TextField {...params} margin="dense" fullWidth required />
              )}
            />
          </LocalizationProvider>

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
        examId={examData.id}
        onQuestionAdded={handleQuestionAdded}
      />
    </>
  );
};
