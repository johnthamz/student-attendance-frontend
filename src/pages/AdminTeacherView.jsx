import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function AdminTeacherView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacher();
  }, []);

  const fetchTeacher = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/teachers/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeacher(res.data);
    } catch (error) {
      console.error("Error fetching teacher:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const pageStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };

  const headerWrapStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  };

  const titleGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  };

  const titleStyle = {
    margin: 0,
    color: "#1e3a8a",
    fontSize: "30px",
    fontWeight: "700",
  };

  const subtitleStyle = {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  };

  const actionsWrapStyle = {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  };

  const backButtonStyle = {
    padding: "11px 16px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",
    color: "#334155",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(15, 23, 42, 0.05)",
  };

  const editButtonStyle = {
    padding: "11px 18px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(37, 99, 235, 0.18)",
  };

  const cardStyle = {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "28px",
    boxShadow: "0 12px 30px rgba(37, 99, 235, 0.08)",
    border: "1px solid #dbeafe",
    maxWidth: "950px",
  };

  const profileHeaderStyle = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e2e8f0",
    flexWrap: "wrap",
  };

  const avatarStyle = {
    width: "68px",
    height: "68px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "700",
    boxShadow: "0 8px 18px rgba(37, 99, 235, 0.18)",
  };

  const profileNameWrapStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  };

  const profileNameStyle = {
    margin: 0,
    color: "#0f172a",
    fontSize: "24px",
    fontWeight: "700",
  };

  const profileMetaStyle = {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  };

  const detailsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
  };

  const detailCardStyle = {
    backgroundColor: "#f8fbff",
    border: "1px solid #dbeafe",
    borderRadius: "16px",
    padding: "18px",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.04)",
  };

  const detailLabelStyle = {
    fontSize: "13px",
    fontWeight: "700",
    color: "#1d4ed8",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  };

  const detailValueStyle = {
    fontSize: "15px",
    color: "#0f172a",
    fontWeight: "500",
    wordBreak: "break-word",
  };

  const badgeStyle = (assigned) => ({
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: "999px",
    backgroundColor: assigned ? "#dbeafe" : "#f1f5f9",
    color: assigned ? "#1d4ed8" : "#64748b",
    fontWeight: "700",
    fontSize: "13px",
  });

  const loadingTextStyle = {
    color: "#475569",
    fontSize: "15px",
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <p style={loadingTextStyle}>Loading teacher information...</p>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div style={pageStyle}>
        <p style={loadingTextStyle}>Teacher information could not be loaded.</p>
      </div>
    );
  }

  const initials = `${teacher.first_name?.[0] || ""}${teacher.last_name?.[0] || ""}`.toUpperCase();

  return (
    <div style={pageStyle}>
      <div style={headerWrapStyle}>
        <div style={titleGroupStyle}>
          <h2 style={titleStyle}>Teacher Details</h2>
          <p style={subtitleStyle}>
            View complete teacher information and manage updates.
          </p>
        </div>

        <div style={actionsWrapStyle}>
          <button
            type="button"
            style={backButtonStyle}
            onClick={() => navigate("/admin/teachers/manage")}
          >
            Back to Manage Teachers
          </button>

          <button
            type="button"
            style={editButtonStyle}
            onClick={() => navigate(`/admin/teachers/edit/${teacher.id}`)}
          >
            Edit Teacher
          </button>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={profileHeaderStyle}>
          <div style={avatarStyle}>{initials || "T"}</div>

          <div style={profileNameWrapStyle}>
            <h3 style={profileNameStyle}>
              {teacher.first_name} {teacher.last_name}
            </h3>
            <p style={profileMetaStyle}>@{teacher.username}</p>
          </div>
        </div>

        <div style={detailsGridStyle}>
          <div style={detailCardStyle}>
            <div style={detailLabelStyle}>Username</div>
            <div style={detailValueStyle}>{teacher.username}</div>
          </div>

          <div style={detailCardStyle}>
            <div style={detailLabelStyle}>Email Address</div>
            <div style={detailValueStyle}>{teacher.email || "-"}</div>
          </div>

          <div style={detailCardStyle}>
            <div style={detailLabelStyle}>First Name</div>
            <div style={detailValueStyle}>{teacher.first_name || "-"}</div>
          </div>

          <div style={detailCardStyle}>
            <div style={detailLabelStyle}>Last Name</div>
            <div style={detailValueStyle}>{teacher.last_name || "-"}</div>
          </div>

          <div style={detailCardStyle}>
            <div style={detailLabelStyle}>Staff Number</div>
            <div style={detailValueStyle}>{teacher.staff_number || "-"}</div>
          </div>

          <div style={detailCardStyle}>
            <div style={detailLabelStyle}>Phone Number</div>
            <div style={detailValueStyle}>{teacher.phone_number || "-"}</div>
          </div>

          <div style={detailCardStyle}>
            <div style={detailLabelStyle}>Assigned Class</div>
            <div style={detailValueStyle}>
              <span style={badgeStyle(!!teacher.classroom_name)}>
                {teacher.classroom_name || "Not Assigned"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminTeacherView;