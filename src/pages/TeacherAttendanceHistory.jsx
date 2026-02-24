import { useState, useEffect } from "react";
import axios from "axios";

const TeacherAttendanceHistory = () => {
  const [date, setDate] = useState("");
  const [sessionType, setSessionType] = useState("morning");
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [classroom, setClassroom] = useState(null);

  const token = localStorage.getItem("accessToken");

  // 🔹 Fetch classroom automatically when page loads
  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/my-classroom/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClassroom(res.data);
      } catch (error) {
        console.error("Error fetching classroom:", error);
      }
    };

    fetchClassroom();
  }, [token]);

  const fetchAttendance = async () => {
    if (!date) {
      alert("Please select a date");
      return;
    }

    if (!classroom) {
      alert("Classroom not loaded yet");
      return;
    }

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/attendance/history/?classroom=${classroom.id}&date=${date}&session_type=${sessionType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecords(res.data.records);

      const total = res.data.records.length;
      const present = res.data.records.filter(
        (r) => r.status === "present"
      ).length;
      const absent = total - present;
      const percentage =
        total > 0 ? ((present / total) * 100).toFixed(1) : 0;

      setSummary({ total, present, absent, percentage });
    } catch (error) {
      console.error(error.response?.data);
      alert(error.response?.data?.error || "No attendance found");
      setRecords([]);
      setSummary(null);
    }
  };

  return (
    <div>
      <h2>Attendance History</h2>

      <div style={{ marginBottom: "15px" }}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <select
          value={sessionType}
          onChange={(e) => setSessionType(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
        </select>

        <button
          onClick={fetchAttendance}
          style={{ marginLeft: "10px" }}
        >
          View Attendance
        </button>
      </div>

      {summary && (
        <div style={{ marginBottom: "20px" }}>
          <p>Total Students: {summary.total}</p>
          <p>Present: {summary.present}</p>
          <p>Absent: {summary.absent}</p>
          <p>Attendance Rate: {summary.percentage}%</p>
        </div>
      )}

      {records.length > 0 && (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Admission No</th>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.student}</td>
                <td>{record.student_name}</td>
                <td>{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeacherAttendanceHistory;