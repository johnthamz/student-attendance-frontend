import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis,
  Tooltip, CartesianGrid,
  Legend, ResponsiveContainer
} from "recharts";

const COLORS = ["#4CAF50", "#F44336"];

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

  // FETCH CLASSES
  const fetchClasses = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/classrooms/",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClasses(res.data);
    } catch (err) {
      console.error("Class fetch error:", err);
    }
  };

  // FETCH KPIs
  const fetchKpis = async () => {

    try {

      let url = "http://127.0.0.1:8000/api/reports/analytics/?";

      if (selectedClass) url += `class=${selectedClass}&`;
      if (selectedGender) url += `gender=${selectedGender}&`;
      if (selectedDate) url += `selected_date=${selectedDate}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setKpiData(res.data);

    } catch (err) {
      console.error("KPI fetch error:", err);
    }
  };

  // FETCH CHART DATA
  const fetchCharts = async () => {

    if (!startDate || !endDate) {
      alert("Please select start and end dates.");
      return;
    }

    try {

      let url = "http://127.0.0.1:8000/api/reports/analytics/?";

      if (chartClass) url += `class=${chartClass}&`;
      if (chartGender) url += `gender=${chartGender}&`;

      url += `start_date=${startDate}&end_date=${endDate}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setChartData(res.data);

    } catch (err) {
      console.error("Chart fetch error:", err);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchKpis();
  }, []);

  useEffect(() => {
    fetchKpis();
  }, [selectedClass, selectedGender, selectedDate]);

  if (!kpiData) return <p>Loading analytics...</p>;

  const pieData = chartData ? [
    { name: "Present", value: chartData.present_count },
    { name: "Absent", value: chartData.absent_count }
  ] : [];

  return (
    <div style={{ padding: "20px" }}>

      <h2 style={{ marginBottom: "20px" }}>Attendance Analytics</h2>

      {/* KPI FILTERS */}

      <SectionTitle title="Filters" />

      <div style={filterContainerStyle}>

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">All Classes</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>
              {cls.level} - {cls.name}
            </option>
          ))}
        </select>

        <select
          value={selectedGender}
          onChange={(e) => setSelectedGender(e.target.value)}
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

      </div>

      {/* FULL DAY */}

      <SectionTitle title="Full Day Attendance" />

      <div style={cardGridStyle}>
        <Card title="Full Day Present" value={kpiData.full_day_present} />
        <Card title="Full Day Absent" value={kpiData.full_day_absent} />
        <Card title="Partial Attendance" value={kpiData.partial_attendance} />
      </div>

      {/* SESSION BREAKDOWN */}

      <SectionTitle title="Session Breakdown" />

      <div style={cardGridStyle}>
        <Card title="Morning Present" value={kpiData.morning_present} />
        <Card title="Morning Absent" value={kpiData.morning_absent} />
        <Card title="Afternoon Present" value={kpiData.afternoon_present} />
        <Card title="Afternoon Absent" value={kpiData.afternoon_absent} />
      </div>

      {/* ENROLLMENT */}

      <SectionTitle title="Enrollment Overview" />

      <div style={cardGridStyle}>
        <Card title="Total Enrollment" value={kpiData.total_enrollment} />
        <Card title="Male Enrollment" value={kpiData.total_male_enrollment} />
        <Card title="Female Enrollment" value={kpiData.total_female_enrollment} />
      </div>

      {/* CHART FILTERS */}

      <SectionTitle title="Chart Analytics" />

      <div style={filterContainerStyle}>

        <select
          value={chartClass}
          onChange={(e) => setChartClass(e.target.value)}
        >
          <option value="">All Classes</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>
              {cls.level} - {cls.name}
            </option>
          ))}
        </select>

        <select
          value={chartGender}
          onChange={(e) => setChartGender(e.target.value)}
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button onClick={fetchCharts} style={filterButtonStyle}>
          Apply Chart Filter
        </button>

      </div>

      {/* CHARTS */}

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
            <BarChart data={chartData.class_distribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="class" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="percentage" fill="#2196F3" />
            </BarChart>
          </ChartCard>

          <ChartCard title="Daily Attendance Trend">
            <LineChart data={chartData.daily_trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line dataKey="percentage" stroke="#4CAF50" />
            </LineChart>
          </ChartCard>

          <ChartCard title="Weekly Comparison">
            <BarChart data={chartData.weekly_comparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="percentage" fill="#FF9800" />
            </BarChart>
          </ChartCard>

        </div>

      )}

    </div>
  );
};


// COMPONENTS

const SectionTitle = ({ title }) => (
  <h3 style={{ marginTop: "25px", marginBottom: "10px" }}>{title}</h3>
);

const Card = ({ title, value }) => (
  <div style={cardStyle}>
    <h4>{title}</h4>
    <h2>{value}</h2>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div style={chartCardStyle}>
    <h3>{title}</h3>
    <ResponsiveContainer width="100%" height={300}>
      {children}
    </ResponsiveContainer>
  </div>
);


// STYLES

const filterContainerStyle = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
  flexWrap: "wrap"
};

const filterButtonStyle = {
  padding: "6px 12px",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const cardGridStyle = {
  display: "flex",
  gap: "15px",
  marginBottom: "15px",
  flexWrap: "wrap"
};

const cardStyle = {
  background: "#f4f6f9",
  padding: "10px",
  borderRadius: "8px",
  width: "160px",
  textAlign: "center",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
};

const chartGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
  gap: "20px"
};

const chartCardStyle = {
  background: "white",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 3px 8px rgba(0,0,0,0.08)"
};

export default AdminAnalyticsDashboard;