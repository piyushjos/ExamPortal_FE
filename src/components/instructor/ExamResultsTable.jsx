import React, { useState, useEffect } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, Typography, CircularProgress } from "@mui/material";
import api from "../../services/api";

function ExamResultsTable({ examId }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadResults();
  }, [examId]);

  const loadResults = async () => {
    try {
      setLoading(true);
      const data = await api.instructor.getExamResults(examId);
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load exam results");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (results.length === 0) return <Typography>No results found for this exam.</Typography>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Student Email</TableCell>
            <TableCell>Score</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.id}>
              <TableCell>{result.student.email}</TableCell>
              <TableCell>{result.score}</TableCell>
              <TableCell>{result.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ExamResultsTable;
