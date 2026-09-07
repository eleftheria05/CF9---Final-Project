import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function SalonDetailPage() {
  const { salonId } = useParams();
  const [salon, setSalon] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salonRes, employeesRes] = await Promise.all([
          axiosInstance.get(`/salons/${salonId}`),
          axiosInstance.get('/employees'),
        ]);
        setSalon(salonRes.data);
        setEmployees(employeesRes.data.filter((e) => e.salon.id === Number(salonId)));
      } catch (err) {
        setError('Δεν ήταν δυνατή η φόρτωση των στοιχείων.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [salonId]);

  if (loading) return <p className="text-center mt-10 text-gray-500">Φόρτωση...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link to="/" className="text-pink-600 text-sm hover:underline">
        ← Πίσω στα καταστήματα
      </Link>

      <div className="bg-white shadow-md rounded-xl p-8 mt-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{salon.name}</h1>
        <p className="text-gray-600">{salon.address}</p>
        <p className="text-gray-500 text-sm mt-1">{salon.phoneNumber} · {salon.email}</p>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">Το Προσωπικό μας</h2>

      {employees.length === 0 ? (
        <p className="text-gray-500">Δεν υπάρχουν διαθέσιμοι υπάλληλοι αυτή τη στιγμή.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {employees.map((employee) => (
            <div key={employee.id} className="bg-white shadow-sm rounded-lg p-4">
              <p className="font-medium text-gray-800">
                {employee.firstName} {employee.lastName}
              </p>
              <p className="text-pink-500 text-sm">{employee.specialization}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SalonDetailPage;