import { useMemo, useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

const TeacherAttendanceHistory = () => {
  const [date, setDate] = useState("");
  const [sessionType, setSessionType] = useState("morning");
  const [records, setRecords] = useState([]);
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentHistory, setStudentHistory] = useState([]);
  const [studentHistorySummary, setStudentHistorySummary] = useState(null);
  const [studentHistoryLoading, setStudentHistoryLoading] = useState(false);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        setPageLoading(true);
        const res = await axios.get(`${API_BASE}/my-classroom/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClassroom(res.data);
      } catch (error) {
        setPageError(
          error.response?.data?.error || "Unable to load teacher classroom."
        );
      } finally {
        setPageLoading(false);
      }
    };

    fetchClassroom();
  }, [token]);

  const fetchAttendance = async () => {
    if (!date) {
      alert("Please select a date.");
      return;
    }

    if (!classroom) {
      alert("Classroom not loaded yet.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `${API_BASE}/attendance/history/?classroom=${classroom.id}&date=${date}&session_type=${sessionType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecords(res.data.records || []);
    } catch (error) {
      alert(error.response?.data?.error || "No attendance found.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewStudent = async (record) => {
    if (!classroom) return;

    try {
      setDetailOpen(true);
      setSelectedStudent(record);
      setStudentHistoryLoading(true);

      const res = await axios.get(
        `${API_BASE}/teacher/attendance/student-detail/?classroom=${classroom.id}&student=${record.student}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStudentHistory(res.data.history || []);
      setStudentHistorySummary(res.data.summary || null);
    } catch (error) {
      alert(
        error.response?.data?.error ||
          "Unable to load student attendance details."
      );
      setStudentHistory([]);
      setStudentHistorySummary(null);
    } finally {
      setStudentHistoryLoading(false);
    }
  };

  const summary = useMemo(() => {
    const total = records.length;
    const present = records.filter((r) => r.status === "present").length;
    const absent = total - present;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : "0.0";

    return { total, present, absent, percentage };
  }, [records]);

  if (pageLoading) {
    return <div style={styles.loadingCard}>Loading attendance history...</div>;
  }

  if (pageError) {
    return <div style={styles.errorCard}>{pageError}</div>;
  }

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div>
          <p style={styles.eyebrow}>Teacher Attendance</p>
          <h2 style={styles.title}>View Attendance</h2>
          <p style={styles.subtitle}>
            Review attendance for a selected date and session, then inspect an
            individual learner’s attendance using the eye action.
          </p>
        </div>

        {classroom && (
          <div style={styles.classBadge}>
            {classroom.level} - {classroom.name}
          </div>
        )}
      </section>

      <section style={styles.filterCard}>
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

          <div style={styles.inputGroup}>
            <label style={styles.label}>&nbsp;</label>
            <button style={styles.primaryButton} onClick={fetchAttendance}>
              {loading ? "Loading..." : "View Attendance"}
            </button>
          </div>
        </div>
      </section>

      <section style={styles.statsGrid}>
        <SummaryCard label="Total Students" value={summary.total} />
        <SummaryCard label="Present" value={summary.present} />
        <SummaryCard label="Absent" value={summary.absent} />
        <SummaryCard label="Attendance Rate" value={`${summary.percentage}%`} />
      </section>

      <section style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <div>
            <h3 style={styles.sectionTitle}>Attendance Register</h3>
            <p style={styles.sectionText}>
              Open learner detail to inspect the full attendance history for the
              selected class.
            </p>
          </div>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Admission No</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td style={styles.emptyCell} colSpan={5}>
                    No attendance records loaded yet.
                  </td>
                </tr>
              ) : (
                records.map((record, index) => (
                  <tr key={record.id}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.tdStrong}>{record.student}</td>
                    <td style={styles.td}>{record.student_name}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          ...(record.status === "present"
                            ? styles.presentBadge
                            : styles.absentBadge),
                        }}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button
                        type="button"
                        style={styles.eyeButton}
                        onClick={() => handleViewStudent(record)}
                        title="View learner attendance"
                      >
                        👁
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {detailOpen && (
        <div style={styles.modalOverlay} onClick={() => setDetailOpen(false)}>
          <div
            style={styles.modalCard}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div style={styles.modalHeader}>
              <div>
                <h3 style={styles.modalTitle}>
                  {selectedStudent?.student_name || "Learner Detail"}
                </h3>
                <p style={styles.modalSubtitle}>
                  Admission No: {selectedStudent?.student || "-"}
                </p>
              </div>

              <button
                type="button"
                style={styles.modalClose}
                onClick={() => setDetailOpen(false)}
              >
                ✕
              </button>
            </div>

            {studentHistoryLoading ? (
              <div style={styles.loadingCard}>Loading learner history...</div>
            ) : (
              <>
                {studentHistorySummary && (
                  <div style={styles.modalStats}>
                    <SummaryCard
                      label="Total Sessions"
                      value={studentHistorySummary.total_sessions}
                    />
                    <SummaryCard
                      label="Present"
                      value={studentHistorySummary.present_count}
                    />
                    <SummaryCard
                      label="Absent"
                      value={studentHistorySummary.absent_count}
                    />
                    <SummaryCard
                      label="Rate"
                      value={`${studentHistorySummary.attendance_percentage}%`}
                    />
                  </div>
                )}

                <div style={styles.modalTableWrap}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Date</th>
                        <th style={styles.th}>Session</th>
                        <th style={styles.th}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentHistory.length === 0 ? (
                        <tr>
                          <td style={styles.emptyCell} colSpan={3}>
                            No learner history found.
                          </td>
                        </tr>
                      ) : (
                        studentHistory.map((item, idx) => (
                          <tr key={`${item.date}-${item.session_type}-${idx}`}>
                            <td style={styles.td}>{item.date}</td>
                            <td style={styles.td}>{item.session_type}</td>
                            <td style={styles.td}>
                              <span
                                style={{
                                  ...styles.statusBadge,
                                  ...(item.status === "present"
                                    ? styles.presentBadge
                                    : styles.absentBadge),
                                }}
                              >
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

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
  filterCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.05)",
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
    minHeight: "48px",
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
    minWidth: "680px",
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
  td: {
    padding: "16px",
    borderBottom: "1px solid #eef2f7",
    color: "#334155",
  },
  tdStrong: {
    padding: "16px",
    borderBottom: "1px solid #eef2f7",
    color: "#0f172a",
    fontWeight: 800,
  },
  emptyCell: {
    padding: "24px",
    textAlign: "center",
    color: "#64748b",
    fontWeight: 700,
  },
  statusBadge: {
    display: "inline-flex",
    padding: "8px 14px",
    borderRadius: "999px",
    fontWeight: 800,
    fontSize: "0.88rem",
    textTransform: "capitalize",
  },
  presentBadge: {
    background: "#dcfce7",
    color: "#166534",
  },
  absentBadge: {
    background: "#fee2e2",
    color: "#991b1b",
  },
  eyeButton: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    background: "#f8fafc",
    cursor: "pointer",
    fontSize: "1rem",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    zIndex: 999,
  },
  modalCard: {
    width: "100%",
    maxWidth: "980px",
    background: "#ffffff",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 30px 60px rgba(15, 23, 42, 0.24)",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "center",
    marginBottom: "18px",
  },
  modalTitle: {
    margin: "0 0 6px",
    fontSize: "1.4rem",
    color: "#0f172a",
    fontWeight: 800,
  },
  modalSubtitle: {
    margin: 0,
    color: "#64748b",
  },
  modalClose: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    cursor: "pointer",
    fontWeight: 800,
  },
  modalStats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
    marginBottom: "18px",
  },
  modalTableWrap: {
    width: "100%",
    overflowX: "auto",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
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

export default TeacherAttendanceHistory;