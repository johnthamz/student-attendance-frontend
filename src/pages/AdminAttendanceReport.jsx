import { useState, useEffect } from "react";
import axios from "axios";

function AdminAttendanceReport() {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState([]);

  const token = localStorage.getItem("accessToken");

  // ===============================
  // FETCH CLASSROOMS
  // ===============================
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/classrooms/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClassrooms(res.data);
      } catch (error) {
        console.error("Error fetching classrooms", error);
      }
    };

    fetchClassrooms();
  }, [token]);

  // ===============================
  // GENERATE REPORT
  // ===============================
  const generateReport = async () => {
    if (!selectedClass || !startDate || !endDate) {
      alert("Please select class and date range");
      return;
    }

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/reports/attendance/?classroom=${selectedClass}&start_date=${startDate}&end_date=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReportData(res.data);
    } catch (error) {
      console.error(error.response?.data);
      alert(error.response?.data?.error || "No report data found");
      setReportData([]);
    }
  };

  // ===============================
  // ANALYTICS CALCULATIONS
  // ===============================
  const totalStudents = reportData.length;

  const averageAttendance =
    totalStudents > 0
      ? (
          reportData.reduce(
            (sum, student) => sum + student.attendance_percentage,
            0
          ) / totalStudents
        ).toFixed(1)
      : 0;

  const lowAttendanceStudents = reportData.filter(
    (student) => student.low_attendance
  );

  // ===============================
  // UI
  // ===============================
  return (
    <div>
      <h2>Admin Attendance Report</h2>

      {/* ===== FILTER SECTION ===== */}
      <div style={{ marginBottom: "20px" }}>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select Class</option>
          {classrooms.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.level} - {cls.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ marginLeft: "10px" }}
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ marginLeft: "10px" }}
        />

        <button
          onClick={generateReport}
          style={{ marginLeft: "10px" }}
        >
          Generate Report
        </button>
      </div>

      {/* ===== SUMMARY SECTION ===== */}
      {totalStudents > 0 && (
        <div
          style={{
            backgroundColor: "#f3f4f6",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h4>Report Summary</h4>
          <p><strong>Total Students:</strong> {totalStudents}</p>
          <p><strong>Average Attendance:</strong> {averageAttendance}%</p>
          <p>
            <strong>Students Below 75%:</strong> {lowAttendanceStudents.length}
          </p>
        </div>
      )}

      {/* ===== FREQUENTLY ABSENT SECTION ===== */}
      {totalStudents > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h4>Frequently Absent Students (Below 75%)</h4>

          {lowAttendanceStudents.length === 0 ? (
            <p style={{ color: "green" }}>
              No students below 75% attendance.
            </p>
          ) : (
            <ul>
              {lowAttendanceStudents.map((student) => (
                <li key={student.student_id}>
                  {student.student_name} —{" "}
                  {student.attendance_percentage}%
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ===== FULL REPORT TABLE ===== */}
      {totalStudents > 0 && (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Total Sessions</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((student) => (
              <tr
                key={student.student_id}
                style={{
                  backgroundColor: student.low_attendance
                    ? "#fee2e2"
                    : "transparent",
                }}
              >
                <td>{student.student_name}</td>
                <td>{student.total_sessions}</td>
                <td>{student.present}</td>
                <td>{student.absent}</td>
                <td>{student.attendance_percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminAttendanceReport;