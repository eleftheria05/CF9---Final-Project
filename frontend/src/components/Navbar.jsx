import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { token, email, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-pink-600">
        Nail Salon Booking
      </Link>

      <div className="flex items-center gap-4">
        {token ? (
          <>
            {role === 'CUSTOMER' && (
              <>
                <Link to="/book" className="text-sm font-medium text-gray-700 hover:text-pink-600">
                  Κλείσε Ραντεβού
                </Link>
                <Link to="/my-appointments" className="text-sm font-medium text-gray-700 hover:text-pink-600">
                  Τα Ραντεβού μου
                </Link>
                <Link to="/my-profile" className="text-sm font-medium text-gray-700 hover:text-pink-600">
                  Το Προφίλ μου
                </Link>
              </>
            )}

            {role === 'EMPLOYEE' && (
              <Link to="/employee-dashboard" className="text-sm font-medium text-gray-700 hover:text-pink-600">
                Πίνακας Υπαλλήλου
              </Link>
            )}

            {role === 'ADMIN' && (
            <>
              <Link to="/admin/salons" className="text-sm font-medium text-gray-700 hover:text-pink-600">
                Καταστήματα
              </Link>
              <Link to="/admin/employees" className="text-sm font-medium text-gray-700 hover:text-pink-600">
                Υπάλληλοι
              </Link>
               <Link to="/admin/services" className="text-sm font-medium text-gray-700 hover:text-pink-600">
                Υπηρεσίες
              </Link>
              <Link to="/admin/customers" className="text-sm font-medium text-gray-700 hover:text-pink-600">
                Πελάτες
              </Link>
              <Link to="/admin/appointments" className="text-sm font-medium text-gray-700 hover:text-pink-600">
                Ραντεβού
              </Link>
            </>
            )}

            <span className="text-sm text-gray-600">
              {email} <span className="text-pink-500">({role})</span>
            </span>
            <button
              onClick={handleLogout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Αποσύνδεση
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-pink-600">
              Σύνδεση
            </Link>
            <Link
              to="/register"
              className="bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Εγγραφή
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;