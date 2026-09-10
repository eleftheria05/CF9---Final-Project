import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

function AdminSalonsPage() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
  });
  const [formError, setFormError] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchSalons = async () => {
    try {
      const response = await axiosInstance.get('/salons/all');
      setSalons(response.data);
    } catch (err) {
      setError('Δεν ήταν δυνατή η φόρτωση των καταστημάτων.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalons();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ name: '', address: '', phoneNumber: '', email: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    try {
      if (editingId) {
        await axiosInstance.put(`/salons/${editingId}`, formData);
      } else {
        await axiosInstance.post('/salons', formData);
      }
      resetForm();
      fetchSalons();
    } catch (err) {
    setFormError(err.response?.data?.message || 'Κάτι πήγε στραβά.');
    }
  };

  const handleEditClick = (salon) => {
    setEditingId(salon.id);
    setFormData({
      name: salon.name,
      address: salon.address,
      phoneNumber: salon.phoneNumber,
      email: salon.email,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Θέλετε σίγουρα να απενεργοποιήσετε αυτό το κατάστημα; Θα απενεργοποιηθούν επίσης όλοι οι υπάλληλοί του.')) return;

    try {
      await axiosInstance.delete(`/salons/${id}`);
      fetchSalons();
    } catch (err) {
      setError('Δεν ήταν δυνατή η απενεργοποίηση.');
    }
  };

  const handleReactivate = async (id) => {
    try {
      await axiosInstance.patch(`/salons/${id}/reactivate`);
      fetchSalons();
    } catch (err) {
      setError('Δεν ήταν δυνατή η ενεργοποίηση.');
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Φόρτωση...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Διαχείριση Καταστημάτων
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <h2 className="sm:col-span-2 font-semibold text-gray-700">
          {editingId ? 'Επεξεργασία Καταστήματος' : 'Νέο Κατάστημα'}
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Όνομα καταστήματος"
          value={formData.name}
          onChange={handleChange}
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <input
          type="text"
          name="address"
          placeholder="Διεύθυνση"
          value={formData.address}
          onChange={handleChange}
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Τηλέφωνο"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        {formError && (
          <p className="text-red-500 text-sm sm:col-span-2 text-center">{formError}</p>
        )}

        <div className="sm:col-span-2 flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            {editingId ? 'Αποθήκευση Αλλαγών' : 'Προσθήκη Καταστήματος'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              Ακύρωση
            </button>
          )}
        </div>
      </form>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="space-y-3">
        {salons.map((salon) => (
          <div
            key={salon.id}
            className="bg-white shadow-sm rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-medium text-gray-800">
                {salon.name}
                {!salon.isActive && (
                  <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    Ανενεργό
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-500">{salon.address}</p>
              <p className="text-sm text-gray-500">{salon.phoneNumber} · {salon.email}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleEditClick(salon)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Επεξεργασία
              </button>
              {salon.isActive ? (
                <button
                  onClick={() => handleDelete(salon.id)}
                  className="text-sm text-red-500 hover:text-red-600 font-medium"
                >
                  Απενεργοποίηση
                </button>
              ) : (
                <button
                  onClick={() => handleReactivate(salon.id)}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Ενεργοποίηση
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminSalonsPage;