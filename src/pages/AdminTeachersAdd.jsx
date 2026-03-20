import { useEffect, useState } from "react";
import axios from "axios";

function AdminTeachersAdd() {
  const token = localStorage.getItem("accessToken");

  const [classrooms, setClassrooms] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    staff_number: "",
    phone_number: "",
    password: "",
    classroom: "",
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/classrooms/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClassrooms(res.data);
    } catch (error) {
      console.error("Error fetching classrooms:", error.response?.data || error.message);
      setErrorMessage("Failed to load classrooms.");
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
      await axios.post(
        "http://127.0.0.1:8000/api/teachers/",
        {
          username: formData.username,
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          staff_number: formData.staff_number,
          phone_number: formData.phone_number,
          password: formData.password,
          classroom: formData.classroom || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMessage("Teacher added successfully.");
      setFormData({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        staff_number: "",
        phone_number: "",
        password: "",
        classroom: "",
      });
    } catch (error) {
      console.error("Error creating teacher:", error.response?.data || error.message);

      const backendError =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "Failed to add teacher. Please check the form and try again.";

      setErrorMessage(backendError);
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

  const loadingTextStyle = {
    color: "#475569",
    fontSize: "15px",
  };

  return (
    <div style={pageStyle}>
      <div style={headerWrapStyle}>
        <h1 style={titleStyle}>Add Teacher</h1>
        <p style={subtitleStyle}>
          Create a new teacher account and assign a class from the dropdown.
        </p>
      </div>

      <div style={cardStyle}>
        {pageLoading ? (
          <p style={loadingTextStyle}>Loading form data...</p>
        ) : (
          <>
            {successMessage && <div style={successBoxStyle}>{successMessage}</div>}
            {errorMessage && <div style={errorBoxStyle}>{errorMessage}</div>}

            <form onSubmit={handleSubmit}>
              <div style={formGridStyle}>
                <div style={fieldGroupStyle}>
                  <label style={labelStyle}>Username</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                </div>

                <div style={fieldGroupStyle}>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={formData.email}
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
                  <label style={labelStyle}>Staff Number</label>
                  <input
                    type="text"
                    name="staff_number"
                    placeholder="Enter staff number"
                    value={formData.staff_number}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                <div style={fieldGroupStyle}>
                  <label style={labelStyle}>Phone Number</label>
                  <input
                    type="text"
                    name="phone_number"
                    placeholder="Enter phone number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                <div style={fieldGroupStyle}>
                  <label style={labelStyle}>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                </div>

                <div style={fieldGroupStyle}>
                  <label style={labelStyle}>Assign Class</label>
                  <select
                    name="classroom"
                    value={formData.classroom}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="">Select a class</option>
                    {classrooms.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.level} - {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ ...fieldGroupStyle, ...fullWidthStyle }}>
                  <div style={actionsStyle}>
                    <button type="submit" disabled={loading} style={buttonStyle}>
                      {loading ? "Adding Teacher..." : "Add Teacher"}
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

export default AdminTeachersAdd;