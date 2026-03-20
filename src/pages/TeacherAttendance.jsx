import { useEffect, useState } from "react";
import axios from "axios";

function TeacherAttendance() {
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState("");
  const [sessionType, setSessionType] = useState("morning");
  const [attendanceData, setAttendanceData] = useState({});
  const [attendanceMeta, setAttendanceMeta] = useState({});
  const [editingMode, setEditingMode] = useState(false);
  const [locked, setLocked] = useState(false);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchMyClassroom();
  }, []);

  // Reset editing & lock when date/session changes
  useEffect(() => {
    setLocked(false);
    setEditingMode(false);
    setAttendanceMeta({});
  }, [date, sessionType]);

  // =====================================
  // FETCH CLASSROOM
  // =====================================
  const fetchMyClassroom = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/my-classroom/",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setClassroom(res.data);
      fetchStudents(res.data.id);
    } catch (error) {
      console.error("Error fetching classroom:", error.response?.data);
    }
  };

  // =====================================
  // FETCH STUDENTS
  // =====================================
  const fetchStudents = async (classroomId) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/enrollments/?classroom=${classroomId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

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

  // =====================================
  // HANDLE MARK CHANGE
  // =====================================
  const handleMarkChange = (admissionNumber, status) => {
    setAttendanceData({
      ...attendanceData,
      [admissionNumber]: status,
    });
  };

  // =====================================
  // LOAD EXISTING SESSION (WITH AUDIT)
  // =====================================
  const getExistingSession = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/attendance/history/?classroom=${classroom.id}&date=${date}&session_type=${sessionType}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditingMode(true);

      const existingRecords = {};
      const metaRecords = {};

      res.data.records.forEach((record) => {
        existingRecords[record.student] = record.status;

        metaRecords[record.student] = {
          updated_at: record.updated_at,
          marked_by: record.marked_by_username,
        };
      });

      setAttendanceData(existingRecords);
      setAttendanceMeta(metaRecords);

      return res.data.session_id;

    } catch (error) {
      return null;
    }
  };

  // =====================================
  // SUBMIT OR UPDATE
  // =====================================
  const handleSubmitAttendance = async () => {
    if (!date) {
      alert("Please select date first.");
      return;
    }

    let sessionId;

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

      sessionId = sessionRes.data.id;
      setEditingMode(false);

    } catch (error) {
      sessionId = await getExistingSession();

      if (!sessionId) {
        alert("Unable to create or retrieve session.");
        return;
      }
    }

    const records = students.map((student) => ({
      student: student.admission_number,
      status: attendanceData[student.admission_number],
    }));

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/attendance/bulk/",
        {
          session: sessionId,
          records,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(
        editingMode
          ? "Attendance updated successfully!"
          : "Attendance recorded successfully!"
      );

    } catch (error) {
      if (error.response?.status === 403) {
        setLocked(true);
      }

      alert(error.response?.data?.error || "Error updating attendance");
    }
  };

  return (
    <div>
      <h3>Record / Edit Attendance</h3>

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
          {/* Editing Banner */}
          {editingMode && (
            <div
              style={{
                backgroundColor: "#fef3c7",
                border: "1px solid #f59e0b",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "6px",
                color: "#92400e",
                fontWeight: "bold",
              }}
            >
              Editing existing session for {date} ({sessionType})
            </div>
          )}

          {/* Lock Banner */}
          {locked && (
            <div
              style={{
                backgroundColor: "#fee2e2",
                border: "1px solid #dc2626",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "6px",
                color: "#7f1d1d",
                fontWeight: "bold",
              }}
            >
              🔒 Editing locked. Attendance cannot be modified after 24 hours.
            </div>
          )}

          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Admission No</th>
                <th>Name</th>
                <th>Status</th>
                <th>Last Modified By</th>
                <th>Last Modified At</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const meta = attendanceMeta[student.admission_number];

                return (
                  <tr key={student.admission_number}>
                    <td>{student.admission_number}</td>
                    <td>{student.name}</td>
                    <td>
                      <button
                        disabled={locked}
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
                          cursor: locked ? "not-allowed" : "pointer",
                        }}
                      >
                        Present
                      </button>

                      <button
                        disabled={locked}
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
                          cursor: locked ? "not-allowed" : "pointer",
                        }}
                      >
                        Absent
                      </button>
                    </td>

                    <td>{meta?.marked_by || "-"}</td>
                    <td>
                      {meta?.updated_at
                        ? new Date(meta.updated_at).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <button
            onClick={handleSubmitAttendance}
            disabled={locked}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: locked
                ? "#9ca3af"
                : editingMode
                ? "#f59e0b"
                : "#2563eb",
              color: "white",
              border: "none",
              cursor: locked ? "not-allowed" : "pointer",
            }}
          >
            {editingMode ? "Update Attendance" : "Submit Attendance"}
          </button>
        </>
      )}
    </div>
  );
}

export default TeacherAttendance;