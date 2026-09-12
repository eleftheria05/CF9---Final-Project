import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

function AdminEmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    specialization: '',
    hireDate: '',
    salonId: '',
  });
  const [formError, setFormError] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      const [employeesRes, salonsRes] = await Promise.all([
        axiosInstance.get('/employees/all'),
        axiosInstance.get('/salons/all'),
      ]);
      setEmployees(employeesRes.data);
      setSalons(salonsRes.data);
    } catch (err) {
      setError('Δεν ήταν δυνατή η φόρτωση των δεδομένων.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      specialization: '',
      hireDate: '',
      salonId: '',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    try {
      if (editingId) {
        const { password, ...updateData } = formData;
        await axiosInstance.put(`/employees/${editingId}`, {
          ...updateData,
          salonId: Number(formData.salonId),
        });
      } else {
        await axiosInstance.post('/employees', {
          ...formData,
          salonId: Number(formData.salonId),
        });
      }
      resetForm();
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Ελέγξτε ότι όλα τα πεδία είναι σωστά συμπληρωμένα.');
    }
  };

  const handleEditClick = (employee) => {
    setEditingId(employee.id);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      password: '',
      phoneNumber: employee.phoneNumber,
      specialization: employee.specialization,
      hireDate: employee.hireDate,
      salonId: employee.salon.id,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Θέλετε σίγουρα να απενεργοποιήσετε αυτόν τον υπάλληλο;')) return;

    try {
      await axiosInstance.delete(`/employees/${id}`);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Δεν ήταν δυνατή η απενεργοποίηση.');
    }
  };

  const handleReactivate = async (id) => {
    try {
        await axiosInstance.patch(`/employees/${id}/reactivate`);
        fetchData();
    } catch (err) {
        setError(err.response?.data?.message || 'Δεν ήταν δυνατή η ενεργοποίηση');
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Φόρτωση...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Διαχείριση Υπαλλήλων
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <h2 className="sm:col-span-2 font-semibold text-gray-700">
          {editingId ? 'Επεξεργασία Υπαλλήλου' : 'Νέος Υπάλληλος'}
        </h2>

        <input
          type="text"
          name="firstName"
          placeholder="Όνομα"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Επώνυμο"
          value={formData.lastName}
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

        {!editingId && (
          <input
            type="password"
            name="password"
            placeholder="Κωδικός πρόσβασης"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        )}

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
          type="text"
          name="specialization"
          placeholder="Ειδικότητα"
          value={formData.specialization}
          onChange={handleChange}
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <input
          type="date"
          name="hireDate"
          value={formData.hireDate}
          onChange={handleChange}
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        <select
          name="salonId"
          value={formData.salonId}
          onChange={handleChange}
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <option value="">Επιλέξτε κατάστημα</option>
          {salons.filter((s) => s.isActive).map((salon) => (
            <option key={salon.id} value={salon.id}>
              {salon.name}
            </option>
          ))}
        </select>

        {formError && (
          <p className="text-red-500 text-sm sm:col-span-2 text-center">{formError}</p>
        )}

        <div className="sm:col-span-2 flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            {editingId ? 'Αποθήκευση Αλλαγών' : 'Προσθήκη Υπαλλήλου'}
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
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white shadow-sm rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-medium text-gray-800">
                {employee.firstName} {employee.lastName}
                {!employee.isActive && (
                  <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    Ανενεργός
                  </span>
                )}
              </p>
              <p className="text-sm text-pink-500">{employee.specialization}</p>
              <p className="text-sm text-gray-500">{employee.salon.name}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleEditClick(employee)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Επεξεργασία
              </button>
              {employee.isActive ? (
                <button
                    onClick={() => handleDelete(employee.id)}
                    className="text-sm text-red-500 hover:text-red-600 font-medium"
                >
                    Απενεργοποίηση
                </button>
              ) : (
               <button
                    onClick={() => handleReactivate(employee.id)}
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

export default AdminEmployeesPage;