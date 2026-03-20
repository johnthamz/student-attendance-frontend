import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#22c55e", "#ef4444"];

const AdminAnalyticsDashboard = () => {
  const token = localStorage.getItem("accessToken");

  const [classes, setClasses] = useState([]);

  // KPI FILTERS
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // CHART FILTERS
  const [chartClass, setChartClass] = useState("");
  const [chartGender, setChartGender] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [kpiData, setKpiData] = useState(null);
  const [chartData, setChartData] = useState(null);

  const [loadingKpis, setLoadingKpis] = useState(false);
  const [loadingCharts, setLoadingCharts] = useState(false);
  const [pageError, setPageError] = useState("");

  // =========================
  // FETCH CLASSES
  // =========================
  const fetchClasses = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/classrooms/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data);
    } catch (err) {
      console.error("Class fetch error:", err);
      setPageError("Failed to load classes.");
    }
  };

  // =========================
  // FETCH KPI DATA
  // =========================
  const fetchKpis = async () => {
    setLoadingKpis(true);
    setPageError("");

    try {
      let url = "http://127.0.0.1:8000/api/reports/analytics/?";

      if (selectedClass) url += `class=${selectedClass}&`;
      if (selectedGender) url += `gender=${selectedGender}&`;
      if (selectedDate) url += `selected_date=${selectedDate}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setKpiData(res.data);
    } catch (err) {
      console.error("KPI fetch error:", err);
      setPageError("Failed to load analytics summary.");
    } finally {
      setLoadingKpis(false);
    }
  };

  // =========================
  // FETCH CHART DATA
  // =========================
  const fetchCharts = async () => {
    setPageError("");

    if (!startDate || !endDate) {
      setPageError("Please select start and end dates for chart analytics.");
      return;
    }

    if (startDate > endDate) {
      setPageError("Start date cannot be later than end date.");
      return;
    }

    setLoadingCharts(true);

    try {
      let url = "http://127.0.0.1:8000/api/reports/analytics/?";

      if (chartClass) url += `class=${chartClass}&`;
      if (chartGender) url += `gender=${chartGender}&`;

      url += `start_date=${startDate}&end_date=${endDate}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setChartData(res.data);
    } catch (err) {
      console.error("Chart fetch error:", err);
      setPageError("Failed to load chart analytics.");
      setChartData(null);
    } finally {
      setLoadingCharts(false);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchKpis();
  }, []);

  useEffect(() => {
    fetchKpis();
  }, [selectedClass, selectedGender, selectedDate]);

  const pieData = useMemo(() => {
    if (!chartData) return [];
    return [
      { name: "Present", value: chartData.present_count || 0 },
      { name: "Absent", value: chartData.absent_count || 0 },
    ];
  }, [chartData]);

  const studentsAtRisk = kpiData?.students_at_risk || [];

  return (
    <div style={pageWrapperStyle}>
      <div style={pageHeaderStyle}>
        <div>
          <h2 style={pageTitleStyle}>Attendance Analytics</h2>
          <p style={pageSubtitleStyle}>
            Monitor attendance performance, enrollment overview, trends, and
            students at risk.
          </p>
        </div>
      </div>

      {pageError ? <div style={errorBoxStyle}>{pageError}</div> : null}

      <div style={sectionCardStyle}>
        <div style={sectionHeaderStyle}>
          <h3 style={sectionTitleStyle}>Summary Filters</h3>
          <p style={sectionSubtitleStyle}>
            Filter the attendance summary cards by class, gender, and date.
          </p>
        </div>

        <div style={filterGridStyle}>
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={inputStyle}
            >
              <option value="">All Classes</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.level} - {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Gender</label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              style={inputStyle}
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {loadingKpis && !kpiData ? (
        <div style={loadingCardStyle}>Loading analytics...</div>
      ) : (
        <>
          <div>
            <h3 style={contentSectionTitleStyle}>Full Day Attendance</h3>
            <div style={statsGridStyle}>
              <StatCard
                title="Full Day Present"
                value={kpiData?.full_day_present ?? 0}
              />
              <StatCard
                title="Full Day Absent"
                value={kpiData?.full_day_absent ?? 0}
              />
              <StatCard
                title="Partial Attendance"
                value={kpiData?.partial_attendance ?? 0}
              />
            </div>
          </div>

          <div>
            <h3 style={contentSectionTitleStyle}>Session Breakdown</h3>
            <div style={statsGridStyle}>
              <StatCard
                title="Morning Present"
                value={kpiData?.morning_present ?? 0}
              />
              <StatCard
                title="Morning Absent"
                value={kpiData?.morning_absent ?? 0}
              />
              <StatCard
                title="Afternoon Present"
                value={kpiData?.afternoon_present ?? 0}
              />
              <StatCard
                title="Afternoon Absent"
                value={kpiData?.afternoon_absent ?? 0}
              />
            </div>
          </div>

          <div>
            <h3 style={contentSectionTitleStyle}>Enrollment Overview</h3>
            <div style={statsGridStyle}>
              <StatCard
                title="Total Enrollment"
                value={kpiData?.total_enrollment ?? 0}
              />
              <StatCard
                title="Male Enrollment"
                value={kpiData?.total_male_enrollment ?? 0}
              />
              <StatCard
                title="Female Enrollment"
                value={kpiData?.total_female_enrollment ?? 0}
              />
              <StatCard
                title="Students at Risk"
                value={kpiData?.students_at_risk_count ?? 0}
                danger
              />
            </div>
          </div>

          <div style={riskPanelStyle}>
            <div style={riskPanelHeaderStyle}>
              <h3 style={panelTitleStyle}>Students at Risk</h3>
              <span style={riskBadgeStyle}>
                {kpiData?.students_at_risk_count ?? 0}
              </span>
            </div>

            {studentsAtRisk.length === 0 ? (
              <p style={emptyTextStyle}>
                No students are currently below 75% attendance in the selected
                summary filter.
              </p>
            ) : (
              <div style={riskListStyle}>
                {studentsAtRisk.map((student) => (
                  <div key={student.student_id} style={riskItemStyle}>
                    <div>
                      <p style={riskNameStyle}>{student.name}</p>
                      <p style={riskMetaStyle}>
                        {student.admission_number || "Admission number not available"}
                      </p>
                    </div>
                    <div style={riskPercentStyle}>
                      {student.attendance_percentage}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={sectionCardStyle}>
            <div style={sectionHeaderStyle}>
              <h3 style={sectionTitleStyle}>Chart Analytics</h3>
              <p style={sectionSubtitleStyle}>
                Apply a date range to generate charts for attendance patterns and
                performance trends.
              </p>
            </div>

            <div style={filterGridStyle}>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Class</label>
                <select
                  value={chartClass}
                  onChange={(e) => setChartClass(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">All Classes</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.level} - {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Gender</label>
                <select
                  value={chartGender}
                  onChange={(e) => setChartGender(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
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

            <div style={actionRowStyle}>
              <button onClick={fetchCharts} style={primaryButtonStyle}>
                {loadingCharts ? "Loading..." : "Apply Chart Filter"}
              </button>
            </div>
          </div>

          {chartData && (
            <div style={chartGridStyle}>
              <ChartCard title="Attendance Distribution">
                <PieChart>
                  <Pie data={pieData} dataKey="value" outerRadius={90}>
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ChartCard>

              <ChartCard title="Class Distribution">
                <BarChart data={chartData.class_distribution || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="class" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="percentage" fill="#2563eb" />
                </BarChart>
              </ChartCard>

              <ChartCard title="Daily Attendance Trend">
                <LineChart data={chartData.daily_trend || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line dataKey="percentage" stroke="#16a34a" />
                </LineChart>
              </ChartCard>

              <ChartCard title="Weekly Comparison">
                <BarChart data={chartData.weekly_comparison || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="percentage" fill="#f59e0b" />
                </BarChart>
              </ChartCard>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const StatCard = ({ title, value, danger = false }) => (
  <div
    style={{
      ...statCardStyle,
      ...(danger ? statCardDangerStyle : {}),
    }}
  >
    <p style={statLabelStyle}>{title}</p>
    <h3 style={statValueStyle}>{value}</h3>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div style={chartCardStyle}>
    <h3 style={chartTitleStyle}>{title}</h3>
    <ResponsiveContainer width="100%" height={300}>
      {children}
    </ResponsiveContainer>
  </div>
);

// =========================
// STYLES
// =========================

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

const sectionCardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "18px",
  border: "1px solid #dbeafe",
  boxShadow: "0 10px 30px rgba(37, 99, 235, 0.08)",
  padding: "24px",
};

const sectionHeaderStyle = {
  marginBottom: "18px",
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

const contentSectionTitleStyle = {
  margin: 0,
  fontSize: "20px",
  fontWeight: "700",
  color: "#1e3a8a",
};

const filterGridStyle = {
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

const actionRowStyle = {
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

const loadingCardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "18px",
  border: "1px solid #dbeafe",
  padding: "24px",
  color: "#475569",
  fontSize: "15px",
};

const errorBoxStyle = {
  backgroundColor: "#fef2f2",
  color: "#b91c1c",
  border: "1px solid #fecaca",
  padding: "12px 14px",
  borderRadius: "12px",
  fontSize: "14px",
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "16px",
};

const statCardStyle = {
  background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
  borderRadius: "18px",
  border: "1px solid #dbeafe",
  boxShadow: "0 8px 24px rgba(37, 99, 235, 0.06)",
  padding: "20px",
};

const statCardDangerStyle = {
  border: "1px solid #fecaca",
  background: "linear-gradient(180deg, #ffffff 0%, #fff7f7 100%)",
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
  fontWeight: "700",
};

const riskPanelStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "18px",
  border: "1px solid #dbeafe",
  boxShadow: "0 10px 30px rgba(37, 99, 235, 0.06)",
  padding: "22px",
};

const riskPanelHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
};

const panelTitleStyle = {
  margin: 0,
  fontSize: "18px",
  fontWeight: "700",
  color: "#1e3a8a",
};

const riskBadgeStyle = {
  padding: "6px 10px",
  borderRadius: "999px",
  backgroundColor: "#fee2e2",
  color: "#b91c1c",
  fontSize: "12px",
  fontWeight: "700",
};

const emptyTextStyle = {
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

const riskPercentStyle = {
  padding: "8px 12px",
  borderRadius: "999px",
  backgroundColor: "#fecaca",
  color: "#991b1b",
  fontSize: "13px",
  fontWeight: "700",
};

const chartGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
  gap: "20px",
};

const chartCardStyle = {
  background: "#ffffff",
  padding: "18px",
  borderRadius: "18px",
  border: "1px solid #dbeafe",
  boxShadow: "0 10px 30px rgba(37, 99, 235, 0.06)",
};

const chartTitleStyle = {
  marginTop: 0,
  marginBottom: "16px",
  color: "#1e3a8a",
  fontSize: "18px",
  fontWeight: "700",
};

export default AdminAnalyticsDashboard;