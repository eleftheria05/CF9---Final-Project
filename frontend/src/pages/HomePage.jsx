import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

function HomePage() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const response = await axiosInstance.get('/salons');
        setSalons(response.data);
      } catch (err) {
        setError('Δεν ήταν δυνατή η φόρτωση των καταστημάτων.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalons();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Φόρτωση...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Τα Καταστήματά μας
      </h1>

      {salons.length === 0 ? (
        <p className="text-center text-gray-500">Δεν υπάρχουν διαθέσιμα καταστήματα.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {salons.map((salon) => (
            <div
              key={salon.id}
              className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-pink-600 mb-2">
                {salon.name}
              </h2>
              <p className="text-gray-600 text-sm mb-1">{salon.address}</p>
              <p className="text-gray-500 text-sm">{salon.phoneNumber}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;