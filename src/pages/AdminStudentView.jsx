import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function AdminStudentView() {
  const token = localStorage.getItem("accessToken");
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  const fetchStudentData = async () => {
    try {
      const [studentRes, enrollmentsRes] = await Promise.all([
        axios.get(`http://127.0.0.1:8000/api/students/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://127.0.0.1:8000/api/enrollments/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setStudent(studentRes.data);
      setEnrollments(enrollmentsRes.data);
    } catch (error) {
      console.error("Error fetching student details:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const currentEnrollment = enrollments.find(
    (item) => item.student === id && item.status === "active"
  );

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
    padding: "28px",
    boxShadow: "0 12px 32px rgba(37, 99, 235, 0.10)",
    border: "1px solid #dbeafe",
    maxWidth: "1000px",
  };

  const detailsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
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

  const buttonRowStyle = {
    display: "flex",
    gap: "12px",
    marginTop: "24px",
    flexWrap: "wrap",
  };

  const primaryButtonStyle = {
    background: "linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "12px 18px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 10px 22px rgba(59, 130, 246, 0.22)",
  };

  const secondaryButtonStyle = {
    backgroundColor: "#ffffff",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
    borderRadius: "12px",
    padding: "12px 18px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  };

  if (loading) {
    return <p>Loading student details...</p>;
  }

  if (!student) {
    return <p>Student details could not be loaded.</p>;
  }

  return (
    <div style={pageStyle}>
      <div style={headerWrapStyle}>
        <h1 style={titleStyle}>View Student</h1>
        <p style={subtitleStyle}>
          Review the full student profile and current enrollment details.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={detailsGridStyle}>
          <div style={detailBoxStyle}>
            <div style={detailLabelStyle}>Admission Number</div>
            <div style={detailValueStyle}>{student.admission_number}</div>
          </div>

          <div style={detailBoxStyle}>
            <div style={detailLabelStyle}>First Name</div>
            <div style={detailValueStyle}>{student.first_name || "-"}</div>
          </div>

          <div style={detailBoxStyle}>
            <div style={detailLabelStyle}>Last Name</div>
            <div style={detailValueStyle}>{student.last_name || "-"}</div>
          </div>

          <div style={detailBoxStyle}>
            <div style={detailLabelStyle}>Gender</div>
            <div style={detailValueStyle}>{student.gender || "-"}</div>
          </div>

          <div style={detailBoxStyle}>
            <div style={detailLabelStyle}>Date of Birth</div>
            <div style={detailValueStyle}>{student.date_of_birth || "-"}</div>
          </div>

          <div style={detailBoxStyle}>
            <div style={detailLabelStyle}>Parent/Guardian Name</div>
            <div style={detailValueStyle}>{student.parent_guardian_name || "-"}</div>
          </div>

          <div style={detailBoxStyle}>
            <div style={detailLabelStyle}>Parent/Guardian Phone</div>
            <div style={detailValueStyle}>{student.parent_guardian_phone || "-"}</div>
          </div>

          <div style={detailBoxStyle}>
            <div style={detailLabelStyle}>Previous School</div>
            <div style={detailValueStyle}>{student.previous_school || "-"}</div>
          </div>

          <div style={detailBoxStyle}>
            <div style={detailLabelStyle}>KCPE/KJSEA Index Number</div>
            <div style={detailValueStyle}>{student.kcpe_index_number || "-"}</div>
          </div>

          <div style={detailBoxStyle}>
            <div style={detailLabelStyle}>KCPE/KJSEA Marks or Points</div>
            <div style={detailValueStyle}>{student.kcpe_marks ?? "-"}</div>
          </div>

          <div style={detailBoxStyle}>
            <div style={detailLabelStyle}>Current Class</div>
            <div style={detailValueStyle}>
              {currentEnrollment ? currentEnrollment.classroom_display : "Not enrolled"}
            </div>
          </div>

          <div style={detailBoxStyle}>
            <div style={detailLabelStyle}>Status</div>
            <div style={detailValueStyle}>{student.status || "-"}</div>
          </div>
        </div>

        <div style={buttonRowStyle}>
          <button
            type="button"
            style={primaryButtonStyle}
            onClick={() => navigate(`/admin/students/edit/${student.admission_number}`)}
          >
            Edit Student
          </button>

          <button
            type="button"
            style={secondaryButtonStyle}
            onClick={() => navigate("/admin/students/manage")}
          >
            Back to Manage Students
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminStudentView;