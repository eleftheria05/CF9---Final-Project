import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';

function HomePage() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { token } = useContext(AuthContext);

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

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 to-rose-100 py-20 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
          Ομορφιά & Φροντίδα στα Νύχια σου
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto mb-8">
          Κλείσε το ραντεβού σου εύκολα και γρήγορα σε ένα από τα καταστήματά μας.
        </p>
        {!token && (
          <Link
            to="/register"
            className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Κάνε Εγγραφή Τώρα
          </Link>
        )}
      </section>

      {/* Salons Section */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Τα Καταστήματά μας
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Φόρτωση...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : salons.length === 0 ? (
          <p className="text-center text-gray-500">Δεν υπάρχουν διαθέσιμα καταστήματα.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {salons.map((salon) => (
                    <Link
                    to={`/salons/${salon.id}`}
                    key={salon.id}
                    className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow block"
                    >
                    <h3 className="text-xl font-semibold text-pink-600 mb-2">
                        {salon.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-1">{salon.address}</p>
                    <p className="text-gray-500 text-sm">{salon.phoneNumber}</p>
                    </Link>
                ))}
            </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;