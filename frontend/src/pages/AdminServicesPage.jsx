import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    durationMinutes: '',
  });
  const [formError, setFormError] = useState('');

  const fetchServices = async () => {
    try {
      const response = await axiosInstance.get('/services');
      setServices(response.data);
    } catch (err) {
      setError('Δεν ήταν δυνατή η φόρτωση των υπηρεσιών.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    try {
      await axiosInstance.post('/services', {
        ...formData,
        price: Number(formData.price),
        durationMinutes: Number(formData.durationMinutes),
      });
      setFormData({ name: '', description: '', price: '', durationMinutes: '' });
      fetchServices();
    } catch (err) {
      setFormError('Ελέγξτε ότι όλα τα πεδία είναι σωστά συμπληρωμένα.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Θέλετε σίγουρα να διαγράψετε αυτή την υπηρεσία;')) return;

    try {
      await axiosInstance.delete(`/services/${id}`);
      fetchServices();
    } catch (err) {
      setError('Δεν ήταν δυνατή η διαγραφή.');
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Φόρτωση...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Διαχείριση Υπηρεσιών
      </h1>

      {/* Φόρμα δημιουργίας */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Όνομα υπηρεσίας"
          value={formData.name}
          onChange={handleChange}
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <input
          type="text"
          name="description"
          placeholder="Περιγραφή"
          value={formData.description}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <input
          type="number"
          name="price"
          placeholder="Τιμή (€)"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <input
          type="number"
          name="durationMinutes"
          placeholder="Διάρκεια (λεπτά)"
          value={formData.durationMinutes}
          onChange={handleChange}
          required
          min="1"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        {formError && (
          <p className="text-red-500 text-sm sm:col-span-2 text-center">{formError}</p>
        )}

        <button
          type="submit"
          className="sm:col-span-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          Προσθήκη Υπηρεσίας
        </button>
      </form>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Λίστα υπηρεσιών */}
      <div className="space-y-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white shadow-sm rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-medium text-gray-800">{service.name}</p>
              <p className="text-sm text-gray-500">
                {service.durationMinutes} λεπτά — {service.price}€
              </p>
            </div>
            <button
              onClick={() => handleDelete(service.id)}
              className="text-sm text-red-500 hover:text-red-600 font-medium"
            >
              Διαγραφή
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminServicesPage;