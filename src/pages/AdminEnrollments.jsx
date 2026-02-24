import { useEffect, useState } from 'react';
import axios from 'axios';

function AdminEnrollments() {

  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  const [studentSearch, setStudentSearch] = useState('');
  const [classSearch, setClassSearch] = useState('');

  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [startDate, setStartDate] = useState('');

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchEnrollments();
    fetchStudents();
    fetchClasses();
  }, []);

  // ================= FETCH DATA =================
  const fetchEnrollments = async () => {
    const response = await axios.get(
      'http://127.0.0.1:8000/api/enrollments/',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEnrollments(response.data);
  };

  const fetchStudents = async () => {
    const response = await axios.get(
      'http://127.0.0.1:8000/api/students/',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setStudents(response.data);
  };

  const fetchClasses = async () => {
    const response = await axios.get(
      'http://127.0.0.1:8000/api/classrooms/',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setClasses(response.data);
  };

  // ================= FILTER LOGIC =================
  const filteredStudents = students.filter(student =>
    student.admission_number.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.first_name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.last_name.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredClasses = classes.filter(cls =>
    cls.level.toLowerCase().includes(classSearch.toLowerCase()) ||
    cls.name.toLowerCase().includes(classSearch.toLowerCase())
  );

  // ================= CREATE ENROLLMENT =================
  const handleCreateEnrollment = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/enrollments/',
        {
          student: selectedStudent,
          classroom: selectedClass,
          start_date: startDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedStudent('');
      setSelectedClass('');
      setStartDate('');
      setStudentSearch('');
      setClassSearch('');
      fetchEnrollments();

    } catch (error) {
      console.error("Error creating enrollment:", error.response?.data);
    }
  };

  const handleDeleteEnrollment = async (id) => {
    if (!window.confirm("Delete this enrollment?")) return;

    await axios.delete(
      `http://127.0.0.1:8000/api/enrollments/${id}/`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchEnrollments();
  };

  return (
    <>
      <h3>Enrollments</h3>

      <h4>Create Enrollment</h4>

      <form onSubmit={handleCreateEnrollment} style={{ marginBottom: '20px' }}>

        {/* STUDENT SEARCH */}
        <input
          type="text"
          placeholder="Search Student (Admission or Name)"
          value={studentSearch}
          onChange={(e) => setStudentSearch(e.target.value)}
        />

        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          required
          style={{ marginLeft: '10px' }}
        >
          <option value="">Select Student</option>
          {filteredStudents.map((student) => (
            <option
              key={student.admission_number}
              value={student.admission_number}
            >
              {student.admission_number} - {student.first_name} {student.last_name}
            </option>
          ))}
        </select>

        {/* CLASS SEARCH */}
        <input
          type="text"
          placeholder="Search Class"
          value={classSearch}
          onChange={(e) => setClassSearch(e.target.value)}
          style={{ marginLeft: '10px' }}
        />

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          required
          style={{ marginLeft: '10px' }}
        >
          <option value="">Select Class</option>
          {filteredClasses.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.level} - {cls.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          style={{ marginLeft: '10px' }}
        />

        <button type="submit" style={{ marginLeft: '10px' }}>
          Enroll
        </button>
      </form>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Student</th>
            <th>Class</th>
            <th>Start Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {enrollments.map((enrollment) => (
            <tr key={enrollment.id}>
              <td>{enrollment.id}</td>
              <td>{enrollment.student_name}</td>
              <td>{enrollment.classroom_display}</td>
              <td>{enrollment.start_date}</td>
              <td>
                <button
                  onClick={() => handleDeleteEnrollment(enrollment.id)}
                  style={{ color: 'red' }}
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

export default AdminEnrollments;