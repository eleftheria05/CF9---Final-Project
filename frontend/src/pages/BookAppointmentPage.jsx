import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function BookAppointmentPage() {
  const [salons, setSalons] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [customerId, setCustomerId] = useState(null);

  const [selectedSalon, setSelectedSalon] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [startTime, setStartTime] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  // Φόρτωσε salons, services, και το δικό μου customer id, μία φορά στην αρχή
  useEffect(() => {
    const fetchInitialData = async () => {
      const [salonsRes, servicesRes, meRes] = await Promise.all([
        axiosInstance.get('/salons'),
        axiosInstance.get('/services'),
        axiosInstance.get('/customers/me'),
      ]);
      setSalons(salonsRes.data);
      setServices(servicesRes.data);
      setCustomerId(meRes.data.id);
    };
    fetchInitialData();
  }, []);

  // Όποτε αλλάζει το selectedSalon, φόρτωσε τους employees αυτού του salon
  useEffect(() => {
    if (!selectedSalon) {
      setEmployees([]);
      return;
    }

    const fetchEmployees = async () => {
      const response = await axiosInstance.get('/employees');
      const filtered = response.data.filter(
        (e) => e.salon.id === Number(selectedSalon)
      );
      setEmployees(filtered);
      setSelectedEmployee(''); // reset employee όποτε αλλάζει το salon
    };
    fetchEmployees();
  }, [selectedSalon]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

  const selectedDateTime = new Date(startTime);
    if (selectedDateTime < new Date()) {
        setError('Δεν μπορείτε να επιλέξετε ώρα στο παρελθόν.');
        return;
    }

    try {
      await axiosInstance.post('/appointments', {
        customerId: customerId,
        employeeId: Number(selectedEmployee),
        serviceId: Number(selectedService),
        startTime: startTime,
      });
      setSuccess('Το ραντεβού κλείστηκε επιτυχώς!');
      setTimeout(() => navigate('/my-appointments'), 1500);
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Ο υπάλληλος έχει ήδη ραντεβού αυτή την ώρα.');
      } else {
        setError('Κάτι πήγε στραβά. Δοκιμάστε ξανά.');
      }
    }
  };
  
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Κλείσε Ραντεβού
      </h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Κατάστημα
          </label>
          <select
            value={selectedSalon}
            onChange={(e) => setSelectedSalon(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="">Επιλέξτε κατάστημα</option>
            {salons.map((salon) => (
              <option key={salon.id} value={salon.id}>
                {salon.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Υπάλληλος
          </label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            required
            disabled={!selectedSalon}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:bg-gray-100"
          >
            <option value="">
              {selectedSalon ? 'Επιλέξτε υπάλληλο' : 'Επιλέξτε πρώτα κατάστημα'}
            </option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.firstName} {employee.lastName} — {employee.specialization}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Υπηρεσία
          </label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="">Επιλέξτε υπηρεσία</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} ({service.durationMinutes} λεπτά — {service.price}€)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Ημερομηνία & Ώρα
          </label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            min={getMinDateTime()}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm text-center">{success}</p>}

        <button
          type="submit"
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          Κλείσε Ραντεβού
        </button>
      </form>
    </div>
  );
}

export default BookAppointmentPage;