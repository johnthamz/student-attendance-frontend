import { useEffect, useState } from "react";
import axios from "axios";

function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [staffNumber, setStaffNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchTeachers();
    fetchClassrooms();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/teachers/",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTeachers(res.data);
    } catch (error) {
      console.error("Error fetching teachers:", error.response?.data);
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

  // ================= CREATE TEACHER =================
  const handleCreateTeacher = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/teachers/",
        {
          username,
          email,
          first_name: firstName,
          last_name: lastName,
          staff_number: staffNumber,
          phone_number: phoneNumber,
          password,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsername("");
      setEmail("");
      setFirstName("");
      setLastName("");
      setStaffNumber("");
      setPhoneNumber("");
      setPassword("");

      fetchTeachers();
    } catch (error) {
      console.error("Error creating teacher:", error.response?.data);
    }
  };

  // ================= EDIT TEACHER =================
  const startEdit = (teacher) => {
    setEditingId(teacher.id);
    setEditData({ ...teacher });
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/teachers/${id}/`,
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditingId(null);
      fetchTeachers();
    } catch (error) {
      console.error("Error updating teacher:", error.response?.data);
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?"))
      return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/teachers/${id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchTeachers();
    } catch (error) {
      console.error("Error deleting teacher:", error.response?.data);
    }
  };

  return (
    <>
      <h3>Teachers</h3>

      {/* ================= CREATE FORM ================= */}
      <form onSubmit={handleCreateTeacher} style={{ marginBottom: "20px" }}>
        <input placeholder="Username" value={username}
          onChange={(e) => setUsername(e.target.value)} required />

        <input placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />

        <input placeholder="First Name" value={firstName}
          onChange={(e) => setFirstName(e.target.value)} required />

        <input placeholder="Last Name" value={lastName}
          onChange={(e) => setLastName(e.target.value)} required />

        <input placeholder="Staff Number" value={staffNumber}
          onChange={(e) => setStaffNumber(e.target.value)} />

        <input placeholder="Phone Number" value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)} />

        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit">Create</button>
      </form>

      {/* ================= TABLE ================= */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Full Name</th>
            <th>Staff No</th>
            <th>Phone</th>
            <th>Class</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.id}>
              <td>{teacher.id}</td>

              {editingId === teacher.id ? (
                <>
                  <td>
                    <input value={editData.username}
                      onChange={(e) =>
                        setEditData({ ...editData, username: e.target.value })
                      } />
                  </td>

                  <td>
                    <input value={editData.first_name}
                      onChange={(e) =>
                        setEditData({ ...editData, first_name: e.target.value })
                      } />
                  </td>

                  <td>
                    <input value={editData.staff_number || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, staff_number: e.target.value })
                      } />
                  </td>

                  <td>
                    <input value={editData.phone_number || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, phone_number: e.target.value })
                      } />
                  </td>

                  <td>
                    <select
                      value={editData.classroom || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          classroom: e.target.value || null,
                        })
                      }
                    >
                      <option value="">-- No Class --</option>
                      {classrooms.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.level} - {cls.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <button onClick={() => handleSaveEdit(teacher.id)}>
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{teacher.username}</td>
                  <td>{teacher.first_name} {teacher.last_name}</td>
                  <td>{teacher.staff_number || "-"}</td>
                  <td>{teacher.phone_number || "-"}</td>
                  <td>{teacher.classroom_name || "Not Assigned"}</td>
                  <td>
                    <button onClick={() => startEdit(teacher)}>Edit</button>
                    <button onClick={() => handleDeleteTeacher(teacher.id)}>
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default AdminTeachers;