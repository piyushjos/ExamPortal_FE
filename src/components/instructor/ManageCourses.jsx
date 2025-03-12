import React from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";

function ManageCourses({ courses, onCourseClick }) {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        My Courses
      </Typography>
      {courses.length === 0 ? (
        <Typography>No courses found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card sx={{ cursor: "pointer" }} onClick={() => onCourseClick(course)}>
                <CardContent>
                  <Typography variant="h6">{course.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.description}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Enrolled: {course.enrolledStudents ? course.enrolledStudents.length : 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default ManageCourses;
