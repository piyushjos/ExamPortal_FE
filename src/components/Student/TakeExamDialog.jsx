import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  TextField
} from '@mui/material';
import api from '../../services/api';

const TakeExamDialog = ({ open, onClose, examId }) => {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !examId) return;
    const fetchExam = async () => {
      try {
        setLoading(true);
        const data = await api.student.getExamDetails(examId);
        setExam(data);
        setTimeLeft(data.duration * 60);
      } catch (err) {
        console.error("Failed to fetch exam details", err);
        setError("Failed to load exam");
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [examId, open]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!exam || !exam.questions) return;
    const answersArray = exam.questions.map(q => answers[q.id] || "");
    setSubmitting(true);
    try {
      const resultMessage = await api.student.submitExam(exam.id, answersArray);
      alert(resultMessage);
      onClose();
    } catch (err) {
      console.error("Submission failed", err);
      setError("Failed to submit exam");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      {loading ? (
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <CircularProgress />
          <Typography>Loading exam...</Typography>
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <>
          <DialogTitle>{exam.title}</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                Time Left: {Math.floor(timeLeft/60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {exam.questions.map((question, idx) => (
                <Grid item xs={12} key={question.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        {idx + 1}. {question.text}
                      </Typography>
                      {(question.questionType === "MULTIPLE_CHOICE" || question.questionType === "TRUE_FALSE") ? (
                        <FormControl component="fieldset">
                          <FormLabel component="legend">Select your answer:</FormLabel>
                          <RadioGroup
                            value={answers[question.id] || ""}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          >
                            {JSON.parse(question.options).map((opt, index) => (
                              <FormControlLabel
                                key={index}
                                value={opt}
                                control={<Radio />}
                                label={opt}
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>
                      ) : (
                        <TextField
                          label="Your Answer"
                          multiline
                          rows={6}
                          fullWidth
                          value={answers[question.id] || ""}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Exam"}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default TakeExamDialog;
