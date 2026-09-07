import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<h2 className="text-center mt-10 text-gray-600">Αρχική Σελίδα</h2>} />
      </Routes>
    </div>
  )
}

export default App