import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import dashboardBg from "../assets/dashboard-bg.png";

function AdminDashboard() {
  const token = localStorage.getItem("accessToken");

  const [analytics, setAnalytics] = useState(null);
  const [teacherCount, setTeacherCount] = useState(0);
  const [classCount, setClassCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    const styleId = "admin-dashboard-animations";

    if (!document.getElementById(styleId)) {
      const styleTag = document.createElement("style");
      styleTag.id = styleId;
      styleTag.innerHTML = `
        @keyframes dashboardGradientShift {
          0% { transform: translateX(-8%) translateY(-6%) scale(1); }
          50% { transform: translateX(6%) translateY(4%) scale(1.08); }
          100% { transform: translateX(-8%) translateY(-6%) scale(1); }
        }

        @keyframes dashboardFloat {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }

        @keyframes dashboardGlowPulse {
          0% { opacity: 0.55; }
          50% { opacity: 0.85; }
          100% { opacity: 0.55; }
        }
      `;
      document.head.appendChild(styleTag);
    }
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setPageError("");

      try {
        const [analyticsRes, teachersRes, classesRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/reports/analytics/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://127.0.0.1:8000/api/teachers/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://127.0.0.1:8000/api/classrooms/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setAnalytics(analyticsRes.data);
        setTeacherCount(Array.isArray(teachersRes.data) ? teachersRes.data.length : 0);
        setClassCount(Array.isArray(classesRes.data) ? classesRes.data.length : 0);
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        setPageError("Failed to load dashboard insights.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const notifications = useMemo(() => {
    if (!analytics) return [];

    const items = [];

    if ((analytics.students_at_risk_count || 0) > 0) {
      items.push({
        id: "risk-students",
        title: "Students need attention",
        message: `${analytics.students_at_risk_count} student(s) are below 75% attendance and may require follow-up.`,
        type: "warning",
      });
    }

    if ((analytics.full_day_absent || 0) > 0) {
      items.push({
        id: "full-day-absent",
        title: "Full day absences recorded",
        message: `${analytics.full_day_absent} learner(s) were fully absent in the selected daily summary.`,
        type: "danger",
      });
    }

    if ((analytics.partial_attendance || 0) > 0) {
      items.push({
        id: "partial-attendance",
        title: "Partial attendance detected",
        message: `${analytics.partial_attendance} learner(s) attended only part of the school day.`,
        type: "info",
      });
    }

    if (items.length === 0) {
      items.push({
        id: "all-good",
        title: "Attendance looks stable",
        message:
          "No major attendance alerts were detected in the latest dashboard summary.",
        type: "success",
      });
    }

    return items;
  }, [analytics]);

  const topRiskStudents = useMemo(() => {
    if (!analytics?.students_at_risk) return [];
    return analytics.students_at_risk.slice(0, 4);
  }, [analytics]);

  const quickStats = [
    {
      title: "Number of Teachers",
      value: teacherCount,
      description: "Registered teaching staff in the system",
    },
    {
      title: "Total Students",
      value: analytics?.total_enrollment ?? 0,
      description: "Active learners in the school records",
    },
    {
      title: "Total Classes",
      value: classCount,
      description: "Classes currently available in the system",
    },
    {
      title: "Students at Risk",
      value: analytics?.students_at_risk_count ?? 0,
      description: "Learners below 75% attendance",
      alert: true,
    },
    {
      title: "Present Records",
      value: analytics?.present_count ?? 0,
      description: "Attendance records marked present",
    },
    {
      title: "Absent Records",
      value: analytics?.absent_count ?? 0,
      description: "Attendance records marked absent",
    },
  ];

  return (
    <div style={pageWrapperStyle}>
      <section style={heroStyle}>
        <div style={heroAnimatedGlowStyle} />
        <div style={heroAnimatedGlowSecondaryStyle} />

        <div style={heroGlassCardStyle}>
          <div style={heroBadgeStyle}>Admin Dashboard</div>

          <h1 style={heroTitleStyle}>Welcome back, Admin</h1>

          <p style={heroTextStyle}>
            Stay in control of attendance, classes, teachers, and learners from
            one modern dashboard with faster access to reports, analytics, and
            critical alerts.
          </p>

          <div style={heroMiniStatsRowStyle}>
            <MiniGlassStat
              label="Teachers"
              value={teacherCount}
            />
            <MiniGlassStat
              label="Students"
              value={analytics?.total_enrollment ?? 0}
            />
            <MiniGlassStat
              label="Classes"
              value={classCount}
            />
            <MiniGlassStat
              label="Students at Risk"
              value={analytics?.students_at_risk_count ?? 0}
            />
          </div>
        </div>
      </section>

      {pageError ? <div style={errorBoxStyle}>{pageError}</div> : null}

      <div style={dashboardGridStyle}>
        <div style={mainColumnStyle}>
          <div style={sectionHeaderStyle}>
            <h3 style={sectionTitleStyle}>Quick Overview</h3>
            <p style={sectionSubtitleStyle}>
              A fast summary of the latest attendance position and school setup.
            </p>
          </div>

          {loading ? (
            <div style={loadingCardStyle}>Loading dashboard summary...</div>
          ) : (
            <div style={statsGridStyle}>
              {quickStats.map((item) => (
                <div
                  key={item.title}
                  style={{
                    ...statCardStyle,
                    ...(item.alert ? statCardAlertStyle : {}),
                  }}
                >
                  <p style={statLabelStyle}>{item.title}</p>
                  <h3 style={statValueStyle}>{item.value}</h3>
                  <p style={statSubtextStyle}>{item.description}</p>
                </div>
              ))}
            </div>
          )}

          <div style={sectionHeaderStyle}>
            <h3 style={sectionTitleStyle}>Quick Access</h3>
            <p style={sectionSubtitleStyle}>
              Important areas you can manage from the admin panel.
            </p>
          </div>

          <div style={quickGridStyle}>
            <QuickCard
              title="Teachers"
              text="Add, review, and manage teaching staff efficiently."
            />
            <QuickCard
              title="Students"
              text="Register, enroll, and maintain student records clearly."
            />
            <QuickCard
              title="Classes"
              text="Organize classrooms and support class management workflows."
            />
            <QuickCard
              title="Attendance"
              text="Review reports, monitor trends, and act on attendance issues."
            />
          </div>
        </div>

        <div style={sideColumnStyle}>
          <div style={notificationPanelStyle}>
            <div style={panelHeaderStyle}>
              <h3 style={panelTitleStyle}>Notifications</h3>
              <span style={panelBadgeStyle}>{notifications.length}</span>
            </div>

            <div style={notificationListStyle}>
              {notifications.map((item) => (
                <div
                  key={item.id}
                  style={{
                    ...notificationItemStyle,
                    ...(item.type === "warning"
                      ? notificationWarningStyle
                      : item.type === "danger"
                      ? notificationDangerStyle
                      : item.type === "success"
                      ? notificationSuccessStyle
                      : notificationInfoStyle),
                  }}
                >
                  <p style={notificationTitleStyle}>{item.title}</p>
                  <p style={notificationTextStyle}>{item.message}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={riskPanelStyle}>
            <div style={panelHeaderStyle}>
              <h3 style={panelTitleStyle}>Attention Needed</h3>
              <span style={riskBadgeStyle}>
                {analytics?.students_at_risk_count ?? 0}
              </span>
            </div>

            {loading ? (
              <p style={emptyTextStyle}>Loading learner alerts...</p>
            ) : topRiskStudents.length === 0 ? (
              <p style={emptyTextStyle}>
                No students are currently below the attendance threshold.
              </p>
            ) : (
              <div style={riskListStyle}>
                {topRiskStudents.map((student) => (
                  <div key={student.student_id} style={riskItemStyle}>
                    <div>
                      <p style={riskNameStyle}>{student.name}</p>
                      <p style={riskMetaStyle}>
                        {student.admission_number || "Admission number unavailable"}
                      </p>
                    </div>
                    <div style={riskPercentStyle}>
                      {student.attendance_percentage}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniGlassStat({ label, value }) {
  return (
    <div style={miniGlassStatStyle}>
      <p style={miniGlassLabelStyle}>{label}</p>
      <h4 style={miniGlassValueStyle}>{value}</h4>
    </div>
  );
}

function QuickCard({ title, text }) {
  return (
    <div style={quickCardStyle}>
      <h4 style={quickCardTitleStyle}>{title}</h4>
      <p style={quickCardTextStyle}>{text}</p>
    </div>
  );
}

const pageWrapperStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const heroStyle = {
  position: "relative",
  minHeight: "320px",
  borderRadius: "28px",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  padding: "34px",
  backgroundImage: `linear-gradient(rgba(248, 251, 255, 0.62), rgba(248, 251, 255, 0.72)), url(${dashboardBg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  border: "1px solid #dbeafe",
  boxShadow: "0 16px 40px rgba(37, 99, 235, 0.10)",
};

const heroAnimatedGlowStyle = {
  position: "absolute",
  top: "-10%",
  left: "-5%",
  width: "55%",
  height: "140%",
  background:
    "linear-gradient(135deg, rgba(37, 99, 235, 0.28), rgba(59, 130, 246, 0.10), rgba(255,255,255,0.02))",
  filter: "blur(10px)",
  animation: "dashboardGradientShift 12s ease-in-out infinite",
  pointerEvents: "none",
};

const heroAnimatedGlowSecondaryStyle = {
  position: "absolute",
  right: "-8%",
  bottom: "-10%",
  width: "36%",
  height: "90%",
  borderRadius: "999px",
  background:
    "radial-gradient(circle, rgba(96, 165, 250, 0.30) 0%, rgba(191, 219, 254, 0.08) 55%, rgba(255,255,255,0) 75%)",
  filter: "blur(6px)",
  animation: "dashboardGlowPulse 7s ease-in-out infinite",
  pointerEvents: "none",
};

const heroGlassCardStyle = {
  position: "relative",
  zIndex: 2,
  width: "100%",
  maxWidth: "760px",
  padding: "28px",
  borderRadius: "24px",
  background: "rgba(255, 255, 255, 0.34)",
  border: "1px solid rgba(255,255,255,0.45)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.10)",
  animation: "dashboardFloat 6s ease-in-out infinite",
};

const heroBadgeStyle = {
  display: "inline-block",
  padding: "8px 12px",
  borderRadius: "999px",
  backgroundColor: "rgba(255,255,255,0.55)",
  color: "#1d4ed8",
  fontSize: "12px",
  fontWeight: "700",
  marginBottom: "16px",
  border: "1px solid rgba(255,255,255,0.5)",
};

const heroTitleStyle = {
  margin: 0,
  fontSize: "36px",
  fontWeight: "700",
  color: "#1e3a8a",
  lineHeight: 1.2,
};

const heroTextStyle = {
  marginTop: "14px",
  marginBottom: 0,
  fontSize: "16px",
  lineHeight: "1.7",
  color: "#334155",
  maxWidth: "620px",
};

const heroMiniStatsRowStyle = {
  marginTop: "24px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "12px",
};

const miniGlassStatStyle = {
  padding: "14px 16px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.32)",
  border: "1px solid rgba(255,255,255,0.45)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
};

const miniGlassLabelStyle = {
  margin: 0,
  fontSize: "12px",
  fontWeight: "600",
  color: "#475569",
};

const miniGlassValueStyle = {
  marginTop: "8px",
  marginBottom: 0,
  fontSize: "24px",
  fontWeight: "700",
  color: "#0f172a",
};

const dashboardGridStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.6fr) minmax(320px, 0.9fr)",
  gap: "22px",
};

const mainColumnStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "22px",
};

const sideColumnStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "22px",
};

const sectionHeaderStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: "22px",
  fontWeight: "700",
  color: "#1e3a8a",
};

const sectionSubtitleStyle = {
  margin: 0,
  fontSize: "14px",
  color: "#64748b",
};

const loadingCardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "18px",
  border: "1px solid #dbeafe",
  padding: "22px",
  color: "#475569",
  boxShadow: "0 10px 30px rgba(37, 99, 235, 0.06)",
};

const errorBoxStyle = {
  backgroundColor: "#fef2f2",
  color: "#b91c1c",
  border: "1px solid #fecaca",
  padding: "12px 14px",
  borderRadius: "12px",
  fontSize: "14px",
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
};

const statCardStyle = {
  background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
  borderRadius: "18px",
  border: "1px solid #dbeafe",
  boxShadow: "0 8px 24px rgba(37, 99, 235, 0.06)",
  padding: "20px",
};

const statCardAlertStyle = {
  background: "linear-gradient(180deg, #ffffff 0%, #fff7ed 100%)",
  border: "1px solid #fed7aa",
};

const statLabelStyle = {
  margin: 0,
  color: "#64748b",
  fontSize: "14px",
  fontWeight: "600",
};

const statValueStyle = {
  marginTop: "12px",
  marginBottom: 0,
  fontSize: "30px",
  color: "#0f172a",
  fontWeight: "700",
};

const statSubtextStyle = {
  marginTop: "8px",
  marginBottom: 0,
  color: "#64748b",
  fontSize: "13px",
  lineHeight: 1.5,
};

const quickGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
};

const quickCardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  border: "1px solid #dbeafe",
  padding: "20px",
  boxShadow: "0 8px 20px rgba(37, 99, 235, 0.06)",
};

const quickCardTitleStyle = {
  margin: 0,
  fontSize: "16px",
  fontWeight: "700",
  color: "#1e3a8a",
};

const quickCardTextStyle = {
  marginTop: "8px",
  marginBottom: 0,
  fontSize: "14px",
  color: "#64748b",
  lineHeight: 1.6,
};

const notificationPanelStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "18px",
  border: "1px solid #dbeafe",
  boxShadow: "0 10px 30px rgba(37, 99, 235, 0.06)",
  padding: "22px",
};

const panelHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  marginBottom: "16px",
};

const panelTitleStyle = {
  margin: 0,
  fontSize: "18px",
  fontWeight: "700",
  color: "#1e3a8a",
};

const panelBadgeStyle = {
  padding: "6px 10px",
  borderRadius: "999px",
  backgroundColor: "#dbeafe",
  color: "#1d4ed8",
  fontSize: "12px",
  fontWeight: "700",
};

const notificationListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const notificationItemStyle = {
  borderRadius: "14px",
  padding: "14px",
  border: "1px solid transparent",
};

const notificationWarningStyle = {
  backgroundColor: "#fff7ed",
  borderColor: "#fed7aa",
};

const notificationDangerStyle = {
  backgroundColor: "#fef2f2",
  borderColor: "#fecaca",
};

const notificationSuccessStyle = {
  backgroundColor: "#f0fdf4",
  borderColor: "#bbf7d0",
};

const notificationInfoStyle = {
  backgroundColor: "#eff6ff",
  borderColor: "#bfdbfe",
};

const notificationTitleStyle = {
  margin: 0,
  fontSize: "14px",
  fontWeight: "700",
  color: "#0f172a",
};

const notificationTextStyle = {
  marginTop: "6px",
  marginBottom: 0,
  fontSize: "13px",
  color: "#475569",
  lineHeight: 1.6,
};

const riskPanelStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "18px",
  border: "1px solid #dbeafe",
  boxShadow: "0 10px 30px rgba(37, 99, 235, 0.06)",
  padding: "22px",
};

const riskBadgeStyle = {
  padding: "6px 10px",
  borderRadius: "999px",
  backgroundColor: "#fee2e2",
  color: "#b91c1c",
  fontSize: "12px",
  fontWeight: "700",
};

const emptyTextStyle = {
  margin: 0,
  color: "#64748b",
  fontSize: "14px",
};

const riskListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const riskItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  backgroundColor: "#fff7ed",
  border: "1px solid #fed7aa",
  borderRadius: "12px",
  padding: "12px 14px",
};

const riskNameStyle = {
  margin: 0,
  fontSize: "15px",
  fontWeight: "700",
  color: "#0f172a",
};

const riskMetaStyle = {
  marginTop: "4px",
  marginBottom: 0,
  fontSize: "13px",
  color: "#64748b",
};

const riskPercentStyle = {
  padding: "8px 12px",
  borderRadius: "999px",
  backgroundColor: "#fecaca",
  color: "#991b1b",
  fontSize: "13px",
  fontWeight: "700",
  whiteSpace: "nowrap",
};

export default AdminDashboard;