import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function AdminTeacherEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchTeacher();
    fetchClassrooms();
  }, []);

  const fetchTeacher = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/teachers/${id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const teacher = res.data;

      setFormData({
        username: teacher.username,
        email: teacher.email,
        first_name: teacher.first_name,
        last_name: teacher.last_name,
        staff_number: teacher.staff_number || "",
        phone_number: teacher.phone_number || "",
        password: "",
        classroom: teacher.classroom || "",
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching teacher:", error.response?.data);
    }
  };

  const fetchClassrooms = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/classrooms/",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setClassrooms(res.data);
    } catch (error) {
      console.error("Error fetching classrooms:", error.response?.data);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/teachers/${id}/`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/admin/teachers/manage");
    } catch (error) {
      console.error("Error updating teacher:", error.response?.data);
    }
  };

  if (loading) return <p>Loading teacher...</p>;

  const cardStyle = {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    maxWidth: "900px",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
    marginTop: "20px",
  };

  const inputStyle = {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #cbd5f5",
    fontSize: "14px",
  };

  const labelStyle = {
    fontWeight: "600",
    marginBottom: "5px",
    display: "block",
  };

  const buttonStyle = {
    marginTop: "20px",
    padding: "12px 18px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  };

  return (
    <div>
      <h2 style={{ color: "#1e3a8a" }}>Edit Teacher</h2>

      <div style={cardStyle}>
        <form onSubmit={handleSave}>
          <div style={gridStyle}>
            <div>
              <label style={labelStyle}>Username</label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>First Name</label>
              <input
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Last Name</label>
              <input
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Staff Number</label>
              <input
                name="staff_number"
                value={formData.staff_number}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Phone Number</label>
              <input
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Change Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Leave blank if unchanged"
              />
            </div>

            <div>
              <label style={labelStyle}>Assign Class</label>
              <select
                name="classroom"
                value={formData.classroom || ""}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">No Class</option>
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.level} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" style={buttonStyle}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminTeacherEdit;