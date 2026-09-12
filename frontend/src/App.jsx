import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import SalonDetailPage from './pages/SalonDetailPage';
import ProtectedRoute from './components/ProtectedRoute';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import EmployeeDashboardPage from './pages/EmployeeDashboardPage';
import AdminServicesPage from './pages/AdminServicesPage';
import AdminSalonsPage from './pages/AdminSalonsPage';
import AdminEmployeesPage from './pages/AdminEmployeesPage';
import AdminCustomersPage from './pages/AdminCustomersPage';
import AdminAppointmentsPage from './pages/AdminAppointmentsPage';
import MyProfilePage from './pages/MyProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/salons/:salonId" element={<SalonDetailPage />} />
        <Route
          path="/my-appointments"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <MyAppointmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <BookAppointmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <EmployeeDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminServicesPage />
          </ProtectedRoute>
          }
        />
        <Route
          path="/admin/salons"
          element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminSalonsPage />
          </ProtectedRoute>
          }     
        />
        <Route 
          path="/admin/employees" 
          element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminEmployeesPage />
          </ProtectedRoute>} />
        <Route
          path="/admin/customers"
          element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminCustomersPage />
          </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminAppointmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <MyProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      
    </div>
  )
}

export default App