import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

function TeacherAttendanceAnalytics() {
  const token = localStorage.getItem("accessToken");

  const today = new Date().toISOString().split("T")[0];
  const monthAgo = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const [classroom, setClassroom] = useState(null);
  const [gender, setGender] = useState("");
  const [startDate, setStartDate] = useState(monthAgo);
  const [endDate, setEndDate] = useState(today);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    fetchClassroomAndAnalytics();
  }, []);

  const fetchClassroomAndAnalytics = async () => {
    try {
      setLoading(true);
      setPageError("");

      const classroomRes = await axios.get(`${API_BASE}/my-classroom/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClassroom(classroomRes.data);

      await fetchAnalytics(classroomRes.data.id, gender, startDate, endDate);
    } catch (error) {
      setPageError(
        error.response?.data?.error || "Unable to load attendance analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async (
    classroomId = classroom?.id,
    selectedGender = gender,
    selectedStartDate = startDate,
    selectedEndDate = endDate
  ) => {
    if (!classroomId) return;

    try {
      setLoading(true);

      const params = new URLSearchParams({
        classroom: classroomId,
        start_date: selectedStartDate,
        end_date: selectedEndDate,
      });

      if (selectedGender) {
        params.append("gender", selectedGender);
      }

      const res = await axios.get(
        `${API_BASE}/teacher/attendance/analytics/?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAnalytics(res.data);
    } catch (error) {
      setPageError(
        error.response?.data?.error || "Unable to fetch analytics data."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchAnalytics(classroom?.id, gender, startDate, endDate);
  };

  const topRiskStudents = useMemo(() => {
    return analytics?.students_at_risk?.slice(0, 10) || [];
  }, [analytics]);

  if (loading && !analytics) {
    return <div style={styles.loadingCard}>Loading analytics...</div>;
  }

  if (pageError && !analytics) {
    return <div style={styles.errorCard}>{pageError}</div>;
  }

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div>
          <p style={styles.eyebrow}>Teacher Attendance</p>
          <h2 style={styles.title}>Analytics</h2>
          <p style={styles.subtitle}>
            Review class trends, attendance summaries, and learners needing
            attention across a selected period.
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
            <label style={styles.label}>Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={styles.input}
            >
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>&nbsp;</label>
            <button onClick={handleFilter} style={styles.primaryButton}>
              Apply Filters
            </button>
          </div>
        </div>
      </section>

      {analytics && (
        <>
          <section style={styles.statsGrid}>
            <SummaryCard
              label="Overall Attendance"
              value={`${analytics.overall_attendance_percentage}%`}
            />
            <SummaryCard
              label="Present Records"
              value={analytics.present_count}
            />
            <SummaryCard
              label="Absent Records"
              value={analytics.absent_count}
            />
            <SummaryCard
              label="Students At Risk"
              value={analytics.students_at_risk_count}
            />
          </section>

          <section style={styles.statsGrid}>
            <SummaryCard
              label="Total Enrollment"
              value={analytics.total_enrollment}
            />
            <SummaryCard label="Male" value={analytics.total_male_enrollment} />
            <SummaryCard
              label="Female"
              value={analytics.total_female_enrollment}
            />
            <SummaryCard
              label="Sessions in Period"
              value={analytics.total_sessions}
            />
          </section>

          <section style={styles.chartGrid}>
            <div style={styles.chartCard}>
              <h3 style={styles.sectionTitle}>Daily Trend</h3>
              <SimpleBarChart
                data={analytics.daily_trend || []}
                labelKey="date"
                valueKey="percentage"
                suffix="%"
              />
            </div>

            <div style={styles.chartCard}>
              <h3 style={styles.sectionTitle}>Session Split</h3>
              <div style={styles.pillStats}>
                <MetricPill label="Morning Present" value={analytics.morning_present} />
                <MetricPill label="Morning Absent" value={analytics.morning_absent} />
                <MetricPill label="Afternoon Present" value={analytics.afternoon_present} />
                <MetricPill label="Afternoon Absent" value={analytics.afternoon_absent} />
              </div>
            </div>
          </section>

          <section style={styles.tableCard}>
            <div style={styles.tableHeader}>
              <div>
                <h3 style={styles.sectionTitle}>Learners Needing Attention</h3>
                <p style={styles.sectionText}>
                  These are learners below the attendance threshold in the
                  selected period.
                </p>
              </div>
            </div>

            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Admission No</th>
                    <th style={styles.th}>Learner Name</th>
                    <th style={styles.th}>Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {topRiskStudents.length === 0 ? (
                    <tr>
                      <td style={styles.emptyCell} colSpan={3}>
                        No at-risk learners found for the selected filters.
                      </td>
                    </tr>
                  ) : (
                    topRiskStudents.map((student) => (
                      <tr key={student.admission_number}>
                        <td style={styles.tdStrong}>{student.admission_number}</td>
                        <td style={styles.td}>{student.name}</td>
                        <td style={styles.td}>{student.attendance_percentage}%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
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

function MetricPill({ label, value }) {
  return (
    <div style={styles.metricPill}>
      <span style={styles.metricLabel}>{label}</span>
      <strong style={styles.metricValue}>{value}</strong>
    </div>
  );
}

function SimpleBarChart({ data, labelKey, valueKey, suffix = "" }) {
  if (!data.length) {
    return <div style={styles.chartEmpty}>No chart data for this period.</div>;
  }

  const maxValue = Math.max(...data.map((item) => Number(item[valueKey] || 0)), 1);

  return (
    <div style={styles.barChart}>
      {data.map((item, index) => {
        const value = Number(item[valueKey] || 0);
        const width = `${(value / maxValue) * 100}%`;

        return (
          <div key={`${item[labelKey]}-${index}`} style={styles.barRow}>
            <div style={styles.barTopRow}>
              <span style={styles.barLabel}>{item[labelKey]}</span>
              <span style={styles.barValue}>
                {value}
                {suffix}
              </span>
            </div>
            <div style={styles.barTrack}>
              <div style={{ ...styles.barFill, width }} />
            </div>
          </div>
        );
      })}
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
  chartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "18px",
  },
  chartCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.05)",
  },
  sectionTitle: {
    margin: "0 0 14px",
    fontSize: "1.2rem",
    fontWeight: 800,
    color: "#0f172a",
  },
  sectionText: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.65,
  },
  barChart: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  barRow: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  barTopRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    fontSize: "0.9rem",
    color: "#334155",
  },
  barLabel: {
    fontWeight: 700,
  },
  barValue: {
    fontWeight: 800,
  },
  barTrack: {
    width: "100%",
    height: "12px",
    background: "#e2e8f0",
    borderRadius: "999px",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    borderRadius: "999px",
  },
  chartEmpty: {
    color: "#64748b",
    fontWeight: 700,
  },
  pillStats: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },
  metricPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    background: "#f8fafc",
    border: "1px solid #cbd5e1",
    borderRadius: "999px",
    padding: "12px 16px",
  },
  metricLabel: {
    color: "#475569",
    fontWeight: 700,
  },
  metricValue: {
    color: "#0f172a",
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
    minWidth: "640px",
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

export default TeacherAttendanceAnalytics;