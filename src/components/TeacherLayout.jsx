import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { logoutUser } from "../services/authUtils";

function TeacherLayout({ children }) {
  const location = useLocation();

  const attendanceRoutes = useMemo(
    () => [
      "/teacher/attendance/mark",
      "/teacher/attendance/view",
      "/teacher/attendance/analytics",
    ],
    []
  );

  const attendanceActive = attendanceRoutes.includes(location.pathname);
  const [attendanceOpen, setAttendanceOpen] = useState(attendanceActive);

  const handleLogout = () => {
    logoutUser();
    window.location.href = "/";
  };

  const isActive = (path) => location.pathname === path;

  const getLinkStyle = (path) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 18px",
    borderRadius: "16px",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "1rem",
    letterSpacing: "0.01em",
    transition: "all 0.25s ease",
    color: isActive(path) ? "#0f172a" : "rgba(255,255,255,0.92)",
    background: isActive(path)
      ? "linear-gradient(135deg, rgba(255,255,255,0.94), rgba(226,232,240,0.96))"
      : "transparent",
    boxShadow: isActive(path)
      ? "0 10px 24px rgba(15, 23, 42, 0.16)"
      : "none",
    border: isActive(path)
      ? "1px solid rgba(255,255,255,0.75)"
      : "1px solid transparent",
  });

  const attendanceGroupButtonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 18px",
    borderRadius: "16px",
    border: attendanceActive
      ? "1px solid rgba(255,255,255,0.75)"
      : "1px solid transparent",
    background: attendanceActive
      ? "linear-gradient(135deg, rgba(255,255,255,0.94), rgba(226,232,240,0.96))"
      : "rgba(255,255,255,0.05)",
    color: attendanceActive ? "#0f172a" : "rgba(255,255,255,0.92)",
    fontWeight: 800,
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: attendanceActive
      ? "0 10px 24px rgba(15, 23, 42, 0.16)"
      : "none",
  };

  const getSubLinkStyle = (path) => ({
    display: "flex",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    borderRadius: "14px",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "0.95rem",
    transition: "all 0.25s ease",
    color: isActive(path) ? "#0f172a" : "rgba(255,255,255,0.88)",
    background: isActive(path)
      ? "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(241,245,249,0.96))"
      : "rgba(255,255,255,0.06)",
    border: isActive(path)
      ? "1px solid rgba(255,255,255,0.72)"
      : "1px solid rgba(255,255,255,0.08)",
    boxShadow: isActive(path)
      ? "0 8px 20px rgba(15, 23, 42, 0.12)"
      : "none",
  });

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarTop}>
          <div style={styles.panelBadge}>Teacher Panel</div>
          <h2 style={styles.sidebarTitle}>Attendance Portal</h2>
          <p style={styles.sidebarSubtitle}>
            Manage attendance, review learner records, and monitor class trends
            with a cleaner teacher workspace.
          </p>
        </div>

        <nav style={styles.nav}>
          <Link to="/teacher" style={getLinkStyle("/teacher")}>
            <span>Dashboard</span>
          </Link>

          <div style={styles.groupWrapper}>
            <button
              type="button"
              style={attendanceGroupButtonStyle}
              onClick={() => setAttendanceOpen((prev) => !prev)}
            >
              <span>Attendance</span>
              <span style={styles.chevron}>{attendanceOpen ? "▾" : "▸"}</span>
            </button>

            {attendanceOpen && (
              <div style={styles.subNav}>
                <Link
                  to="/teacher/attendance/mark"
                  style={getSubLinkStyle("/teacher/attendance/mark")}
                >
                  Mark Attendance
                </Link>

                <Link
                  to="/teacher/attendance/view"
                  style={getSubLinkStyle("/teacher/attendance/view")}
                >
                  View Attendance
                </Link>

                <Link
                  to="/teacher/attendance/analytics"
                  style={getSubLinkStyle("/teacher/attendance/analytics")}
                >
                  Analytics
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.footerCard}>
            <p style={styles.footerCardTitle}>Quick Tip</p>
            <p style={styles.footerCardText}>
              Use View Attendance to inspect a learner’s history, then Analytics
              to spot attendance patterns by date range and gender.
            </p>
          </div>
        </div>
      </aside>

      <div style={styles.mainSection}>
        <header style={styles.header}>
          <div>
            <p style={styles.headerEyebrow}>School Attendance System</p>
            <h1 style={styles.headerTitle}>Teacher Workspace</h1>
          </div>

          <button
            onClick={handleLogout}
            style={styles.logoutButton}
            onMouseOver={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #b91c1c, #991b1b)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #ef4444, #dc2626)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Logout
          </button>
        </header>

        <main style={styles.main}>{children}</main>
      </div>
    </div>
  );
}

export default TeacherLayout;

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)",
  },
  sidebar: {
    width: "300px",
    background: "linear-gradient(180deg, #1e3a8a 0%, #1d4ed8 100%)",
    color: "#ffffff",
    padding: "28px 22px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "12px 0 40px rgba(30, 58, 138, 0.20)",
    position: "sticky",
    top: 0,
    minHeight: "100vh",
    boxSizing: "border-box",
  },
  sidebarTop: {
    marginBottom: "26px",
  },
  panelBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.18)",
    border: "1px solid rgba(255,255,255,0.2)",
    fontSize: "0.84rem",
    fontWeight: 700,
    marginBottom: "14px",
  },
  sidebarTitle: {
    margin: "0 0 10px",
    fontSize: "2rem",
    lineHeight: 1.1,
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },
  sidebarSubtitle: {
    margin: 0,
    color: "rgba(255,255,255,0.82)",
    fontSize: "0.95rem",
    lineHeight: 1.7,
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "10px",
  },
  groupWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  subNav: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginLeft: "12px",
    paddingLeft: "12px",
    borderLeft: "1px solid rgba(255,255,255,0.16)",
  },
  chevron: {
    fontSize: "1rem",
    fontWeight: 900,
  },
  sidebarFooter: {
    marginTop: "auto",
    paddingTop: "24px",
  },
  footerCard: {
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "20px",
    padding: "18px",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  },
  footerCardTitle: {
    margin: "0 0 8px",
    fontWeight: 800,
    fontSize: "0.95rem",
  },
  footerCardText: {
    margin: 0,
    color: "rgba(255,255,255,0.82)",
    fontSize: "0.9rem",
    lineHeight: 1.65,
  },
  mainSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  header: {
    padding: "22px 30px",
    background: "rgba(255,255,255,0.78)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid rgba(226,232,240,0.9)",
    position: "sticky",
    top: 0,
    zIndex: 20,
  },
  headerEyebrow: {
    margin: "0 0 4px",
    fontSize: "0.82rem",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontWeight: 800,
    color: "#64748b",
  },
  headerTitle: {
    margin: 0,
    fontSize: "1.75rem",
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: "-0.02em",
  },
  logoutButton: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#ffffff",
    border: "none",
    padding: "12px 22px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: "0.95rem",
    boxShadow: "0 10px 20px rgba(220, 38, 38, 0.22)",
    transition: "all 0.25s ease",
  },
  main: {
    padding: "28px",
    flex: 1,
    overflowX: "hidden",
  },
};