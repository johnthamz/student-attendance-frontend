import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function AdminClassEdit() {
  const token = localStorage.getItem("accessToken");
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    level: "",
    name: "",
    year: "",
  });

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchClassroom();
  }, [id]);

  const fetchClassroom = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/classrooms/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFormData({
        level: response.data.level || "",
        name: response.data.name || "",
        year:
          response.data.year !== null && response.data.year !== undefined
            ? String(response.data.year)
            : "",
      });
    } catch (error) {
      console.error("Error loading class:", error.response?.data || error.message);
      setErrorMessage("Failed to load class details.");
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (successMessage) setSuccessMessage("");
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/classrooms/${id}/`,
        {
          level: formData.level,
          name: formData.name,
          year: formData.year ? Number(formData.year) : null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMessage("Class updated successfully.");
    } catch (error) {
      console.error("Error updating class:", error.response?.data || error.message);

      const backendError =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "Failed to update class. Please check the form and try again.";

      setErrorMessage(
        typeof backendError === "string"
          ? backendError
          : "Failed to update class. Please check the form and try again."
      );
    } finally {
      setLoading(false);
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
    padding: "28px",
    boxShadow: "0 12px 32px rgba(37, 99, 235, 0.10)",
    border: "1px solid #dbeafe",
    maxWidth: "1000px",
  };

  const formGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
  };

  const fieldGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const labelStyle = {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e3a8a",
  };

  const inputStyle = {
    padding: "13px 14px",
    borderRadius: "12px",
    border: "1px solid #bfdbfe",
    outline: "none",
    fontSize: "14px",
    backgroundColor: "#f8fbff",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.03)",
  };

  const fullWidthStyle = {
    gridColumn: "1 / -1",
  };

  const infoBoxStyle = {
    marginBottom: "18px",
    padding: "12px 14px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "500",
  };

  const successBoxStyle = {
    ...infoBoxStyle,
    backgroundColor: "#ecfeff",
    color: "#0f766e",
    border: "1px solid #a5f3fc",
  };

  const errorBoxStyle = {
    ...infoBoxStyle,
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
  };

  const buttonRowStyle = {
    marginTop: "28px",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  };

  const primaryButtonStyle = {
    background: loading
      ? "#93c5fd"
      : "linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "14px 24px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: loading ? "not-allowed" : "pointer",
    boxShadow: "0 10px 22px rgba(59, 130, 246, 0.22)",
  };

  const secondaryButtonStyle = {
    backgroundColor: "#ffffff",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
    borderRadius: "12px",
    padding: "14px 24px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  };

  const loadingTextStyle = {
    color: "#475569",
    fontSize: "15px",
  };

  return (
    <div style={pageStyle}>
      <div style={headerWrapStyle}>
        <h1 style={titleStyle}>Edit Class</h1>
        <p style={subtitleStyle}>
          Update class details while keeping the same clean structure used for class creation.
        </p>
      </div>

      <div style={cardStyle}>
        {pageLoading ? (
          <p style={loadingTextStyle}>Loading class details...</p>
        ) : (
          <>
            {successMessage && <div style={successBoxStyle}>{successMessage}</div>}
            {errorMessage && <div style={errorBoxStyle}>{errorMessage}</div>}

            <form onSubmit={handleSubmit}>
              <div style={formGridStyle}>
                <div style={fieldGroupStyle}>
                  <label style={labelStyle}>Level / Form / Grade</label>
                  <input
                    type="text"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                </div>

                <div style={fieldGroupStyle}>
                  <label style={labelStyle}>Name / Stream</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                </div>

                <div style={fieldGroupStyle}>
                  <label style={labelStyle}>Year</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                </div>

                <div style={{ ...fieldGroupStyle, ...fullWidthStyle }}>
                  <div style={buttonRowStyle}>
                    <button type="submit" disabled={loading} style={primaryButtonStyle}>
                      {loading ? "Updating Class..." : "Update Class"}
                    </button>

                    <button
                      type="button"
                      style={secondaryButtonStyle}
                      onClick={() => navigate("/admin/classes/manage")}
                    >
                      Back to Manage Classes
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminClassEdit;