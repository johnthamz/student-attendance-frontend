import { useState } from "react";
import axios from "axios";

function AdminStudentsAdd() {
  const token = localStorage.getItem("accessToken");

  const [formData, setFormData] = useState({
    admission_number: "",
    first_name: "",
    last_name: "",
    parent_guardian_name: "",
    parent_guardian_phone: "",
    gender: "",
    date_of_birth: "",
    previous_school: "",
    kcpe_index_number: "",
    kcpe_marks: "",
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
        "http://127.0.0.1:8000/api/students/",
        {
          admission_number: formData.admission_number,
          first_name: formData.first_name,
          last_name: formData.last_name,
          parent_guardian_name: formData.parent_guardian_name || null,
          parent_guardian_phone: formData.parent_guardian_phone || null,
          gender: formData.gender,
          date_of_birth: formData.date_of_birth || null,
          previous_school: formData.previous_school || null,
          kcpe_index_number: formData.kcpe_index_number || null,
          kcpe_marks: formData.kcpe_marks ? Number(formData.kcpe_marks) : null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMessage("Student added successfully.");
      setFormData({
        admission_number: "",
        first_name: "",
        last_name: "",
        parent_guardian_name: "",
        parent_guardian_phone: "",
        gender: "",
        date_of_birth: "",
        previous_school: "",
        kcpe_index_number: "",
        kcpe_marks: "",
      });
    } catch (error) {
      console.error("Error creating student:", error.response?.data || error.message);

      const backendError =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "Failed to add student. Please check the form and try again.";

      setErrorMessage(
        typeof backendError === "string"
          ? backendError
          : "Failed to add student. Please check the form and try again."
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
        <h1 style={titleStyle}>Add Student</h1>
        <p style={subtitleStyle}>
          Create a new student profile and capture the required admission and guardian details.
        </p>
      </div>

      <div style={cardStyle}>
        {successMessage && <div style={successBoxStyle}>{successMessage}</div>}
        {errorMessage && <div style={errorBoxStyle}>{errorMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div style={formGridStyle}>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Admission Number</label>
              <input
                type="text"
                name="admission_number"
                placeholder="Enter admission number"
                value={formData.admission_number}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>First Name</label>
              <input
                type="text"
                name="first_name"
                placeholder="Enter first name"
                value={formData.first_name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Last Name</label>
              <input
                type="text"
                name="last_name"
                placeholder="Enter last name"
                value={formData.last_name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Parent/Guardian Name</label>
              <input
                type="text"
                name="parent_guardian_name"
                placeholder="Enter parent or guardian full name"
                value={formData.parent_guardian_name}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Parent/Guardian Phone Number</label>
              <input
                type="text"
                name="parent_guardian_phone"
                placeholder="Enter phone number"
                value={formData.parent_guardian_phone}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                style={inputStyle}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Date of Birth</label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Previous School</label>
              <input
                type="text"
                name="previous_school"
                placeholder="Enter previous school"
                value={formData.previous_school}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>KCPE/KJSEA Index or Assessment Number</label>
              <input
                type="text"
                name="kcpe_index_number"
                placeholder="Enter index or assessment number"
                value={formData.kcpe_index_number}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>KCPE/KJSEA Marks or Points</label>
              <input
                type="number"
                name="kcpe_marks"
                placeholder="Enter marks or points"
                value={formData.kcpe_marks}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={{ ...fieldGroupStyle, ...fullWidthStyle }}>
              <div style={actionsStyle}>
                <button type="submit" disabled={loading} style={buttonStyle}>
                  {loading ? "Adding Student..." : "Add Student"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminStudentsAdd;