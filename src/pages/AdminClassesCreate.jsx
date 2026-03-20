import { useState } from "react";
import axios from "axios";

function AdminClassesCreate() {
  const token = localStorage.getItem("accessToken");

  const [formData, setFormData] = useState({
    level: "",
    name: "",
    year: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
      await axios.post(
        "http://127.0.0.1:8000/api/classrooms/",
        {
          level: formData.level,
          name: formData.name,
          year: formData.year ? Number(formData.year) : null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMessage("Class created successfully.");
      setFormData({
        level: "",
        name: "",
        year: "",
      });
    } catch (error) {
      console.error("Error creating class:", error.response?.data || error.message);

      const backendError =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "Failed to create class. Please check the form and try again.";

      setErrorMessage(
        typeof backendError === "string"
          ? backendError
          : "Failed to create class. Please check the form and try again."
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

  const actionsStyle = {
    marginTop: "28px",
    display: "flex",
    justifyContent: "flex-start",
  };

  const buttonStyle = {
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

  return (
    <div style={pageStyle}>
      <div style={headerWrapStyle}>
        <h1 style={titleStyle}>Create Class</h1>
        <p style={subtitleStyle}>
          Set up a new class by providing the level, stream, and academic year.
        </p>
      </div>

      <div style={cardStyle}>
        {successMessage && <div style={successBoxStyle}>{successMessage}</div>}
        {errorMessage && <div style={errorBoxStyle}>{errorMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div style={formGridStyle}>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Level / Form / Grade</label>
              <input
                type="text"
                name="level"
                placeholder="Enter level, form, or grade"
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
                placeholder="Enter class name or stream"
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
                placeholder="Enter academic year"
                value={formData.year}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ ...fieldGroupStyle, ...fullWidthStyle }}>
              <div style={actionsStyle}>
                <button type="submit" disabled={loading} style={buttonStyle}>
                  {loading ? "Creating Class..." : "Create Class"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminClassesCreate;