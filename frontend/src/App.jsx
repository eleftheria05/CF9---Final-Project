import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <div>
      <h1>Nail Salon Booking</h1>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<h2>Αρχική Σελίδα</h2>} />
      </Routes>
    </div>
  )
}

export default App