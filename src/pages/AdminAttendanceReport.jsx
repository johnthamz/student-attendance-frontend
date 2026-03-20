import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

function AdminAttendanceReport() {
  const token = localStorage.getItem("accessToken");

  const [classrooms, setClassrooms] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [reportMeta, setReportMeta] = useState(null);
  const [summary, setSummary] = useState(null);
  const [reportData, setReportData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [activeActionStudentId, setActiveActionStudentId] = useState(null);
  const [viewStudent, setViewStudent] = useState(null);
  const [printStudent, setPrintStudent] = useState(null);

  const printAreaRef = useRef(null);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/classrooms/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClassrooms(res.data);
      } catch (error) {
        console.error("Error fetching classrooms", error);
        setPageError("Failed to load classrooms.");
      }
    };

    fetchClassrooms();
  }, [token]);

  useEffect(() => {
    const handleCloseDropdown = () => setActiveActionStudentId(null);
    window.addEventListener("click", handleCloseDropdown);

    return () => {
      window.removeEventListener("click", handleCloseDropdown);
    };
  }, []);

  const selectedClassroomName = useMemo(() => {
    const classroom = classrooms.find(
      (cls) => String(cls.id) === String(selectedClass)
    );
    return classroom ? `${classroom.level} - ${classroom.name}` : "Selected Class";
  }, [classrooms, selectedClass]);

  const lowAttendanceStudents = useMemo(
    () => reportData.filter((student) => student.low_attendance),
    [reportData]
  );

  const attendanceHealth = useMemo(() => {
    if (!summary) return "Good";
    if (summary.average_attendance >= 85) return "Excellent";
    if (summary.average_attendance >= 75) return "Good";
    if (summary.average_attendance >= 60) return "Needs Attention";
    return "Critical";
  }, [summary]);

  const generateReport = async () => {
    setPageError("");
    setSuccessMessage("");
    setViewStudent(null);
    setPrintStudent(null);
    setActiveActionStudentId(null);

    if (!selectedClass || !startDate || !endDate) {
      setPageError("Please select class, start date, and end date.");
      return;
    }

    if (startDate > endDate) {
      setPageError("Start date cannot be later than end date.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/reports/attendance/?classroom=${selectedClass}&start_date=${startDate}&end_date=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const payload = res.data;

      setReportMeta(payload.report_meta || null);
      setSummary(payload.summary || null);
      setReportData(payload.students || []);
      setSuccessMessage("Attendance report generated successfully.");
    } catch (error) {
      console.error(error.response?.data || error.message);
      setPageError(
        error.response?.data?.error ||
          "No report data found for the selected period."
      );
      setReportMeta(null);
      setSummary(null);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewStudent = (student) => {
    setViewStudent(student);
    setPrintStudent(null);
    setActiveActionStudentId(null);
  };

  const handlePrintStudent = (student) => {
    setPrintStudent(student);
    setViewStudent(null);
    setActiveActionStudentId(null);
  };

  const handlePrint = () => {
    const printContents = printAreaRef.current?.innerHTML;
    if (!printContents) return;

    const printWindow = window.open("", "_blank", "width=1000,height=700");
    printWindow.document.write(`
      <html>
        <head>
          <title>Student Attendance Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 32px;
              color: #0f172a;
              background: #ffffff;
            }
            .print-wrapper {
              max-width: 900px;
              margin: 0 auto;
            }
            .print-title {
              font-size: 28px;
              font-weight: 700;
              color: #1e3a8a;
              margin-bottom: 6px;
            }
            .print-subtitle {
              font-size: 14px;
              color: #475569;
              margin-bottom: 24px;
            }
            .print-card {
              border: 1px solid #dbeafe;
              border-radius: 14px;
              padding: 20px;
              margin-bottom: 20px;
              background: #ffffff;
            }
            .print-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 14px;
              margin-top: 18px;
            }
            .print-item {
              background: #f8fbff;
              border: 1px solid #e2e8f0;
              border-radius: 10px;
              padding: 12px;
            }
            .percentage-box {
              margin-top: 18px;
              background: #eff6ff;
              border: 1px solid #bfdbfe;
              border-radius: 12px;
              padding: 14px;
              text-align: center;
            }
            .percentage-value {
              font-size: 32px;
              font-weight: 700;
              color: #1d4ed8;
            }
            .meta-label {
              font-size: 12px;
              color: #64748b;
              margin-bottom: 6px;
            }
            .meta-value {
              font-size: 16px;
              font-weight: 700;
              color: #0f172a;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div style={pageWrapperStyle}>
      <div style={pageHeaderStyle}>
        <div>
          <h2 style={pageTitleStyle}>Attendance Reports</h2>
          <p style={pageSubtitleStyle}>
            Generate attendance reports by class and date period, review students
            below the expected threshold, and print individual attendance summaries.
          </p>
        </div>
      </div>

      <div style={formCardStyle}>
        <div style={formCardHeaderStyle}>
          <h3 style={sectionTitleStyle}>Generate Attendance Report</h3>
          <p style={sectionSubtitleStyle}>
            Select a class and a date period to generate the attendance report.
          </p>
        </div>

        <div style={formGridStyle}>
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={inputStyle}
            >
              <option value="">Choose class</option>
              {classrooms.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.level} - {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={formActionRowStyle}>
          <button
            onClick={generateReport}
            style={{
              ...primaryButtonStyle,
              opacity: loading ? 0.85 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Report"}
          </button>
        </div>

        {pageError ? <div style={errorBoxStyle}>{pageError}</div> : null}
        {successMessage ? <div style={successBoxStyle}>{successMessage}</div> : null}
      </div>

      {summary && reportMeta && (
        <>
          <div style={summaryHeaderRowStyle}>
            <div>
              <h3 style={sectionTitleStyle}>Report Summary</h3>
              <p style={sectionSubtitleStyle}>
                {reportMeta.classroom_name || selectedClassroomName} •{" "}
                {reportMeta.start_date} to {reportMeta.end_date}
              </p>
            </div>
            <div style={summaryTagStyle}>{attendanceHealth}</div>
          </div>

          <div style={statsGridStyle}>
            <div style={statCardStyle}>
              <p style={statLabelStyle}>Total Students</p>
              <h3 style={statValueStyle}>{summary.total_students}</h3>
              <p style={statSubtextStyle}>Students included in this report</p>
            </div>

            <div style={statCardStyle}>
              <p style={statLabelStyle}>Average Attendance</p>
              <h3 style={statValueStyle}>{summary.average_attendance}%</h3>
              <p style={statSubtextStyle}>Overall class attendance for selected period</p>
            </div>

            <div style={statCardAlertStyle}>
              <p style={statLabelStyle}>Students Below 75%</p>
              <h3 style={statValueStyle}>{summary.students_below_75}</h3>
              <p style={statSubtextStyle}>Require close follow-up and monitoring</p>
            </div>

            <div style={statCardStyle}>
              <p style={statLabelStyle}>Reporting Period</p>
              <h3 style={statValueStyleSmallStyle}>{reportMeta.total_sessions || 0}</h3>
              <p style={statSubtextStyle}>Attendance session(s) recorded</p>
            </div>
          </div>

          <div style={contentGridStyle}>
            <div style={panelCardStyle}>
              <div style={panelCardHeaderStyle}>
                <h3 style={panelTitleStyle}>Students Below 75%</h3>
                <span style={panelBadgeStyle}>{lowAttendanceStudents.length}</span>
              </div>

              {lowAttendanceStudents.length === 0 ? (
                <p style={emptyStateStyle}>
                  No students are below 75% attendance for the selected period.
                </p>
              ) : (
                <div style={riskListStyle}>
                  {lowAttendanceStudents.map((student) => (
                    <div key={student.student_id} style={riskItemStyle}>
                      <div>
                        <p style={riskNameStyle}>{student.student_name}</p>
                        <p style={riskMetaStyle}>{student.admission_number}</p>
                      </div>
                      <div style={riskPercentBadgeStyle}>
                        {student.attendance_percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={panelCardStyle}>
              <div style={panelCardHeaderStyle}>
                <h3 style={panelTitleStyle}>Report Table</h3>
                <span style={panelBadgeBlueStyle}>{reportData.length} Students</span>
              </div>

              <div style={tableWrapperStyle}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Student Name</th>
                      <th style={thStyle}>Admission No.</th>
                      <th style={thStyle}>Present</th>
                      <th style={thStyle}>Absent</th>
                      <th style={thStyle}>Attendance %</th>
                      <th style={thStyle}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((student) => (
                      <tr
                        key={student.student_id}
                        style={
                          student.low_attendance
                            ? lowAttendanceRowStyle
                            : normalRowStyle
                        }
                      >
                        <td style={tdStyle}>{student.student_name}</td>
                        <td style={tdStyle}>{student.admission_number}</td>
                        <td style={tdStyle}>{student.present}</td>
                        <td style={tdStyle}>{student.absent}</td>
                        <td style={tdStyle}>
                          <span
                            style={
                              student.low_attendance
                                ? attendanceBadgeDangerStyle
                                : attendanceBadgeStyle
                            }
                          >
                            {student.attendance_percentage}%
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <div
                            style={actionWrapStyle}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              style={actionButtonStyle}
                              onClick={() =>
                                setActiveActionStudentId((prev) =>
                                  prev === student.student_id ? null : student.student_id
                                )
                              }
                            >
                              Actions ▾
                            </button>

                            {activeActionStudentId === student.student_id && (
                              <div style={dropdownMenuStyle}>
                                <button
                                  style={dropdownItemStyle}
                                  onClick={() => handleViewStudent(student)}
                                >
                                  View
                                </button>
                                <button
                                  style={dropdownItemStyle}
                                  onClick={() => handlePrintStudent(student)}
                                >
                                  Print Report
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {reportData.length === 0 && (
                      <tr>
                        <td style={emptyTableCellStyle} colSpan={6}>
                          No report records available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {viewStudent && (
        <div style={modalOverlayStyle} onClick={() => setViewStudent(null)}>
          <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <div>
                <h3 style={modalTitleStyle}>Student Attendance Summary</h3>
                <p style={modalSubtitleStyle}>
                  {reportMeta?.classroom_name || selectedClassroomName} •{" "}
                  {reportMeta?.start_date || startDate} to{" "}
                  {reportMeta?.end_date || endDate}
                </p>
              </div>
              <button
                style={modalCloseButtonStyle}
                onClick={() => setViewStudent(null)}
              >
                ✕
              </button>
            </div>

            <div style={detailGridStyle}>
              <div style={detailCardStyle}>
                <p style={detailLabelStyle}>Student Name</p>
                <h4 style={detailValueStyle}>{viewStudent.student_name}</h4>
              </div>

              <div style={detailCardStyle}>
                <p style={detailLabelStyle}>Admission Number</p>
                <h4 style={detailValueStyle}>{viewStudent.admission_number}</h4>
              </div>

              <div style={detailCardStyle}>
                <p style={detailLabelStyle}>Days Present</p>
                <h4 style={detailValueStyle}>{viewStudent.present}</h4>
              </div>

              <div style={detailCardStyle}>
                <p style={detailLabelStyle}>Days Absent</p>
                <h4 style={detailValueStyle}>{viewStudent.absent}</h4>
              </div>
            </div>

            <div style={percentageSummaryStyle}>
              <p style={percentageSummaryLabelStyle}>Attendance Percentage</p>
              <h2 style={percentageSummaryValueStyle}>
                {viewStudent.attendance_percentage}%
              </h2>
            </div>
          </div>
        </div>
      )}

      {printStudent && (
        <div style={modalOverlayStyle} onClick={() => setPrintStudent(null)}>
          <div style={printModalCardStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <div>
                <h3 style={modalTitleStyle}>Print Preview</h3>
                <p style={modalSubtitleStyle}>
                  Review the report below, then print or save it as PDF.
                </p>
              </div>
              <button
                style={modalCloseButtonStyle}
                onClick={() => setPrintStudent(null)}
              >
                ✕
              </button>
            </div>

            <div ref={printAreaRef}>
              <div className="print-wrapper" style={printPreviewWrapperStyle}>
                <h2 className="print-title" style={printTitleStyle}>
                  Student Attendance Report
                </h2>
                <p className="print-subtitle" style={printSubtitleStyle}>
                  {reportMeta?.classroom_name || selectedClassroomName} •{" "}
                  {reportMeta?.start_date || startDate} to{" "}
                  {reportMeta?.end_date || endDate}
                </p>

                <div className="print-card" style={printCardStyle}>
                  <div className="print-grid" style={detailGridStyle}>
                    <div className="print-item" style={printItemStyle}>
                      <p style={detailLabelStyle}>Student Name</p>
                      <h4 style={detailValueStyle}>{printStudent.student_name}</h4>
                    </div>

                    <div className="print-item" style={printItemStyle}>
                      <p style={detailLabelStyle}>Admission Number</p>
                      <h4 style={detailValueStyle}>
                        {printStudent.admission_number}
                      </h4>
                    </div>

                    <div className="print-item" style={printItemStyle}>
                      <p style={detailLabelStyle}>Days Present</p>
                      <h4 style={detailValueStyle}>{printStudent.present}</h4>
                    </div>

                    <div className="print-item" style={printItemStyle}>
                      <p style={detailLabelStyle}>Days Absent</p>
                      <h4 style={detailValueStyle}>{printStudent.absent}</h4>
                    </div>
                  </div>

                  <div className="percentage-box" style={percentageSummaryStyle}>
                    <p style={percentageSummaryLabelStyle}>Attendance Percentage</p>
                    <h2
                      className="percentage-value"
                      style={percentageSummaryValueStyle}
                    >
                      {printStudent.attendance_percentage}%
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            <div style={printActionRowStyle}>
              <button
                style={secondaryButtonStyle}
                onClick={() => setPrintStudent(null)}
              >
                Cancel
              </button>
              <button style={primaryButtonStyle} onClick={handlePrint}>
                Print / Save as PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const pageWrapperStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "22px",
};

const pageHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
};

const pageTitleStyle = {
  margin: 0,
  fontSize: "30px",
  fontWeight: "700",
  color: "#1e3a8a",
};

const pageSubtitleStyle = {
  marginTop: "8px",
  marginBottom: 0,
  color: "#64748b",
  fontSize: "15px",
};

const formCardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "18px",
  border: "1px solid #dbeafe",
  boxShadow: "0 10px 30px rgba(37, 99, 235, 0.08)",
  padding: "24px",
};

const formCardHeaderStyle = {
  marginBottom: "20px",
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: "22px",
  fontWeight: "700",
  color: "#1e3a8a",
};

const sectionSubtitleStyle = {
  marginTop: "6px",
  marginBottom: 0,
  color: "#64748b",
  fontSize: "14px",
};

const formGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
};

const fieldGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const labelStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#334155",
};

const inputStyle = {
  height: "46px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  padding: "0 14px",
  outline: "none",
  fontSize: "14px",
  backgroundColor: "#ffffff",
};

const formActionRowStyle = {
  marginTop: "22px",
  display: "flex",
  justifyContent: "flex-start",
};

const primaryButtonStyle = {
  border: "none",
  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
  color: "#ffffff",
  padding: "12px 18px",
  borderRadius: "12px",
  fontWeight: "700",
  fontSize: "14px",
  cursor: "pointer",
  boxShadow: "0 10px 20px rgba(37, 99, 235, 0.18)",
};

const secondaryButtonStyle = {
  border: "1px solid #cbd5e1",
  backgroundColor: "#ffffff",
  color: "#0f172a",
  padding: "12px 18px",
  borderRadius: "12px",
  fontWeight: "700",
  fontSize: "14px",
  cursor: "pointer",
};

const errorBoxStyle = {
  marginTop: "16px",
  backgroundColor: "#fef2f2",
  color: "#b91c1c",
  border: "1px solid #fecaca",
  padding: "12px 14px",
  borderRadius: "12px",
  fontSize: "14px",
};

const successBoxStyle = {
  marginTop: "16px",
  backgroundColor: "#eff6ff",
  color: "#1d4ed8",
  border: "1px solid #bfdbfe",
  padding: "12px 14px",
  borderRadius: "12px",
  fontSize: "14px",
};

const summaryHeaderRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
};

const summaryTagStyle = {
  padding: "8px 12px",
  borderRadius: "999px",
  backgroundColor: "#dbeafe",
  color: "#1d4ed8",
  fontSize: "12px",
  fontWeight: "700",
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
};

const statCardStyle = {
  background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
  borderRadius: "18px",
  border: "1px solid #dbeafe",
  boxShadow: "0 8px 24px rgba(37, 99, 235, 0.07)",
  padding: "20px",
};

const statCardAlertStyle = {
  background: "linear-gradient(180deg, #ffffff 0%, #fff7ed 100%)",
  borderRadius: "18px",
  border: "1px solid #fed7aa",
  boxShadow: "0 8px 24px rgba(245, 158, 11, 0.08)",
  padding: "20px",
};

const statLabelStyle = {
  margin: 0,
  color: "#64748b",
  fontSize: "14px",
  fontWeight: "600",
};

const statValueStyle = {
  marginTop: "12px",
  marginBottom: 0,
  fontSize: "30px",
  color: "#0f172a",
};

const statValueStyleSmallStyle = {
  marginTop: "12px",
  marginBottom: 0,
  fontSize: "26px",
  color: "#0f172a",
};

const statSubtextStyle = {
  marginTop: "8px",
  marginBottom: 0,
  color: "#64748b",
  fontSize: "13px",
};

const contentGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "20px",
};

const panelCardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "18px",
  border: "1px solid #dbeafe",
  boxShadow: "0 10px 30px rgba(37, 99, 235, 0.06)",
  padding: "22px",
};

const panelCardHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
  gap: "10px",
  flexWrap: "wrap",
};

const panelTitleStyle = {
  margin: 0,
  fontSize: "18px",
  fontWeight: "700",
  color: "#1e3a8a",
};

const panelBadgeStyle = {
  padding: "6px 10px",
  borderRadius: "999px",
  backgroundColor: "#fee2e2",
  color: "#b91c1c",
  fontSize: "12px",
  fontWeight: "700",
};

const panelBadgeBlueStyle = {
  padding: "6px 10px",
  borderRadius: "999px",
  backgroundColor: "#dbeafe",
  color: "#1d4ed8",
  fontSize: "12px",
  fontWeight: "700",
};

const emptyStateStyle = {
  margin: 0,
  color: "#64748b",
  fontSize: "14px",
};

const riskListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const riskItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#fff7ed",
  border: "1px solid #fed7aa",
  borderRadius: "12px",
  padding: "12px 14px",
  gap: "12px",
};

const riskNameStyle = {
  margin: 0,
  fontSize: "15px",
  fontWeight: "700",
  color: "#0f172a",
};

const riskMetaStyle = {
  marginTop: "4px",
  marginBottom: 0,
  fontSize: "13px",
  color: "#64748b",
};

const riskPercentBadgeStyle = {
  padding: "8px 12px",
  borderRadius: "999px",
  backgroundColor: "#fecaca",
  color: "#991b1b",
  fontSize: "13px",
  fontWeight: "700",
  whiteSpace: "nowrap",
};

const tableWrapperStyle = {
  overflowX: "auto",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
  minWidth: "880px",
};

const thStyle = {
  textAlign: "left",
  padding: "14px",
  backgroundColor: "#eff6ff",
  color: "#1e3a8a",
  fontSize: "13px",
  fontWeight: "700",
  borderBottom: "1px solid #dbeafe",
};

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid #e2e8f0",
  color: "#0f172a",
  fontSize: "14px",
  verticalAlign: "middle",
};

const emptyTableCellStyle = {
  padding: "20px 14px",
  borderBottom: "1px solid #e2e8f0",
  color: "#64748b",
  fontSize: "14px",
  textAlign: "center",
};

const normalRowStyle = {
  backgroundColor: "#ffffff",
};

const lowAttendanceRowStyle = {
  backgroundColor: "#fff7ed",
};

const attendanceBadgeStyle = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: "999px",
  backgroundColor: "#dcfce7",
  color: "#166534",
  fontWeight: "700",
  fontSize: "12px",
};

const attendanceBadgeDangerStyle = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: "999px",
  backgroundColor: "#fee2e2",
  color: "#b91c1c",
  fontWeight: "700",
  fontSize: "12px",
};

const actionWrapStyle = {
  position: "relative",
  display: "inline-block",
};

const actionButtonStyle = {
  border: "1px solid #cbd5e1",
  backgroundColor: "#ffffff",
  color: "#0f172a",
  padding: "9px 12px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "13px",
};

const dropdownMenuStyle = {
  position: "absolute",
  top: "110%",
  right: 0,
  backgroundColor: "#ffffff",
  border: "1px solid #dbeafe",
  borderRadius: "12px",
  boxShadow: "0 16px 30px rgba(15, 23, 42, 0.12)",
  minWidth: "150px",
  zIndex: 20,
  overflow: "hidden",
};

const dropdownItemStyle = {
  width: "100%",
  border: "none",
  backgroundColor: "#ffffff",
  textAlign: "left",
  padding: "11px 14px",
  fontSize: "14px",
  color: "#0f172a",
  cursor: "pointer",
};

const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(15, 23, 42, 0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000,
  padding: "20px",
};

const modalCardStyle = {
  width: "100%",
  maxWidth: "760px",
  backgroundColor: "#ffffff",
  borderRadius: "20px",
  padding: "24px",
  boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)",
};

const printModalCardStyle = {
  width: "100%",
  maxWidth: "900px",
  backgroundColor: "#ffffff",
  borderRadius: "20px",
  padding: "24px",
  boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)",
  maxHeight: "90vh",
  overflowY: "auto",
};

const modalHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "20px",
  gap: "14px",
};

const modalTitleStyle = {
  margin: 0,
  color: "#1e3a8a",
  fontSize: "22px",
  fontWeight: "700",
};

const modalSubtitleStyle = {
  marginTop: "6px",
  marginBottom: 0,
  color: "#64748b",
  fontSize: "14px",
};

const modalCloseButtonStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "999px",
  border: "1px solid #dbeafe",
  backgroundColor: "#f8fbff",
  cursor: "pointer",
  fontSize: "16px",
  flexShrink: 0,
};

const detailGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
};

const detailCardStyle = {
  backgroundColor: "#f8fbff",
  border: "1px solid #dbeafe",
  borderRadius: "14px",
  padding: "16px",
};

const detailLabelStyle = {
  margin: 0,
  fontSize: "13px",
  fontWeight: "600",
  color: "#64748b",
};

const detailValueStyle = {
  marginTop: "8px",
  marginBottom: 0,
  fontSize: "18px",
  fontWeight: "700",
  color: "#0f172a",
};

const percentageSummaryStyle = {
  marginTop: "20px",
  background: "linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%)",
  border: "1px solid #bfdbfe",
  borderRadius: "16px",
  padding: "20px",
  textAlign: "center",
};

const percentageSummaryLabelStyle = {
  margin: 0,
  color: "#475569",
  fontSize: "14px",
  fontWeight: "600",
};

const percentageSummaryValueStyle = {
  marginTop: "10px",
  marginBottom: 0,
  color: "#1d4ed8",
  fontSize: "36px",
  fontWeight: "700",
};

const printPreviewWrapperStyle = {
  backgroundColor: "#ffffff",
};

const printTitleStyle = {
  margin: 0,
  color: "#1e3a8a",
  fontSize: "26px",
  fontWeight: "700",
};

const printSubtitleStyle = {
  marginTop: "8px",
  color: "#64748b",
  fontSize: "14px",
};

const printCardStyle = {
  marginTop: "20px",
};

const printItemStyle = {
  backgroundColor: "#f8fbff",
};

const printActionRowStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
  marginTop: "20px",
  flexWrap: "wrap",
};

export default AdminAttendanceReport;