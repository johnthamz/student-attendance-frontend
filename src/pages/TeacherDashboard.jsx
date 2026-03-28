import { useEffect, useState } from "react";
import axios from "axios";

function TeacherDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        "http://127.0.0.1:8000/api/teacher/dashboard-summary/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data);
    } catch (err) {
      console.error("Failed to load teacher dashboard:", err);
      setError(
        err.response?.data?.error || "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.pageState}>
        <div style={styles.stateCard}>
          <h2 style={styles.stateTitle}>Loading dashboard...</h2>
          <p style={styles.stateText}>
            Please wait while we fetch your class summary.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.pageState}>
        <div style={styles.stateCard}>
          <h2 style={styles.stateTitle}>Unable to load dashboard</h2>
          <p style={styles.stateText}>{error}</p>
          <button style={styles.retryButton} onClick={fetchDashboard}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const classroomName = data?.classroom?.name || "Assigned Class";
  const stats = data?.stats || {};
  const notifications = data?.notifications || [];

  return (
    <div style={styles.page}>
      <div style={styles.heroSection}>
        <div style={styles.backgroundImage} />
        <div style={styles.backgroundOverlay} />

        <div style={styles.glowOne} />
        <div style={styles.glowTwo} />
        <div style={styles.glowThree} />

        <div style={styles.heroCard}>
          <div style={styles.badge}>Teacher Dashboard</div>

          <h1 style={styles.heroTitle}>Welcome back, Teacher</h1>

          <p style={styles.heroSubtitle}>
            Stay on top of attendance, learner support, and interventions for{" "}
            <strong>{classroomName}</strong> from one modern dashboard.
          </p>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Total Learners</p>
              <h2 style={styles.statValue}>
                {stats.total_learners ?? 0}
              </h2>
            </div>

            <div style={styles.statCard}>
              <p style={styles.statLabel}>Male Learners</p>
              <h2 style={styles.statValue}>
                {stats.male_learners ?? 0}
              </h2>
            </div>

            <div style={styles.statCard}>
              <p style={styles.statLabel}>Female Learners</p>
              <h2 style={styles.statValue}>
                {stats.female_learners ?? 0}
              </h2>
            </div>

            <div style={styles.alertStatCard}>
              <p style={styles.statLabelDark}>Need Attention</p>
              <h2 style={styles.statValueDark}>
                {stats.need_attention ?? 0}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.bottomGrid}>
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <p style={styles.panelEyebrow}>Class Overview</p>
              <h3 style={styles.panelTitle}>{classroomName}</h3>
            </div>
          </div>

          <div style={styles.summaryGrid}>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Total learners</span>
              <span style={styles.summaryValue}>
                {stats.total_learners ?? 0}
              </span>
            </div>

            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Male learners</span>
              <span style={styles.summaryValue}>
                {stats.male_learners ?? 0}
              </span>
            </div>

            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Female learners</span>
              <span style={styles.summaryValue}>
                {stats.female_learners ?? 0}
              </span>
            </div>

            <div style={styles.summaryItemWarning}>
              <span style={styles.summaryLabelWarning}>Below 75%</span>
              <span style={styles.summaryValueWarning}>
                {stats.need_attention ?? 0}
              </span>
            </div>
          </div>
        </div>

        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <p style={styles.panelEyebrow}>Notifications</p>
              <h3 style={styles.panelTitle}>Learners needing intervention</h3>
            </div>
          </div>

          {notifications.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>✓</div>
              <div>
                <p style={styles.emptyTitle}>No intervention alerts</p>
                <p style={styles.emptyText}>
                  All learners are currently at or above the 75% attendance
                  threshold.
                </p>
              </div>
            </div>
          ) : (
            <div style={styles.notificationList}>
              {notifications.map((student, index) => (
                <div
                  key={`${student.admission_number}-${index}`}
                  style={styles.notificationCard}
                >
                  <div>
                    <p style={styles.studentName}>{student.name}</p>
                    <p style={styles.studentMeta}>
                      Adm No: {student.admission_number}
                    </p>
                  </div>

                  <div style={styles.rateWrap}>
                    <span style={styles.rateBadge}>
                      {student.attendance_rate}%
                    </span>
                    <p style={styles.rateText}>Needs intervention</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;

const styles = {
  page: {
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "28px",
    color: "#0f172a",
  },

  heroSection: {
    position: "relative",
    minHeight: "610px",
    borderRadius: "34px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.24)",
    boxShadow: "0 24px 70px rgba(15, 23, 42, 0.16)",
    backgroundColor: "#dbeafe",
  },

  backgroundImage: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "url('https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    transform: "scale(1.02)",
  },

  backgroundOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(135deg, rgba(239,246,255,0.78) 0%, rgba(219,234,254,0.52) 35%, rgba(191,219,254,0.36) 100%)",
    backdropFilter: "blur(1px)",
  },

  glowOne: {
    position: "absolute",
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    top: "-90px",
    left: "18%",
    background:
      "radial-gradient(circle, rgba(59,130,246,0.22) 0%, rgba(59,130,246,0.02) 70%, transparent 100%)",
    filter: "blur(18px)",
    animation: "floatGlow 11s ease-in-out infinite",
  },

  glowTwo: {
    position: "absolute",
    width: "360px",
    height: "360px",
    borderRadius: "50%",
    bottom: "-70px",
    right: "8%",
    background:
      "radial-gradient(circle, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.04) 72%, transparent 100%)",
    filter: "blur(18px)",
    animation: "floatGlowReverse 13s ease-in-out infinite",
  },

  glowThree: {
    position: "absolute",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    top: "32%",
    right: "28%",
    background:
      "radial-gradient(circle, rgba(147,197,253,0.26) 0%, rgba(147,197,253,0.02) 72%, transparent 100%)",
    filter: "blur(12px)",
    animation: "floatGlow 15s ease-in-out infinite",
  },

  heroCard: {
    position: "relative",
    zIndex: 2,
    maxWidth: "1120px",
    margin: "44px auto",
    padding: "42px 42px 38px",
    borderRadius: "32px",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.42), rgba(255,255,255,0.22))",
    border: "1px solid rgba(255,255,255,0.38)",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "10px 18px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.62)",
    color: "#1d4ed8",
    fontSize: "0.98rem",
    fontWeight: 700,
    marginBottom: "20px",
    boxShadow: "0 8px 18px rgba(59, 130, 246, 0.08)",
  },

  heroTitle: {
    margin: "0 0 18px",
    fontSize: "3.3rem",
    lineHeight: 1.05,
    fontWeight: 800,
    color: "#1e3a8a",
    letterSpacing: "-0.03em",
  },

  heroSubtitle: {
    margin: 0,
    maxWidth: "860px",
    fontSize: "1.12rem",
    lineHeight: 1.8,
    color: "#334155",
  },

  statsGrid: {
    marginTop: "34px",
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "18px",
  },

  statCard: {
    background: "rgba(255,255,255,0.56)",
    border: "1px solid rgba(255,255,255,0.42)",
    borderRadius: "24px",
    padding: "22px 24px",
    minHeight: "118px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
  },

  alertStatCard: {
    background: "linear-gradient(135deg, rgba(254,242,242,0.92), rgba(254,226,226,0.86))",
    border: "1px solid rgba(252,165,165,0.45)",
    borderRadius: "24px",
    padding: "22px 24px",
    minHeight: "118px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 10px 30px rgba(127, 29, 29, 0.10)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
  },

  statLabel: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 700,
    color: "#334155",
  },

  statLabelDark: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 700,
    color: "#7f1d1d",
  },

  statValue: {
    margin: 0,
    fontSize: "2.45rem",
    fontWeight: 800,
    color: "#0f172a",
  },

  statValueDark: {
    margin: 0,
    fontSize: "2.45rem",
    fontWeight: 800,
    color: "#991b1b",
  },

  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr",
    gap: "24px",
  },

  panel: {
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(248,250,252,0.96))",
    border: "1px solid rgba(226,232,240,0.92)",
    borderRadius: "26px",
    padding: "24px",
    boxShadow: "0 14px 35px rgba(15, 23, 42, 0.08)",
  },

  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "18px",
  },

  panelEyebrow: {
    margin: "0 0 6px",
    fontSize: "0.82rem",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontWeight: 800,
    color: "#64748b",
  },

  panelTitle: {
    margin: 0,
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "#0f172a",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },

  summaryItem: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  summaryItemWarning: {
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    borderRadius: "18px",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  summaryLabel: {
    fontSize: "0.95rem",
    color: "#64748b",
    fontWeight: 700,
  },

  summaryValue: {
    fontSize: "1.7rem",
    color: "#0f172a",
    fontWeight: 800,
  },

  summaryLabelWarning: {
    fontSize: "0.95rem",
    color: "#c2410c",
    fontWeight: 700,
  },

  summaryValueWarning: {
    fontSize: "1.7rem",
    color: "#9a3412",
    fontWeight: 800,
  },

  notificationList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  notificationCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    padding: "18px",
    borderRadius: "18px",
    border: "1px solid #fee2e2",
    background:
      "linear-gradient(135deg, rgba(255,250,250,1), rgba(254,242,242,1))",
  },

  studentName: {
    margin: "0 0 6px",
    fontSize: "1rem",
    fontWeight: 800,
    color: "#0f172a",
  },

  studentMeta: {
    margin: 0,
    fontSize: "0.92rem",
    color: "#64748b",
  },

  rateWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "6px",
    minWidth: "110px",
  },

  rateBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "78px",
    padding: "8px 12px",
    borderRadius: "999px",
    background: "#fee2e2",
    color: "#b91c1c",
    fontSize: "0.92rem",
    fontWeight: 800,
  },

  rateText: {
    margin: 0,
    fontSize: "0.82rem",
    color: "#b91c1c",
    fontWeight: 700,
  },

  emptyState: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, rgba(240,253,244,1), rgba(240,249,255,1))",
    border: "1px solid #bbf7d0",
  },

  emptyIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "#dcfce7",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: "1.1rem",
    flexShrink: 0,
  },

  emptyTitle: {
    margin: "0 0 4px",
    fontSize: "1rem",
    fontWeight: 800,
    color: "#166534",
  },

  emptyText: {
    margin: 0,
    color: "#475569",
    lineHeight: 1.6,
  },

  pageState: {
    minHeight: "60vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  stateCard: {
    width: "100%",
    maxWidth: "520px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
    textAlign: "center",
  },

  stateTitle: {
    margin: "0 0 10px",
    color: "#0f172a",
  },

  stateText: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.7,
  },

  retryButton: {
    marginTop: "18px",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 18px",
    fontWeight: 700,
    cursor: "pointer",
  },
};

if (typeof document !== "undefined") {
  const styleId = "teacher-dashboard-animations";

  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      @keyframes floatGlow {
        0% { transform: translate3d(0, 0, 0) scale(1); }
        50% { transform: translate3d(14px, -10px, 0) scale(1.05); }
        100% { transform: translate3d(0, 0, 0) scale(1); }
      }

      @keyframes floatGlowReverse {
        0% { transform: translate3d(0, 0, 0) scale(1); }
        50% { transform: translate3d(-16px, 12px, 0) scale(1.06); }
        100% { transform: translate3d(0, 0, 0) scale(1); }
      }

      @media (max-width: 1100px) {
        .teacher-dashboard-responsive-grid {
          grid-template-columns: 1fr !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
}