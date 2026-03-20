import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function AdminClassView() {
  const token = localStorage.getItem("accessToken");
  const { id } = useParams();
  const navigate = useNavigate();

  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  useEffect(() => {
    fetchClassData();
  }, [id]);

  const fetchClassData = async () => {
    try {
      const [classRes, studentsRes, enrollmentsRes] = await Promise.all([
        axios.get(`http://127.0.0.1:8000/api/classrooms/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://127.0.0.1:8000/api/students/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://127.0.0.1:8000/api/enrollments/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setClassroom(classRes.data);
      setStudents(studentsRes.data);
      setEnrollments(enrollmentsRes.data);
    } catch (error) {
      console.error("Error loading class details:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const enrolledStudents = useMemo(() => {
    const classEnrollments = enrollments.filter(
      (item) => String(item.classroom) === String(id) && item.status === "active"
    );

    return classEnrollments.map((enrollment) => {
      const student = students.find(
        (studentItem) => studentItem.admission_number === enrollment.student
      );

      return {
        admission_number: enrollment.student,
        student_name: student
          ? `${student.first_name} ${student.last_name}`
          : enrollment.student_name,
        enrollment_date: enrollment.start_date,
      };
    });
  }, [enrollments, students, id]);

  const totalPages = Math.ceil(enrolledStudents.length / studentsPerPage);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    return enrolledStudents.slice(startIndex, endIndex);
  }, [enrolledStudents, currentPage]);

  const detailGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginBottom: "24px",
  };

  const detailBoxStyle = {
    backgroundColor: "#f8fbff",
    border: "1px solid #dbeafe",
    borderRadius: "14px",
    padding: "16px",
  };

  const detailLabelStyle = {
    fontSize: "13px",
    fontWeight: "700",
    color: "#1e3a8a",
    marginBottom: "8px",
  };

  const detailValueStyle = {
    fontSize: "14px",
    color: "#334155",
  };

  const pageStyle = {
    minHeight: "100%",
    backgroundColor: "#f8fbff",
  };

  const headerWrapStyle = {
    marginBottom: "24px",
  };

  const titleStyle = {
    margin: 0,
    fontSize: "30px",
    fontWeight: "700",
    color: "#1e3a8a",
  };

  const subtitleStyle = {
    marginTop: "8px",
    color: "#475569",
    fontSize: "15px",
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 12px 32px rgba(37, 99, 235, 0.10)",
    border: "1px solid #dbeafe",
  };

  const tableWrapStyle = {
    overflowX: "auto",
    borderRadius: "16px",
    border: "1px solid #dbeafe",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "700px",
  };

  const thStyle = {
    textAlign: "left",
    padding: "14px 16px",
    backgroundColor: "#eff6ff",
    color: "#1e3a8a",
    fontSize: "13px",
    fontWeight: "700",
    borderBottom: "1px solid #dbeafe",
  };

  const tdStyle = {
    padding: "14px 16px",
    borderBottom: "1px solid #e2e8f0",
    fontSize: "14px",
    color: "#334155",
    backgroundColor: "#ffffff",
  };

  const emptyStateStyle = {
    padding: "24px",
    textAlign: "center",
    color: "#64748b",
    fontSize: "14px",
  };

  const buttonStyle = {
    backgroundColor: "#ffffff",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
    borderRadius: "12px",
    padding: "12px 18px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "24px",
  };

  const paginationWrapStyle = {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  };

  const paginationInfoStyle = {
    fontSize: "14px",
    color: "#475569",
    fontWeight: "500",
  };

  const paginationButtonsStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const paginationButtonStyle = (disabled) => ({
    padding: "10px 16px",
    borderRadius: "10px",
    border: "1px solid #bfdbfe",
    backgroundColor: disabled ? "#e2e8f0" : "#eff6ff",
    color: disabled ? "#94a3b8" : "#1d4ed8",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: "600",
  });

  const pageNumberStyle = {
    padding: "10px 14px",
    borderRadius: "10px",
    backgroundColor: "#dbeafe",
    color: "#1e3a8a",
    fontWeight: "700",
    fontSize: "14px",
  };

  if (loading) {
    return <p>Loading class details...</p>;
  }

  if (!classroom) {
    return <p>Class details could not be loaded.</p>;
  }

  const startEntry = enrolledStudents.length === 0 ? 0 : (currentPage - 1) * studentsPerPage + 1;
  const endEntry = Math.min(currentPage * studentsPerPage, enrolledStudents.length);

  return (
    <div style={pageStyle}>
      <div style={headerWrapStyle}>
        <h1 style={titleStyle}>View Class</h1>
        <p style={subtitleStyle}>
          Review class information and see the enrolled students for this class.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={detailGridStyle}>
          <div style={detailBoxStyle}>
            <div style={detailLabelStyle}>Class ID</div>
            <div style={detailValueStyle}>{classroom.id}</div>
          </div>

          <div style={detailBoxStyle}>
            <div style={detailLabelStyle}>Level / Form / Grade</div>
            <div style={detailValueStyle}>{classroom.level || "-"}</div>
          </div>

          <div style={detailBoxStyle}>
            <div style={detailLabelStyle}>Name / Stream</div>
            <div style={detailValueStyle}>{classroom.name || "-"}</div>
          </div>

          <div style={detailBoxStyle}>
            <div style={detailLabelStyle}>Year</div>
            <div style={detailValueStyle}>{classroom.year || "-"}</div>
          </div>
        </div>

        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Admission Number</th>
                <th style={thStyle}>Student Name</th>
                <th style={thStyle}>Enrollment Date</th>
              </tr>
            </thead>

            <tbody>
              {enrolledStudents.length === 0 ? (
                <tr>
                  <td colSpan="3" style={emptyStateStyle}>
                    No students enrolled in this class.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => (
                  <tr key={`${student.admission_number}-${student.enrollment_date}`}>
                    <td style={tdStyle}>{student.admission_number}</td>
                    <td style={tdStyle}>{student.student_name}</td>
                    <td style={tdStyle}>{student.enrollment_date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {enrolledStudents.length > 0 && (
          <div style={paginationWrapStyle}>
            <div style={paginationInfoStyle}>
              Showing {startEntry} - {endEntry} of {enrolledStudents.length} students
            </div>

            <div style={paginationButtonsStyle}>
              <button
                type="button"
                onClick={() => currentPage > 1 && setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
                style={paginationButtonStyle(currentPage === 1)}
              >
                Previous
              </button>

              <span style={pageNumberStyle}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => currentPage < totalPages && setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
                style={paginationButtonStyle(currentPage === totalPages)}
              >
                Next
              </button>
            </div>
          </div>
        )}

        <button type="button" style={buttonStyle} onClick={() => navigate("/admin/classes/manage")}>
          Back to Manage Classes
        </button>
      </div>
    </div>
  );
}

export default AdminClassView;