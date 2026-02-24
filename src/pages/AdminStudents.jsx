import { useEffect, useState } from 'react';
import axios from 'axios';

function AdminStudents() {

  const [students, setStudents] = useState([]);

  const [admissionNumber, setAdmissionNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchStudents();
  }, []);

  // ================= FETCH STUDENTS =================
  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/api/students/',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error.response?.data);
    }
  };

  // ================= CREATE OR UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      admission_number: admissionNumber,
      first_name: firstName,
      last_name: lastName,
      gender: gender,
      date_of_birth: dateOfBirth || null,
    };

    try {
      if (isEditing) {
        await axios.put(
          `http://127.0.0.1:8000/api/students/${admissionNumber}/`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://127.0.0.1:8000/api/students/',
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      resetForm();
      fetchStudents();

    } catch (error) {
      console.error("Error saving student:", error.response?.data);
    }
  };

  // ================= EDIT =================
  const handleEdit = (student) => {
    setAdmissionNumber(student.admission_number);
    setFirstName(student.first_name);
    setLastName(student.last_name);
    setGender(student.gender);
    setDateOfBirth(student.date_of_birth || '');
    setIsEditing(true);
  };

  // ================= DELETE =================
  const handleDelete = async (admissionNumber) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/students/${admissionNumber}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error.response?.data);
    }
  };

  // ================= RESET FORM =================
  const resetForm = () => {
    setAdmissionNumber('');
    setFirstName('');
    setLastName('');
    setGender('');
    setDateOfBirth('');
    setIsEditing(false);
  };

  return (
    <>
      <h3>Students</h3>

      <h4>{isEditing ? "Edit Student" : "Create Student"}</h4>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>

        <input
          type="text"
          placeholder="Admission Number"
          value={admissionNumber}
          onChange={(e) => setAdmissionNumber(e.target.value)}
          required
          disabled={isEditing}
        />

        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          style={{ marginLeft: '10px' }}
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          style={{ marginLeft: '10px' }}
        />

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
          style={{ marginLeft: '10px' }}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          style={{ marginLeft: '10px' }}
        />

        <button type="submit" style={{ marginLeft: '10px' }}>
          {isEditing ? "Update" : "Create"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={resetForm}
            style={{ marginLeft: '10px' }}
          >
            Cancel
          </button>
        )}

      </form>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Admission No</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Gender</th>
            <th>Date of Birth</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.admission_number}>
              <td>{student.admission_number}</td>
              <td>{student.first_name}</td>
              <td>{student.last_name}</td>
              <td>{student.gender}</td>
              <td>{student.date_of_birth}</td>
              <td>
                <button onClick={() => handleEdit(student)}>
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(student.admission_number)}
                  style={{ marginLeft: '10px', color: 'red' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </>
  );
}

export default AdminStudents;