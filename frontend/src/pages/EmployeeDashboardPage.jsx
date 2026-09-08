import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

function EmployeeDashboardPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchMyAppointments = async () => {
    try {
      const [meRes, appointmentsRes] = await Promise.all([
        axiosInstance.get('/employees/me'),
        axiosInstance.get('/appointments'),
      ]);
      const myId = meRes.data.id;
      const mine = appointmentsRes.data.filter((a) => a.employee.id === myId);
      setAppointments(mine);
    } catch (err) {
      setError('Δεν ήταν δυνατή η φόρτωση των ραντεβού.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAppointments();
  }, []);

  const handleConfirm = async (id) => {
    setActionError('');
    try {
      await axiosInstance.patch(`/appointments/${id}/confirm`);
      fetchMyAppointments();
    } catch (err) {
      setActionError('Δεν ήταν δυνατή η επιβεβαίωση.');
    }
  };

  const handleComplete = async (id) => {
    setActionError('');
    try {
      await axiosInstance.patch(`/appointments/${id}/complete`);
      fetchMyAppointments();
    } catch (err) {
      setActionError('Δεν ήταν δυνατή η ολοκλήρωση.');
    }
  };

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

  if (loading) return <p className="text-center mt-10 text-gray-500">Φόρτωση...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Τα Ραντεβού μου (Υπάλληλος)
      </h1>

      {actionError && (
        <p className="text-red-500 text-sm text-center mb-4">{actionError}</p>
      )}

      {appointments.length === 0 ? (
        <p className="text-center text-gray-500">Δεν έχετε ραντεβού αυτή τη στιγμή.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white shadow-md rounded-xl p-5 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  {appointment.service.name}
                </p>
                <p className="text-sm text-gray-500">
                  Πελάτης: {appointment.customer.firstName} {appointment.customer.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(appointment.startTime).toLocaleString('el-GR', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyles[appointment.status]}`}
                >
                  {statusLabels[appointment.status]}
                </span>

                {appointment.status === 'PENDING' && (
                  <button
                    onClick={() => handleConfirm(appointment.id)}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Επιβεβαίωση
                  </button>
                )}

                {appointment.status === 'CONFIRMED' && (
                  <button
                    onClick={() => handleComplete(appointment.id)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Ολοκλήρωση
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmployeeDashboardPage;