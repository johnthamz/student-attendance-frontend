import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminTeachersManage() {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [teacherToRemove, setTeacherToRemove] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const teachersPerPage = 5;

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://127.0.0.1:8000/api/teachers/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(res.data);
    } catch (error) {
      console.error("Error fetching teachers:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const confirmRemoveTeacher = async () => {
    if (!teacherToRemove) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/teachers/${teacherToRemove.id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMessage("Teacher removed successfully.");
      setTeacherToRemove(null);
      setOpenDropdownId(null);
      fetchTeachers();
    } catch (error) {
      console.error("Error removing teacher:", error.response?.data);
    }
  };

  const filteredTeachers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return teachers.filter((teacher) => {
      const username = teacher.username?.toLowerCase() || "";
      const fullName =
        `${teacher.first_name || ""} ${teacher.last_name || ""}`.toLowerCase();
      const staffNumber = teacher.staff_number?.toLowerCase() || "";
      const phoneNumber = teacher.phone_number?.toLowerCase() || "";
      const classroom = teacher.classroom_name?.toLowerCase() || "";

      return (
        username.includes(term) ||
        fullName.includes(term) ||
        staffNumber.includes(term) ||
        phoneNumber.includes(term) ||
        classroom.includes(term)
      );
    });
  }, [teachers, searchTerm]);

  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage) || 1;

  const paginatedTeachers = useMemo(() => {
    const startIndex = (currentPage - 1) * teachersPerPage;
    return filteredTeachers.slice(startIndex, startIndex + teachersPerPage);
  }, [filteredTeachers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pageStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };

  const headerRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
  };

  const titleWrapStyle = {
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

  const searchInputStyle = {
    width: "320px",
    maxWidth: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #bfdbfe",
    backgroundColor: "#ffffff",
    outline: "none",
    fontSize: "14px",
    boxShadow: "0 4px 14px rgba(37, 99, 235, 0.08)",
  };

  const notificationStyle = {
    backgroundColor: "#ecfeff",
    color: "#0f766e",
    border: "1px solid #a5f3fc",
    padding: "12px 16px",
    borderRadius: "12px",
    fontWeight: "600",
    boxShadow: "0 8px 20px rgba(6, 182, 212, 0.08)",
  };

  const cardStyle = {
    background: "#ffffff",
    borderRadius: "18px",
    boxShadow: "0 10px 28px rgba(37, 99, 235, 0.08)",
    overflow: "hidden",
    border: "1px solid #dbeafe",
  };

  const tableWrapperStyle = {
    overflowX: "auto",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "900px",
  };

  const thStyle = {
    background: "linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)",
    color: "#ffffff",
    padding: "16px",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "700",
  };

  const tdStyle = {
    padding: "16px",
    borderBottom: "1px solid #e2e8f0",
    color: "#0f172a",
    fontSize: "14px",
  };

  const nameCellStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  };

  const mutedTextStyle = {
    color: "#64748b",
    fontSize: "12px",
  };

  const classBadgeStyle = (assigned) => ({
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    backgroundColor: assigned ? "#dbeafe" : "#f1f5f9",
    color: assigned ? "#1d4ed8" : "#64748b",
  });

  const actionWrapStyle = {
    position: "relative",
    display: "inline-block",
  };

  const actionButtonStyle = {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #bfdbfe",
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    fontWeight: "700",
    cursor: "pointer",
    minWidth: "110px",
    boxShadow: "0 4px 10px rgba(37, 99, 235, 0.08)",
  };

  const dropdownMenuStyle = {
    position: "absolute",
    top: "44px",
    right: 0,
    width: "160px",
    backgroundColor: "#ffffff",
    border: "1px solid #dbeafe",
    borderRadius: "12px",
    boxShadow: "0 14px 28px rgba(15, 23, 42, 0.12)",
    overflow: "hidden",
    zIndex: 20,
    animation: "fadeSlideDown 0.18s ease",
  };

  const dropdownItemStyle = {
    width: "100%",
    padding: "12px 14px",
    border: "none",
    backgroundColor: "#ffffff",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "14px",
    color: "#0f172a",
  };

  const removeItemStyle = {
    ...dropdownItemStyle,
    color: "#dc2626",
  };

  const emptyStateStyle = {
    padding: "26px",
    textAlign: "center",
    color: "#64748b",
    fontWeight: "500",
  };

  const paginationWrapStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    flexWrap: "wrap",
    gap: "12px",
    backgroundColor: "#f8fbff",
  };

  const paginationInfoStyle = {
    color: "#475569",
    fontSize: "14px",
    fontWeight: "500",
  };

  const paginationButtonsStyle = {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  };

  const pageButtonStyle = (disabled) => ({
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #bfdbfe",
    backgroundColor: disabled ? "#e2e8f0" : "#ffffff",
    color: disabled ? "#94a3b8" : "#1d4ed8",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: "700",
  });

  const pageNumberStyle = {
    color: "#1e3a8a",
    fontWeight: "700",
    minWidth: "70px",
    textAlign: "center",
  };

  const modalOverlayStyle = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  };

  const modalCardStyle = {
    width: "100%",
    maxWidth: "430px",
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 24px 48px rgba(15, 23, 42, 0.18)",
    border: "1px solid #dbeafe",
  };

  const modalTitleStyle = {
    margin: "0 0 10px 0",
    fontSize: "22px",
    color: "#1e3a8a",
  };

  const modalTextStyle = {
    margin: "0 0 22px 0",
    color: "#475569",
    lineHeight: "1.5",
  };

  const modalActionsStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
  };

  const cancelButtonStyle = {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",
    color: "#334155",
    fontWeight: "600",
    cursor: "pointer",
  };

  const removeButtonStyle = {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#ef4444",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(239, 68, 68, 0.18)",
  };

  return (
    <div style={pageStyle}>
      <style>
        {`
          @keyframes fadeSlideDown {
            from {
              opacity: 0;
              transform: translateY(-6px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      <div style={headerRowStyle}>
        <div style={titleWrapStyle}>
          <h2 style={titleStyle}>Manage Teachers</h2>
          <p style={subtitleStyle}>
            View, search, edit, and manage teacher records.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search by name, username, staff number, class..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />
      </div>

      {successMessage && <div style={notificationStyle}>{successMessage}</div>}

      <div style={cardStyle}>
        <div style={tableWrapperStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Username</th>
                <th style={thStyle}>Full Name</th>
                <th style={thStyle}>Staff Number</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Class</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td style={emptyStateStyle} colSpan="6">
                    Loading teachers...
                  </td>
                </tr>
              ) : paginatedTeachers.length === 0 ? (
                <tr>
                  <td style={emptyStateStyle} colSpan="6">
                    No teachers found.
                  </td>
                </tr>
              ) : (
                paginatedTeachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td style={tdStyle}>{teacher.username}</td>

                    <td style={tdStyle}>
                      <div style={nameCellStyle}>
                        <span>
                          {teacher.first_name} {teacher.last_name}
                        </span>
                        <span style={mutedTextStyle}>{teacher.email}</span>
                      </div>
                    </td>

                    <td style={tdStyle}>{teacher.staff_number || "-"}</td>
                    <td style={tdStyle}>{teacher.phone_number || "-"}</td>

                    <td style={tdStyle}>
                      <span style={classBadgeStyle(!!teacher.classroom_name)}>
                        {teacher.classroom_name || "Not Assigned"}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      <div style={actionWrapStyle}>
                        <button
                          type="button"
                          style={actionButtonStyle}
                          onClick={() =>
                            setOpenDropdownId(
                              openDropdownId === teacher.id ? null : teacher.id
                            )
                          }
                        >
                          Choose ▾
                        </button>

                        {openDropdownId === teacher.id && (
                          <div style={dropdownMenuStyle}>
                            <button
                              type="button"
                              style={dropdownItemStyle}
                              onClick={() =>
                                navigate(`/admin/teachers/view/${teacher.id}`)
                              }
                            >
                              View
                            </button>

                            <button
                              type="button"
                              style={dropdownItemStyle}
                              onClick={() =>
                                navigate(`/admin/teachers/edit/${teacher.id}`)
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              style={removeItemStyle}
                              onClick={() => setTeacherToRemove(teacher)}
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredTeachers.length > 0 && (
          <div style={paginationWrapStyle}>
            <div style={paginationInfoStyle}>
              Showing {(currentPage - 1) * teachersPerPage + 1} to{" "}
              {Math.min(currentPage * teachersPerPage, filteredTeachers.length)} of{" "}
              {filteredTeachers.length} teachers
            </div>

            <div style={paginationButtonsStyle}>
              <button
                type="button"
                style={pageButtonStyle(currentPage === 1)}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </button>

              <span style={pageNumberStyle}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                style={pageButtonStyle(currentPage === totalPages)}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {teacherToRemove && (
        <div style={modalOverlayStyle}>
          <div style={modalCardStyle}>
            <h3 style={modalTitleStyle}>Remove Teacher</h3>
            <p style={modalTextStyle}>
              Are you sure you want to remove{" "}
              <strong>
                {teacherToRemove.first_name} {teacherToRemove.last_name}
              </strong>
              ? This action cannot be undone.
            </p>

            <div style={modalActionsStyle}>
              <button
                type="button"
                style={cancelButtonStyle}
                onClick={() => setTeacherToRemove(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                style={removeButtonStyle}
                onClick={confirmRemoveTeacher}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTeachersManage;