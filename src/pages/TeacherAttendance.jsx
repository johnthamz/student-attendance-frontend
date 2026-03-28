import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

function TeacherAttendance() {
  const token = localStorage.getItem("accessToken");

  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState("");
  const [sessionType, setSessionType] = useState("morning");
  const [attendanceData, setAttendanceData] = useState({});
  const [editingMode, setEditingMode] = useState(false);
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    setLocked(false);
    setEditingMode(false);

    if (students.length > 0) {
      const resetData = {};
      students.forEach((student) => {
        resetData[student.admission_number] = "present";
      });
      setAttendanceData(resetData);
    }
  }, [date, sessionType, students]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setPageError("");

      const classroomRes = await axios.get(`${API_BASE}/my-classroom/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClassroom(classroomRes.data);

      const studentsRes = await axios.get(
        `${API_BASE}/enrollments/?classroom=${classroomRes.data.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const formattedStudents = studentsRes.data.map((enroll) => ({
        admission_number: enroll.student,
        name: enroll.student_name,
      }));

      setStudents(formattedStudents);

      const initialAttendance = {};
      formattedStudents.forEach((student) => {
        initialAttendance[student.admission_number] = "present";
      });
      setAttendanceData(initialAttendance);
    } catch (error) {
      setPageError(
        error.response?.data?.error ||
          "Unable to load your classroom and learners."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadExistingSession = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/attendance/history/?classroom=${classroom.id}&date=${date}&session_type=${sessionType}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const existingRecords = {};
      res.data.records.forEach((record) => {
        existingRecords[record.student] = record.status;
      });

      setAttendanceData(existingRecords);
      setEditingMode(true);

      return res.data.session_id;
    } catch {
      return null;
    }
  };

  const handleMarkChange = (admissionNumber, status) => {
    if (locked) return;

    setAttendanceData((prev) => ({
      ...prev,
      [admissionNumber]: status,
    }));
  };

  const handleMarkAll = (status) => {
    if (locked) return;

    const updated = {};
    students.forEach((student) => {
      updated[student.admission_number] = status;
    });
    setAttendanceData(updated);
  };

  const handleSubmitAttendance = async () => {
    if (!date) {
      alert("Please select date first.");
      return;
    }

    if (!classroom) {
      alert("Classroom not loaded.");
      return;
    }

    setSaving(true);

    let sessionId;
    let isEditingFlow = false;

    try {
      const sessionRes = await axios.post(
        `${API_BASE}/attendance-sessions/`,
        {
          classroom: classroom.id,
          date,
          session_type: sessionType,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      sessionId = sessionRes.data.id;
      setEditingMode(false);
    } catch {
      sessionId = await loadExistingSession();
      isEditingFlow = true;

      if (!sessionId) {
        setSaving(false);
        alert("Unable to create or retrieve session.");
        return;
      }
    }

    const records = students.map((student) => ({
      student: student.admission_number,
      status: attendanceData[student.admission_number] || "present",
    }));

    try {
      await axios.post(
        `${API_BASE}/attendance/bulk/`,
        {
          session: sessionId,
          records,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEditingMode(isEditingFlow);
      alert(
        isEditingFlow
          ? "Attendance updated successfully!"
          : "Attendance recorded successfully!"
      );
    } catch (error) {
      if (error.response?.status === 403) {
        setLocked(true);
      }

      alert(error.response?.data?.error || "Error updating attendance.");
    } finally {
      setSaving(false);
    }
  };

  const summary = useMemo(() => {
    const total = students.length;
    const present = students.filter(
      (student) => attendanceData[student.admission_number] === "present"
    ).length;
    const absent = total - present;
    const rate = total > 0 ? ((present / total) * 100).toFixed(1) : "0.0";

    return { total, present, absent, rate };
  }, [students, attendanceData]);

  if (loading) {
    return <div style={styles.loadingCard}>Loading attendance workspace...</div>;
  }

  if (pageError) {
    return <div style={styles.errorCard}>{pageError}</div>;
  }

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div>
          <p style={styles.eyebrow}>Teacher Attendance</p>
          <h2 style={styles.title}>Mark Attendance</h2>
          <p style={styles.subtitle}>
            Record morning or afternoon attendance in a cleaner and more
            professional layout.
          </p>
        </div>

        {classroom && (
          <div style={styles.classBadge}>
            {classroom.level} - {classroom.name}
          </div>
        )}
      </section>

      <section style={styles.statsGrid}>
        <SummaryCard label="Total Students" value={summary.total} />
        <SummaryCard label="Present" value={summary.present} />
        <SummaryCard label="Absent" value={summary.absent} />
        <SummaryCard label="Attendance Rate" value={`${summary.rate}%`} />
      </section>

      <section style={styles.filterCard}>
        <div style={styles.filterHeader}>
          <div>
            <h3 style={styles.sectionTitle}>Attendance Session</h3>
            <p style={styles.sectionText}>
              Select the date and session, then mark each learner present or
              absent.
            </p>
          </div>

          <div style={styles.bulkActions}>
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={() => handleMarkAll("present")}
              disabled={locked}
            >
              Mark All Present
            </button>

            <button
              type="button"
              style={styles.secondaryButton}
              onClick={() => handleMarkAll("absent")}
              disabled={locked}
            >
              Mark All Absent
            </button>
          </div>
        </div>

        <div style={styles.filterGrid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Class</label>
            <div style={styles.readonlyField}>
              {classroom ? `${classroom.level} - ${classroom.name}` : "-"}
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Session</label>
            <select
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
              style={styles.input}
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
            </select>
          </div>
        </div>

        {editingMode && (
          <div style={styles.warningBanner}>
            Editing an existing attendance session for {date} ({sessionType}).
          </div>
        )}

        {locked && (
          <div style={styles.lockBanner}>
            Editing is locked. Attendance cannot be modified after 24 hours.
          </div>
        )}
      </section>

      <section style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <div>
            <h3 style={styles.sectionTitle}>Class Register</h3>
            <p style={styles.sectionText}>
              Use the pill buttons to mark each learner.
            </p>
          </div>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Admission No</th>
                <th style={styles.th}>Learner Name</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student, index) => {
                const currentStatus =
                  attendanceData[student.admission_number] || "present";

                return (
                  <tr key={student.admission_number} style={styles.tr}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.tdStrong}>{student.admission_number}</td>
                    <td style={styles.td}>{student.name}</td>
                    <td style={styles.td}>
                      <div style={styles.toggleWrap}>
                        <button
                          type="button"
                          disabled={locked}
                          onClick={() =>
                            handleMarkChange(student.admission_number, "present")
                          }
                          style={{
                            ...styles.toggleButton,
                            ...(currentStatus === "present"
                              ? styles.presentActive
                              : styles.inactiveToggle),
                            ...(locked ? styles.disabledButton : {}),
                          }}
                        >
                          Present
                        </button>

                        <button
                          type="button"
                          disabled={locked}
                          onClick={() =>
                            handleMarkChange(student.admission_number, "absent")
                          }
                          style={{
                            ...styles.toggleButton,
                            ...(currentStatus === "absent"
                              ? styles.absentActive
                              : styles.inactiveToggle),
                            ...(locked ? styles.disabledButton : {}),
                          }}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={styles.submitRow}>
          <button
            onClick={handleSubmitAttendance}
            disabled={locked || saving}
            style={{
              ...styles.primaryButton,
              ...(locked || saving ? styles.disabledPrimary : {}),
            }}
          >
            {saving
              ? "Saving..."
              : editingMode
              ? "Update Attendance"
              : "Submit Attendance"}
          </button>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div style={styles.summaryCard}>
      <p style={styles.summaryLabel}>{label}</p>
      <h3 style={styles.summaryValue}>{value}</h3>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  },
  hero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap",
    background: "linear-gradient(135deg, #ffffff, #f8fbff)",
    border: "1px solid #e2e8f0",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
  },
  eyebrow: {
    margin: "0 0 6px",
    color: "#2563eb",
    fontWeight: 800,
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  title: {
    margin: "0 0 8px",
    fontSize: "2rem",
    fontWeight: 800,
    color: "#0f172a",
  },
  subtitle: {
    margin: 0,
    color: "#475569",
    lineHeight: 1.7,
    maxWidth: "720px",
  },
  classBadge: {
    padding: "12px 18px",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #dbeafe, #eff6ff)",
    color: "#1d4ed8",
    fontWeight: 800,
    border: "1px solid #bfdbfe",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  summaryCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)",
  },
  summaryLabel: {
    margin: "0 0 10px",
    color: "#64748b",
    fontWeight: 700,
    fontSize: "0.95rem",
  },
  summaryValue: {
    margin: 0,
    color: "#0f172a",
    fontSize: "2rem",
    fontWeight: 800,
  },
  filterCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.05)",
  },
  filterHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "18px",
  },
  sectionTitle: {
    margin: "0 0 6px",
    fontSize: "1.2rem",
    fontWeight: 800,
    color: "#0f172a",
  },
  sectionText: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.65,
  },
  filterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontWeight: 700,
    color: "#334155",
    fontSize: "0.95rem",
  },
  input: {
    height: "48px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    padding: "0 14px",
    fontSize: "0.98rem",
    outline: "none",
    background: "#f8fafc",
    color: "#0f172a",
  },
  readonlyField: {
    minHeight: "48px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    padding: "12px 14px",
    fontSize: "0.98rem",
    background: "#f8fafc",
    color: "#0f172a",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
  },
  bulkActions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  secondaryButton: {
    border: "1px solid #cbd5e1",
    background: "#f8fafc",
    color: "#0f172a",
    borderRadius: "14px",
    padding: "12px 16px",
    fontWeight: 700,
    cursor: "pointer",
  },
  warningBanner: {
    marginTop: "18px",
    background: "#fffbeb",
    border: "1px solid #f59e0b",
    color: "#92400e",
    padding: "14px 16px",
    borderRadius: "16px",
    fontWeight: 700,
  },
  lockBanner: {
    marginTop: "18px",
    background: "#fef2f2",
    border: "1px solid #dc2626",
    color: "#991b1b",
    padding: "14px 16px",
    borderRadius: "16px",
    fontWeight: 700,
  },
  tableCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.05)",
  },
  tableHeader: {
    marginBottom: "18px",
  },
  tableWrapper: {
    width: "100%",
    overflowX: "auto",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    minWidth: "760px",
    background: "#ffffff",
  },
  th: {
    textAlign: "left",
    padding: "16px",
    background: "#eff6ff",
    color: "#1e3a8a",
    fontSize: "0.92rem",
    fontWeight: 800,
    borderBottom: "1px solid #dbeafe",
  },
  tr: {
    borderBottom: "1px solid #e2e8f0",
  },
  td: {
    padding: "16px",
    borderBottom: "1px solid #eef2f7",
    color: "#334155",
    verticalAlign: "middle",
  },
  tdStrong: {
    padding: "16px",
    borderBottom: "1px solid #eef2f7",
    color: "#0f172a",
    fontWeight: 800,
    verticalAlign: "middle",
  },
  toggleWrap: {
    display: "inline-flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  toggleButton: {
    padding: "10px 18px",
    borderRadius: "999px",
    border: "1px solid transparent",
    cursor: "pointer",
    fontWeight: 800,
    transition: "all 0.2s ease",
  },
  presentActive: {
    background: "linear-gradient(135deg, #16a34a, #15803d)",
    color: "#ffffff",
    boxShadow: "0 10px 24px rgba(22, 163, 74, 0.22)",
  },
  absentActive: {
    background: "linear-gradient(135deg, #dc2626, #b91c1c)",
    color: "#ffffff",
    boxShadow: "0 10px 24px rgba(220, 38, 38, 0.22)",
  },
  inactiveToggle: {
    background: "#f8fafc",
    color: "#475569",
    border: "1px solid #cbd5e1",
  },
  submitRow: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "flex-end",
  },
  primaryButton: {
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#ffffff",
    borderRadius: "16px",
    padding: "14px 24px",
    fontWeight: 800,
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "0 14px 28px rgba(37, 99, 235, 0.2)",
  },
  disabledPrimary: {
    background: "#94a3b8",
    boxShadow: "none",
    cursor: "not-allowed",
  },
  disabledButton: {
    cursor: "not-allowed",
    opacity: 0.7,
  },
  loadingCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "24px",
    color: "#334155",
    fontWeight: 700,
  },
  errorCard: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "20px",
    padding: "24px",
    color: "#991b1b",
    fontWeight: 700,
  },
};

export default TeacherAttendance;