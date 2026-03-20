import { useEffect, useMemo, useState } from "react";
import axios from "axios";

function AdminStudentsEnroll() {
  const token = localStorage.getItem("accessToken");

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [startDate, setStartDate] = useState("");

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchPageData = async () => {
    try {
      const [studentsRes, classesRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/students/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://127.0.0.1:8000/api/classrooms/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setStudents(studentsRes.data);
      setClasses(classesRes.data);
    } catch (error) {
      console.error("Error loading enrollment form data:", error.response?.data || error.message);
      setErrorMessage("Failed to load students or classes.");
    } finally {
      setPageLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const search = studentSearch.toLowerCase();
      return (
        student.admission_number.toLowerCase().includes(search) ||
        student.first_name.toLowerCase().includes(search) ||
        student.last_name.toLowerCase().includes(search)
      );
    });
  }, [students, studentSearch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/enrollments/",
        {
          student: selectedStudent,
          classroom: selectedClass,
          start_date: startDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMessage("Student enrolled successfully.");
      setStudentSearch("");
      setSelectedStudent("");
      setSelectedClass("");
      setStartDate("");
    } catch (error) {
      console.error("Error enrolling student:", error.response?.data || error.message);

      const backendError =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "Failed to enroll student. Please check the form and try again.";

      setErrorMessage(
        typeof backendError === "string"
          ? backendError
          : "Failed to enroll student. Please check the form and try again."
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

  const actionsStyle = {
    marginTop: "28px",
    display: "flex",
    justifyContent: "flex-start",
  };

  const loadingTextStyle = {
    color: "#475569",
    fontSize: "15px",
  };

  return (
    <div style={pageStyle}>
      <div style={headerWrapStyle}>
        <h1 style={titleStyle}>Enroll Student</h1>
        <p style={subtitleStyle}>
          Search for a student, assign the correct class, and capture the date of enrollment.
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
                  <label style={labelStyle}>Search Student by Admission Number</label>
                  <input
                    type="text"
                    placeholder="Type admission number or student name"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div style={fieldGroupStyle}>
                  <label style={labelStyle}>Select Student</label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    required
                    style={inputStyle}
                  >
                    <option value="">Select student</option>
                    {filteredStudents.map((student) => (
                      <option key={student.admission_number} value={student.admission_number}>
                        {student.admission_number} - {student.first_name} {student.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={fieldGroupStyle}>
                  <label style={labelStyle}>Assign Class</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    required
                    style={inputStyle}
                  >
                    <option value="">Select class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.level} - {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={fieldGroupStyle}>
                  <label style={labelStyle}>Date of Enrollment</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={actionsStyle}>
                    <button type="submit" disabled={loading} style={buttonStyle}>
                      {loading ? "Enrolling..." : "Enroll"}
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

export default AdminStudentsEnroll;