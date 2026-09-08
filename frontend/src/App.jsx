import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import SalonDetailPage from './pages/SalonDetailPage';
import ProtectedRoute from './components/ProtectedRoute';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import BookAppointmentPage from './pages/BookAppointmentPage';

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
            <ProtectedRoute>
              <MyAppointmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book"
          element={
            <ProtectedRoute>
              <BookAppointmentPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App