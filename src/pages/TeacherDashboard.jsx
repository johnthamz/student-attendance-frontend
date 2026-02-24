import { Link } from "react-router-dom";

function TeacherDashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h3>Teacher Dashboard</h3>
      <p>Welcome, Teacher. Mark attendance and view your classes.</p>

      <div style={{ marginTop: "20px" }}>
        <Link to="/teacher/history">
          <button>View Attendance History</button>
        </Link>
      </div>
    </div>
  );
}

export default TeacherDashboard;
