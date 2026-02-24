import TeacherAttendanceHistory from "./pages/TeacherAttendanceHistory";

import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminTeachers from "./pages/AdminTeachers";
import AdminStudents from "./pages/AdminStudents";
import AdminClasses from "./pages/AdminClasses";
import AdminEnrollments from "./pages/AdminEnrollments";

// Teacher Pages
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherAttendance from "./pages/TeacherAttendance";

// Route Protection
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

// Layouts
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

      <Route
        path="/admin/teachers"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminTeachers />
              </AdminLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/students"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminStudents />
              </AdminLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/classes"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminClasses />
              </AdminLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/enrollments"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminEnrollments />
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
          <RoleProtectedRoute allowedRole="teacher">
            <TeacherLayout>
         <TeacherAttendanceHistory />
       </TeacherLayout>
      </RoleProtectedRoute>
     }
    />
    </Routes>
  );
}

export default App;
