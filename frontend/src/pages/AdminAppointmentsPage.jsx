import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchAppointments = async () => {
    try {
      const response = await axiosInstance.get('/appointments');
      setAppointments(response.data);
    } catch (err) {
      setError('Δεν ήταν δυνατή η φόρτωση των ραντεβού.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const statusStyles = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-gray-100 text-gray-500',
    COMPLETED: 'bg-blue-100 text-blue-700',
  };

  const statusLabels = {
    PENDING: 'Εκκρεμεί',
    CONFIRMED: 'Επιβεβαιωμένο',
    CANCELLED: 'Ακυρωμένο',
    COMPLETED: 'Ολοκληρωμένο',
  };

  const filteredAppointments =
    statusFilter === 'ALL'
      ? appointments
      : appointments.filter((a) => a.status === statusFilter);

  if (loading) return <p className="text-center mt-10 text-gray-500">Φόρτωση...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Όλα τα Ραντεβού
      </h1>

      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
              statusFilter === status
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'ALL' ? 'Όλα' : statusLabels[status]}
          </button>
        ))}
      </div>

      {filteredAppointments.length === 0 ? (
        <p className="text-center text-gray-500">Δεν υπάρχουν ραντεβού με αυτή την κατάσταση.</p>
      ) : (
        <div className="space-y-3">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white shadow-sm rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {appointment.service.name}
                </p>
                <p className="text-sm text-gray-500">
                  Πελάτης: {appointment.customer.firstName} {appointment.customer.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  Υπάλληλος: {appointment.employee.firstName} {appointment.employee.lastName}
                  {' '}({appointment.employee.salon.name})
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(appointment.startTime).toLocaleString('el-GR', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>

              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyles[appointment.status]}`}
              >
                {statusLabels[appointment.status]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminAppointmentsPage;