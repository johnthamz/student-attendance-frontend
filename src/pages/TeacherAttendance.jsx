import { useEffect, useState } from "react";
import axios from "axios";

function TeacherAttendance() {
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState("");
  const [sessionType, setSessionType] = useState("morning");
  const [attendanceData, setAttendanceData] = useState({});

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchMyClassroom();
  }, []);

  // ===============================
  // Fetch Teacher's Assigned Classroom
  // ===============================
  const fetchMyClassroom = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/my-classroom/",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setClassroom(res.data);
      fetchStudents(res.data.id);

    } catch (error) {
      console.error("Error fetching teacher classroom:", error.response?.data);
    }
  };

  // ===============================
  // Fetch Students (Enrollment Based)
  // ===============================
  const fetchStudents = async (classroomId) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/enrollments/?classroom=${classroomId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Transform enrollment data properly
      const formattedStudents = res.data.map((enroll) => ({
        admission_number: enroll.student,
        name: enroll.student_name
      }));

      setStudents(formattedStudents);

      const initialAttendance = {};
      formattedStudents.forEach((student) => {
        initialAttendance[student.admission_number] = "present";
      });

      setAttendanceData(initialAttendance);

    } catch (error) {
      console.error("Error fetching students:", error.response?.data);
    }
  };

  // ===============================
  // Handle Attendance Change
  // ===============================
  const handleMarkChange = (admissionNumber, status) => {
    setAttendanceData({
      ...attendanceData,
      [admissionNumber]: status,
    });
  };

  // ===============================
  // Submit Attendance
  // ===============================
  const handleSubmitAttendance = async () => {
    try {
      const sessionRes = await axios.post(
        "http://127.0.0.1:8000/api/attendance-sessions/",
        {
          classroom: classroom.id,
          date,
          session_type: sessionType,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sessionId = sessionRes.data.id;

      const records = students.map((student) => ({
        student: student.admission_number,
        status: attendanceData[student.admission_number],
      }));

      await axios.post(
        "http://127.0.0.1:8000/api/attendance/bulk/",
        {
          session: sessionId,
          records,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Attendance recorded successfully!");
      setStudents([]);

    } catch (error) {
      console.error("Attendance error:", error.response?.data);
    }
  };

  return (
    <div>
      <h3>Record Attendance</h3>

      {classroom && (
        <h4>
          Class: {classroom.level} - {classroom.name}
        </h4>
      )}

      <div style={{ marginBottom: "20px" }}>
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
      </div>

      {students.length > 0 && (
        <>
          <table border="1" cellPadding="10">
            <thead>
              <tr>
                <th>Admission No</th>
                <th>Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.admission_number}>
                  <td>{student.admission_number}</td>
                  <td>{student.name}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleMarkChange(student.admission_number, "present")
                      }
                      style={{
                        backgroundColor:
                          attendanceData[student.admission_number] === "present"
                            ? "green"
                            : "#ccc",
                        color: "white",
                        marginRight: "5px",
                        padding: "5px 10px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Present
                    </button>

                    <button
                      onClick={() =>
                        handleMarkChange(student.admission_number, "absent")
                      }
                      style={{
                        backgroundColor:
                          attendanceData[student.admission_number] === "absent"
                            ? "red"
                            : "#ccc",
                        color: "white",
                        padding: "5px 10px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Absent
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleSubmitAttendance}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Submit Attendance
          </button>
        </>
      )}
    </div>
  );
}

export default TeacherAttendance;