import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get('/customers');
      setCustomers(response.data);
    } catch (err) {
      setError('Δεν ήταν δυνατή η φόρτωση των πελατών.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Θέλετε σίγουρα να διαγράψετε αυτόν τον πελάτη;')) return;

    try {
      await axiosInstance.delete(`/customers/${id}`);
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.message || 'Δεν ήταν δυνατή η διαγραφή.');
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Φόρτωση...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Λίστα Πελατών
      </h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {customers.length === 0 ? (
        <p className="text-center text-gray-500">Δεν υπάρχουν εγγεγραμμένοι πελάτες.</p>
      ) : (
        <div className="space-y-3">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="bg-white shadow-sm rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {customer.firstName} {customer.lastName}
                </p>
                <p className="text-sm text-gray-500">{customer.email}</p>
                <p className="text-sm text-gray-500">{customer.phoneNumber}</p>
              </div>
              <button
                onClick={() => handleDelete(customer.id)}
                className="text-sm text-red-500 hover:text-red-600 font-medium"
              >
                Διαγραφή
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminCustomersPage;