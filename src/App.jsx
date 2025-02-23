import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import Login from "./pages/Login";
import AdminDashboard from "./component/Admin /AdminDashboard";
import StudentDashBoard from "./component/Student/StudentDashBoard";
import InstructorDashboard from "./component/instructor/InstructorDashBoard";

const root = document.getElementById("root");

function App() {
  return (
    <BrowserRouter>
      <InstructorDashboard />
      {/* <StudentDashBoard/> */}
      {/* <AdminDashboard/>  */}
      {/* <Login /> */}
    </BrowserRouter>
  );
}

// ✅ Render the app outside the App function
ReactDOM.createRoot(root).render(<App />);

export default App;
