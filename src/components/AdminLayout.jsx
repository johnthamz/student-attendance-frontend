import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { logoutUser } from "../services/authUtils";

function AdminLayout({ children }) {
  const location = useLocation();

  const isTeachersSectionActive = location.pathname.startsWith("/admin/teachers");
  const isStudentsSectionActive = location.pathname.startsWith("/admin/students");
  const isClassesSectionActive = location.pathname.startsWith("/admin/classes");

  const [teachersOpen, setTeachersOpen] = useState(isTeachersSectionActive);
  const [studentsOpen, setStudentsOpen] = useState(isStudentsSectionActive);
  const [classesOpen, setClassesOpen] = useState(isClassesSectionActive);

  useEffect(() => {
    if (isTeachersSectionActive) setTeachersOpen(true);
  }, [isTeachersSectionActive]);

  useEffect(() => {
    if (isStudentsSectionActive) setStudentsOpen(true);
  }, [isStudentsSectionActive]);

  useEffect(() => {
    if (isClassesSectionActive) setClassesOpen(true);
  }, [isClassesSectionActive]);

  const handleLogout = () => {
    logoutUser();
    window.location.href = "/";
  };

  const layoutStyle = {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f8fbff",
  };

  const sidebarStyle = {
    width: "250px",
    background: "linear-gradient(180deg, #1e3a8a 0%, #2563eb 100%)",
    color: "white",
    padding: "24px 18px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "4px 0 18px rgba(0,0,0,0.08)",
  };

  const sidebarTitleStyle = {
    marginBottom: "24px",
    fontSize: "22px",
    fontWeight: "700",
    letterSpacing: "0.3px",
  };

  const navStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  };

  const getLinkStyle = (path) => ({
    color: location.pathname === path ? "#0f172a" : "#eff6ff",
    backgroundColor: location.pathname === path ? "#dbeafe" : "transparent",
    padding: "10px 12px",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: location.pathname === path ? "700" : "500",
    display: "block",
    transition: "all 0.2s ease",
  });

  const getToggleStyle = (isActive) => ({
    color: isActive ? "#0f172a" : "#eff6ff",
    backgroundColor: isActive ? "#dbeafe" : "transparent",
    padding: "10px 12px",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: isActive ? "700" : "500",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    border: "none",
    width: "100%",
    fontSize: "15px",
    transition: "all 0.2s ease",
  });

  const groupWrapStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const getDropdownStyle = (isOpen) => ({
    display: isOpen ? "flex" : "none",
    flexDirection: "column",
    gap: "8px",
    marginTop: "6px",
    marginLeft: "10px",
    padding: "8px",
    borderRadius: "12px",
    backgroundColor: "rgba(255,255,255,0.08)",
  });

  const getSubLinkStyle = (path) => ({
    color: location.pathname === path ? "#0f172a" : "#dbeafe",
    backgroundColor:
      location.pathname === path ? "#e0f2fe" : "rgba(255,255,255,0.08)",
    padding: "9px 12px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: location.pathname === path ? "700" : "500",
    display: "block",
    fontSize: "14px",
  });

  const getArrowStyle = (isOpen) => ({
    fontSize: "14px",
    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
    transition: "transform 0.2s ease",
  });

  const mainContainerStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  };

  const headerStyle = {
    padding: "16px 24px",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #dbeafe",
    boxShadow: "0 2px 10px rgba(30, 64, 175, 0.04)",
  };

  const headerTitleStyle = {
    margin: 0,
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e3a8a",
  };

  const logoutButtonStyle = {
    padding: "10px 16px",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    boxShadow: "0 6px 14px rgba(239, 68, 68, 0.18)",
  };

  const mainContentStyle = {
    padding: "28px",
    flex: 1,
    backgroundColor: "#f8fbff",
  };

  return (
    <div style={layoutStyle}>
      <aside style={sidebarStyle}>
        <h3 style={sidebarTitleStyle}>Admin Panel</h3>

        <nav style={navStyle}>
          <Link to="/admin" style={getLinkStyle("/admin")}>
            Dashboard
          </Link>

          <div style={groupWrapStyle}>
            <button
              type="button"
              style={getToggleStyle(isTeachersSectionActive)}
              onClick={() => setTeachersOpen((prev) => !prev)}
            >
              <span>Teachers</span>
              <span style={getArrowStyle(teachersOpen)}>▶</span>
            </button>

            <div style={getDropdownStyle(teachersOpen)}>
              <Link to="/admin/teachers/add" style={getSubLinkStyle("/admin/teachers/add")}>
                Add Teacher
              </Link>
              <Link to="/admin/teachers/manage" style={getSubLinkStyle("/admin/teachers/manage")}>
                Manage Teachers
              </Link>
            </div>
          </div>

          <div style={groupWrapStyle}>
            <button
              type="button"
              style={getToggleStyle(isStudentsSectionActive)}
              onClick={() => setStudentsOpen((prev) => !prev)}
            >
              <span>Students</span>
              <span style={getArrowStyle(studentsOpen)}>▶</span>
            </button>

            <div style={getDropdownStyle(studentsOpen)}>
              <Link to="/admin/students/add" style={getSubLinkStyle("/admin/students/add")}>
                Add Student
              </Link>
              <Link to="/admin/students/enroll" style={getSubLinkStyle("/admin/students/enroll")}>
                Enroll
              </Link>
              <Link to="/admin/students/manage" style={getSubLinkStyle("/admin/students/manage")}>
                Manage Students
              </Link>
            </div>
          </div>

          <div style={groupWrapStyle}>
            <button
              type="button"
              style={getToggleStyle(isClassesSectionActive)}
              onClick={() => setClassesOpen((prev) => !prev)}
            >
              <span>Classes</span>
              <span style={getArrowStyle(classesOpen)}>▶</span>
            </button>

            <div style={getDropdownStyle(classesOpen)}>
              <Link to="/admin/classes/create" style={getSubLinkStyle("/admin/classes/create")}>
                Create Class
              </Link>
              <Link to="/admin/classes/manage" style={getSubLinkStyle("/admin/classes/manage")}>
                Manage Classes
              </Link>
            </div>
          </div>

          <Link to="/admin/reports" style={getLinkStyle("/admin/reports")}>
            Attendance Reports
          </Link>

          <Link to="/admin/analytics" style={getLinkStyle("/admin/analytics")}>
            Attendance Analytics
          </Link>
        </nav>
      </aside>

      <div style={mainContainerStyle}>
        <header style={headerStyle}>
          <h2 style={headerTitleStyle}>School Attendance System</h2>
          <button style={logoutButtonStyle} onClick={handleLogout}>
            Logout
          </button>
        </header>

        <main style={mainContentStyle}>{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;