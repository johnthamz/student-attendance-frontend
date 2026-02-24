import { Link, useLocation } from "react-router-dom";
import { logoutUser } from "../services/authUtils";

function TeacherLayout({ children }) {
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    window.location.href = "/";
  };

  // ================= Sidebar Link Style =================
  const getLinkStyle = (path) => ({
    color: location.pathname === path ? "#ffffff" : "#e5e7eb",
    backgroundColor:
      location.pathname === path ? "#2563eb" : "transparent",
    padding: "8px 10px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: location.pathname === path ? "bold" : "normal",
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* ================= Sidebar ================= */}
      <aside
        style={{
          width: "230px",
          backgroundColor: "#1e3a8a",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3 style={{ marginBottom: "20px" }}>Teacher Panel</h3>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {/* Dashboard */}
          <Link to="/teacher" style={getLinkStyle("/teacher")}>
            Dashboard
          </Link>

          {/* Attendance */}
          <Link
            to="/teacher/attendance"
            style={getLinkStyle("/teacher/attendance")}
          >
            Attendance
          </Link>

          {/* Attendance History (NEW) */}
          <Link
            to="/teacher/history"
            style={getLinkStyle("/teacher/history")}
          >
            Attendance History
          </Link>
        </nav>
      </aside>

      {/* ================= Main Content ================= */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <header
          style={{
            padding: "15px 25px",
            backgroundColor: "#f3f4f6",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h2 style={{ margin: 0 }}>School Attendance System</h2>

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "#b91c1c")
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = "#dc2626")
            }
          >
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main style={{ padding: "25px", flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default TeacherLayout;