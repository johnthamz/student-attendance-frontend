import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";

// ================= ADMIN PAGES =================
import AdminDashboard from "./pages/AdminDashboard";
import AdminTeachersAdd from "./pages/AdminTeachersAdd";
import AdminTeachersManage from "./pages/AdminTeachersManage";
import AdminTeacherView from "./pages/AdminTeacherView";
import AdminTeacherEdit from "./pages/AdminTeacherEdit";

import AdminStudentsAdd from "./pages/AdminStudentsAdd";
import AdminStudentsEnroll from "./pages/AdminStudentsEnroll";
import AdminStudentsManage from "./pages/AdminStudentsManage";
import AdminStudentView from "./pages/AdminStudentView";
import AdminStudentEdit from "./pages/AdminStudentEdit";

import AdminClassesCreate from "./pages/AdminClassesCreate";
import AdminClassesManage from "./pages/AdminClassesManage";
import AdminClassView from "./pages/AdminClassView";
import AdminClassEdit from "./pages/AdminClassEdit";

import AdminAttendanceReport from "./pages/AdminAttendanceReport";
import AdminAnalyticsDashboard from "./pages/AdminAnalyticsDashboard";

// ================= TEACHER PAGES =================
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherAttendance from "./pages/TeacherAttendance";
import TeacherAttendanceHistory from "./pages/TeacherAttendanceHistory";

// ================= ROUTE PROTECTION =================
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

// ================= LAYOUTS =================
import AdminLayout from "./components/AdminLayout";
import TeacherLayout from "./components/TeacherLayout";

function App() {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<Login />} />

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      {/* ================= TEACHERS ================= */}
      <Route
        path="/admin/teachers/add"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminTeachersAdd />
              </AdminLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/teachers/manage"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminTeachersManage />
              </AdminLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/teachers/view/:id"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminTeacherView />
              </AdminLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/teachers/edit/:id"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminTeacherEdit />
              </AdminLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      {/* ================= STUDENTS ================= */}
      <Route
        path="/admin/students"
        element={<Navigate to="/admin/students/add" replace />}
      />

      <Route
        path="/admin/students/add"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminStudentsAdd />
              </AdminLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/students/enroll"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminStudentsEnroll />
              </AdminLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/students/manage"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminStudentsManage />
              </AdminLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/students/view/:id"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminStudentView />
              </AdminLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/students/edit/:id"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminStudentEdit />
              </AdminLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      {/* ================= CLASSES ================= */}
      <Route
        path="/admin/classes"
        element={<Navigate to="/admin/classes/create" replace />}
      />

      <Route
        path="/admin/classes/create"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminClassesCreate />
              </AdminLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/classes/manage"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminClassesManage />
              </AdminLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/classes/view/:id"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminClassView />
              </AdminLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/classes/edit/:id"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminClassEdit />
              </AdminLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      {/* ================= REPORTS & ANALYTICS ================= */}
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminAttendanceReport />
              </AdminLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminAnalyticsDashboard />
              </AdminLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      {/* ================= TEACHER ================= */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRole="teacher">
              <TeacherLayout>
                <TeacherDashboard />
              </TeacherLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/attendance"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRole="teacher">
              <TeacherLayout>
                <TeacherAttendance />
              </TeacherLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/history"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRole="teacher">
              <TeacherLayout>
                <TeacherAttendanceHistory />
              </TeacherLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;