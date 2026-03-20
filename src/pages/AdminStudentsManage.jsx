import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminStudentsManage() {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const menuRef = useRef(null);

  const studentsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const fetchData = async () => {
    try {
      const [studentsRes, enrollmentsRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/students/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://127.0.0.1:8000/api/enrollments/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setStudents(studentsRes.data);
      setEnrollments(enrollmentsRes.data);
    } catch (error) {
      console.error("Error fetching students:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentClassDisplay = (admissionNumber) => {
    const activeEnrollment = enrollments.find(
      (item) => item.student === admissionNumber && item.status === "active"
    );

    return activeEnrollment ? activeEnrollment.classroom_display : "Not enrolled";
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const query = search.toLowerCase();
      return (
        student.admission_number.toLowerCase().includes(query) ||
        student.first_name.toLowerCase().includes(query) ||
        student.last_name.toLowerCase().includes(query) ||
        (student.parent_guardian_name || "").toLowerCase().includes(query)
      );
    });
  }, [students, search]);

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    return filteredStudents.slice(startIndex, endIndex);
  }, [filteredStudents, currentPage]);

  const handleDelete = async (admissionNumber) => {
    const confirmed = window.confirm("Are you sure you want to remove this student?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/students/${admissionNumber}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOpenMenu(null);
      fetchData();
    } catch (error) {
      console.error("Error deleting student:", error.response?.data || error.message);
      alert("Failed to remove student.");
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
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

  const toolbarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "20px",
  };

  const searchInputStyle = {
    width: "320px",
    maxWidth: "100%",
    padding: "13px 14px",
    borderRadius: "12px",
    border: "1px solid #bfdbfe",
    outline: "none",
    fontSize: "14px",
    backgroundColor: "#f8fbff",
  };

  const tableWrapStyle = {
    overflowX: "auto",
    borderRadius: "16px",
    border: "1px solid #dbeafe",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1100px",
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
    verticalAlign: "top",
  };

  const actionButtonStyle = {
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
    borderRadius: "10px",
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: "600",
  };

  const actionMenuWrapStyle = {
    position: "relative",
    display: "inline-block",
  };

  const actionMenuStyle = {
    position: "absolute",
    top: "44px",
    right: 0,
    minWidth: "150px",
    backgroundColor: "#ffffff",
    border: "1px solid #dbeafe",
    borderRadius: "12px",
    boxShadow: "0 12px 24px rgba(15, 23, 42, 0.10)",
    overflow: "hidden",
    zIndex: 20,
  };

  const actionItemStyle = {
    width: "100%",
    textAlign: "left",
    padding: "12px 14px",
    border: "none",
    backgroundColor: "#ffffff",
    color: "#334155",
    cursor: "pointer",
    fontSize: "14px",
  };

  const emptyStateStyle = {
    padding: "24px",
    textAlign: "center",
    color: "#64748b",
    fontSize: "14px",
  };

  const statusBadgeStyle = (status) => ({
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "capitalize",
    backgroundColor:
      status === "active" ? "#dcfce7" : status === "transferred" ? "#fef3c7" : "#fee2e2",
    color:
      status === "active" ? "#166534" : status === "transferred" ? "#92400e" : "#991b1b",
  });

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

  const startEntry = filteredStudents.length === 0 ? 0 : (currentPage - 1) * studentsPerPage + 1;
  const endEntry = Math.min(currentPage * studentsPerPage, filteredStudents.length);

  return (
    <div style={pageStyle}>
      <div style={headerWrapStyle}>
        <h1 style={titleStyle}>Manage Students</h1>
        <p style={subtitleStyle}>
          Review student records, check class assignment, and use the actions menu to view, edit, or remove a student.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={toolbarStyle}>
          <input
            type="text"
            placeholder="Search by admission number, name, or guardian"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchInputStyle}
          />
        </div>

        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Admission No</th>
                <th style={thStyle}>Student Name</th>
                <th style={thStyle}>Gender</th>
                <th style={thStyle}>Guardian</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Assigned Class</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={emptyStateStyle}>
                    Loading students...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" style={emptyStateStyle}>
                    No students found.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => (
                  <tr key={student.admission_number}>
                    <td style={tdStyle}>{student.admission_number}</td>
                    <td style={tdStyle}>
                      {student.first_name} {student.last_name}
                    </td>
                    <td style={tdStyle}>{student.gender || "-"}</td>
                    <td style={tdStyle}>{student.parent_guardian_name || "-"}</td>
                    <td style={tdStyle}>{student.parent_guardian_phone || "-"}</td>
                    <td style={tdStyle}>{getCurrentClassDisplay(student.admission_number)}</td>
                    <td style={tdStyle}>
                      <span style={statusBadgeStyle(student.status)}>{student.status}</span>
                    </td>
                    <td style={tdStyle}>
                      <div
                        style={actionMenuWrapStyle}
                        ref={openMenu === student.admission_number ? menuRef : null}
                      >
                        <button
                          type="button"
                          style={actionButtonStyle}
                          onClick={() =>
                            setOpenMenu((prev) =>
                              prev === student.admission_number ? null : student.admission_number
                            )
                          }
                        >
                          Actions ▾
                        </button>

                        {openMenu === student.admission_number && (
                          <div style={actionMenuStyle}>
                            <button
                              type="button"
                              style={actionItemStyle}
                              onClick={() => navigate(`/admin/students/view/${student.admission_number}`)}
                            >
                              View
                            </button>

                            <button
                              type="button"
                              style={actionItemStyle}
                              onClick={() => navigate(`/admin/students/edit/${student.admission_number}`)}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              style={{ ...actionItemStyle, color: "#b91c1c" }}
                              onClick={() => handleDelete(student.admission_number)}
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

        {!loading && filteredStudents.length > 0 && (
          <div style={paginationWrapStyle}>
            <div style={paginationInfoStyle}>
              Showing {startEntry} - {endEntry} of {filteredStudents.length} students
            </div>

            <div style={paginationButtonsStyle}>
              <button
                type="button"
                onClick={handlePreviousPage}
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
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                style={paginationButtonStyle(currentPage === totalPages)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminStudentsManage;