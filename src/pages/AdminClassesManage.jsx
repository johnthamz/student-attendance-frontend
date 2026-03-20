import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminClassesManage() {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const menuRef = useRef(null);
  const classesPerPage = 10;

  useEffect(() => {
    fetchClasses();
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

  const fetchClasses = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/classrooms/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = useMemo(() => {
    return classes.filter((classItem) => {
      const query = search.toLowerCase();
      return (
        (classItem.level || "").toLowerCase().includes(query) ||
        (classItem.name || "").toLowerCase().includes(query) ||
        String(classItem.year || "").toLowerCase().includes(query)
      );
    });
  }, [classes, search]);

  const totalPages = Math.ceil(filteredClasses.length / classesPerPage);

  const paginatedClasses = useMemo(() => {
    const startIndex = (currentPage - 1) * classesPerPage;
    const endIndex = startIndex + classesPerPage;
    return filteredClasses.slice(startIndex, endIndex);
  }, [filteredClasses, currentPage]);

  const handleDeleteClass = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this class? This will delete the class record."
    );
    if (!confirmed) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/classrooms/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOpenMenu(null);
      fetchClasses();
    } catch (error) {
      console.error("Error deleting class:", error.response?.data || error.message);
      alert("Failed to remove class.");
    }
  };

  const startEntry = filteredClasses.length === 0 ? 0 : (currentPage - 1) * classesPerPage + 1;
  const endEntry = Math.min(currentPage * classesPerPage, filteredClasses.length);

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
    minWidth: "900px",
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

  const emptyStateStyle = {
    padding: "24px",
    textAlign: "center",
    color: "#64748b",
    fontSize: "14px",
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

  return (
    <div style={pageStyle}>
      <div style={headerWrapStyle}>
        <h1 style={titleStyle}>Manage Classes</h1>
        <p style={subtitleStyle}>
          Review class records, open class details, edit a class, and manage class entries using the actions menu.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={toolbarStyle}>
          <input
            type="text"
            placeholder="Search by level, stream, or year"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchInputStyle}
          />
        </div>

        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Level / Form / Grade</th>
                <th style={thStyle}>Name / Stream</th>
                <th style={thStyle}>Year</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={emptyStateStyle}>
                    Loading classes...
                  </td>
                </tr>
              ) : filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan="5" style={emptyStateStyle}>
                    No classes found.
                  </td>
                </tr>
              ) : (
                paginatedClasses.map((classItem) => (
                  <tr key={classItem.id}>
                    <td style={tdStyle}>{classItem.id}</td>
                    <td style={tdStyle}>{classItem.level}</td>
                    <td style={tdStyle}>{classItem.name}</td>
                    <td style={tdStyle}>{classItem.year || "-"}</td>
                    <td style={tdStyle}>
                      <div
                        style={actionMenuWrapStyle}
                        ref={openMenu === classItem.id ? menuRef : null}
                      >
                        <button
                          type="button"
                          style={actionButtonStyle}
                          onClick={() =>
                            setOpenMenu((prev) => (prev === classItem.id ? null : classItem.id))
                          }
                        >
                          Actions ▾
                        </button>

                        {openMenu === classItem.id && (
                          <div style={actionMenuStyle}>
                            <button
                              type="button"
                              style={actionItemStyle}
                              onClick={() => navigate(`/admin/classes/view/${classItem.id}`)}
                            >
                              View
                            </button>

                            <button
                              type="button"
                              style={actionItemStyle}
                              onClick={() => navigate(`/admin/classes/edit/${classItem.id}`)}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              style={{ ...actionItemStyle, color: "#b91c1c" }}
                              onClick={() => handleDeleteClass(classItem.id)}
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

        {!loading && filteredClasses.length > 0 && (
          <div style={paginationWrapStyle}>
            <div style={paginationInfoStyle}>
              Showing {startEntry} - {endEntry} of {filteredClasses.length} classes
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
      </div>
    </div>
  );
}

export default AdminClassesManage;