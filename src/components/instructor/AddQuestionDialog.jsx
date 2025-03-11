import React, { useState, useEffect } from "react";
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
  FormControlLabel,
  Radio,
  RadioGroup,
  IconButton,
  Switch,
  Paper,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CodeIcon from "@mui/icons-material/Code";

export const AddQuestionDialog = ({ open, onClose, examId, onQuestionAdded }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: "",
    type: "MULTIPLE_CHOICE",
    marks: 5,
    isCodeQuestion: false,
    codeSnippet: "",
    options: [
      { id: "1", text: "", isCorrect: false },
      { id: "2", text: "", isCorrect: false },
      { id: "3", text: "", isCorrect: false },
      { id: "4", text: "", isCorrect: false },
    ],
  });

  useEffect(() => {
    if (currentQuestion.type === "TRUE_FALSE") {
      setCurrentQuestion((prev) => ({
        ...prev,
        options: [
          { id: "tf1", text: "True", isCorrect: false },
          { id: "tf2", text: "False", isCorrect: false },
        ],
      }));
    }
  }, [currentQuestion.type]);

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion({
      ...currentQuestion,
      [name]: value,
    });
  };

  const handleCodeToggle = (e) => {
    setCurrentQuestion({
      ...currentQuestion,
      isCodeQuestion: e.target.checked,
    });
  };

  const handleOptionChange = (id, field, value) => {
    if (currentQuestion.type === "TRUE_FALSE" && field === "text") {
      return;
    }
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options.map((option) =>
        option.id === id ? { ...option, [field]: value } : option
      ),
    });
  };

  const setCorrectOption = (id) => {
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options.map((option) => ({
        ...option,
        isCorrect: option.id === id,
      })),
    });
  };

  const addOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [
        ...currentQuestion.options,
        { id: Date.now().toString(), text: "", isCorrect: false },
      ],
    });
  };

  const removeOption = (id) => {
    if (currentQuestion.options.length <= 2) return; // Minimum 2 options
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options.filter((option) => option.id !== id),
    });
  };

  const addQuestion = () => {
    const hasCorrectOption = currentQuestion.options.some(
      (opt) => opt.isCorrect
    );
    if (!hasCorrectOption) {
      alert("Please mark at least one option as correct");
      return;
    }
    const newQuestion = {
      ...currentQuestion,
      id: Date.now().toString(),
    };
    setQuestions([...questions, newQuestion]);
    console.log("Added question:", newQuestion);
    // Reset for next question
    setCurrentQuestion({
      text: "",
      type: "MULTIPLE_CHOICE",
      marks: 5,
      isCodeQuestion: false,
      codeSnippet: "",
      options: [
        { id: "1", text: "", isCorrect: false },
        { id: "2", text: "", isCorrect: false },
        { id: "3", text: "", isCorrect: false },
        { id: "4", text: "", isCorrect: false },
      ],
    });
  };

  const saveAllQuestions = async () => {
    try {
      if (currentQuestion.text.trim() !== "") {
        addQuestion();
      }
      const formattedQuestions = questions.map((q) => {
        // Determine the correct answer from the options
        const correctOption = q.options.find(opt => opt.isCorrect);
        return {
          examId,
          questionText: q.text,
          questionType: q.type,
          marks: q.marks,
          isCodeQuestion: q.isCodeQuestion,
          codeSnippet: q.codeSnippet,
          options: q.options.map((opt) => ({
            optionText: opt.text,
            isCorrect: opt.isCorrect,
          })),
          correctAnswer: correctOption ? correctOption.text : ""
        };
      });
      console.log("All questions saved:", formattedQuestions);
      if (onQuestionAdded) {
        onQuestionAdded(formattedQuestions);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save questions:", error);
      alert("Failed to save questions. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add Questions to Exam</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Question {questions.length + 1}
          </Typography>
          <TextField
            label="Question Text"
            name="text"
            value={currentQuestion.text}
            onChange={handleQuestionChange}
            fullWidth
            multiline
            rows={3}
            margin="normal"
            required
          />
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Question Type"
                name="type"
                select
                SelectProps={{ native: true }}
                value={currentQuestion.type}
                onChange={handleQuestionChange}
                fullWidth
                variant="outlined"
                margin="normal"
              >
                <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                <option value="TRUE_FALSE">True/False</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Marks"
                name="marks"
                type="number"
                value={currentQuestion.marks}
                onChange={handleQuestionChange}
                fullWidth
                variant="outlined"
                margin="normal"
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={currentQuestion.isCodeQuestion}
                  onChange={handleCodeToggle}
                  color="primary"
                />
              }
              label="Include Code Snippet"
            />
            {currentQuestion.isCodeQuestion && (
              <CodeIcon color="primary" sx={{ ml: 1 }} />
            )}
          </Box>
          {currentQuestion.isCodeQuestion && (
            <TextField
              label="Code Snippet"
              name="codeSnippet"
              value={currentQuestion.codeSnippet}
              onChange={handleQuestionChange}
              fullWidth
              multiline
              rows={6}
              margin="normal"
              placeholder="Enter your code snippet here..."
              InputProps={{ style: { fontFamily: "monospace" } }}
            />
          )}
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography variant="subtitle1">Options</Typography>
              {currentQuestion.type === "MULTIPLE_CHOICE" && (
                <Button startIcon={<AddIcon />} onClick={addOption} size="small" variant="outlined">
                  Add Option
                </Button>
              )}
            </Box>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup>
                {currentQuestion.options.map((option, index) => (
                  <Box key={option.id} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <FormControlLabel
                      value={option.id}
                      control={
                        <Radio
                          checked={option.isCorrect}
                          onChange={() => setCorrectOption(option.id)}
                          required
                        />
                      }
                      label=""
                      sx={{ mr: 0 }}
                    />
                    <TextField
                      value={option.text}
                      onChange={(e) => handleOptionChange(option.id, "text", e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      fullWidth
                      size="small"
                      required
                      disabled={currentQuestion.type === "TRUE_FALSE"}
                    />
                    {currentQuestion.type === "MULTIPLE_CHOICE" &&
                      currentQuestion.options.length > 2 && (
                        <IconButton onClick={() => removeOption(option.id)} color="error" size="small">
                          <DeleteIcon />
                        </IconButton>
                      )}
                  </Box>
                ))}
              </RadioGroup>
            </FormControl>
            {currentQuestion.type === "TRUE_FALSE" && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                For True/False questions, options are fixed as "True" and "False"
              </Typography>
            )}
          </Box>
        </Box>
        {questions.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Added Questions ({questions.length})
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {questions.map((question, index) => (
              <Paper elevation={1} key={question.id} sx={{ mb: 2, p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {question.isCodeQuestion && <CodeIcon sx={{ mr: 1, color: "primary.main" }} />}
                  <Typography variant="subtitle1" fontWeight="bold">
                    Question {index + 1}: {question.text.substring(0, 60)}
                    {question.text.length > 60 ? "..." : ""}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 1 }}>
                  {question.type === "MULTIPLE_CHOICE" ? "Multiple Choice" : "True/False"}
                  • {question.marks} mark{question.marks !== 1 ? "s" : ""}
                  {question.isCodeQuestion && " • Contains Code"}
                </Typography>
                {question.isCodeQuestion && (
                  <Paper sx={{ mt: 2, mb: 2, p: 2, backgroundColor: "#f5f5f5", fontFamily: "monospace", overflow: "auto" }}>
                    <pre style={{ margin: 0 }}>{question.codeSnippet}</pre>
                  </Paper>
                )}
                <Box sx={{ mt: 2 }}>
                  {question.options.map((option) => (
                    <Box key={option.id} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Radio checked={option.isCorrect} disabled size="small" sx={{ mr: 1 }} />
                      <Typography variant="body2" color={option.isCorrect ? "success.main" : "text.primary"} fontWeight={option.isCorrect ? 500 : 400}>
                        {option.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={addQuestion} variant="outlined" disabled={!currentQuestion.text.trim()}>
          Add Question
        </Button>
        <Button onClick={saveAllQuestions} variant="contained" color="primary" disabled={questions.length === 0 && !currentQuestion.text.trim()}>
          Save All Questions
        </Button>
      </DialogActions>
    </Dialog>
  );
};
