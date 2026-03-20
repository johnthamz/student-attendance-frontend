import dashboardBg from "../assets/dashboard-bg.png";

function AdminDashboard() {
  const pageWrapperStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  };

  // HERO SECTION (BACKGROUND IMAGE + FADE)
  const heroStyle = {
    position: "relative",
    minHeight: "280px",
    borderRadius: "24px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    padding: "40px",
    backgroundImage: `linear-gradient(rgba(248, 251, 255, 0.82), rgba(248, 251, 255, 0.88)), url(${dashboardBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    border: "1px solid #dbeafe",
    boxShadow: "0 12px 30px rgba(37, 99, 235, 0.08)",
  };

  const contentStyle = {
    maxWidth: "600px",
  };

  const titleStyle = {
    margin: 0,
    fontSize: "34px",
    fontWeight: "700",
    color: "#1e3a8a",
  };

  const subtitleStyle = {
    marginTop: "12px",
    marginBottom: 0,
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#334155",
  };

  // OPTIONAL QUICK ACTION CARDS (clean UI touch)
  const quickGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #dbeafe",
    padding: "20px",
    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.06)",
  };

  const cardTitleStyle = {
    margin: 0,
    fontSize: "16px",
    fontWeight: "700",
    color: "#1e3a8a",
  };

  const cardTextStyle = {
    marginTop: "8px",
    fontSize: "14px",
    color: "#64748b",
  };

  return (
    <div style={pageWrapperStyle}>
      
      {/* ================= HERO SECTION ================= */}
      <section style={heroStyle}>
        <div style={contentStyle}>
          <h1 style={titleStyle}>Welcome back, Admin</h1>
          <p style={subtitleStyle}>
            Monitor attendance, manage teachers, students and classes, and quickly
            review reports and analytics from one central dashboard.
          </p>
        </div>
      </section>

      {/* ================= QUICK OVERVIEW CARDS ================= */}
      <div style={quickGridStyle}>
        <div style={cardStyle}>
          <h4 style={cardTitleStyle}>Teachers</h4>
          <p style={cardTextStyle}>
            Add and manage teaching staff efficiently.
          </p>
        </div>

        <div style={cardStyle}>
          <h4 style={cardTitleStyle}>Students</h4>
          <p style={cardTextStyle}>
            Register, enroll, and track student records.
          </p>
        </div>

        <div style={cardStyle}>
          <h4 style={cardTitleStyle}>Classes</h4>
          <p style={cardTextStyle}>
            Organize classrooms and assign teachers.
          </p>
        </div>

        <div style={cardStyle}>
          <h4 style={cardTitleStyle}>Attendance</h4>
          <p style={cardTextStyle}>
            Generate reports and monitor attendance trends.
          </p>
        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;