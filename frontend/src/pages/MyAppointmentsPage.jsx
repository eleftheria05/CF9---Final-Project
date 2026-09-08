import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchMyAppointments = async () => {
    try {
      const [meRes, appointmentsRes] = await Promise.all([
        axiosInstance.get('/customers/me'),
        axiosInstance.get('/appointments'),
      ]);
      const myId = meRes.data.id;
      const mine = appointmentsRes.data.filter((a) => a.customer.id === myId);
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

  const handleCancel = async (id) => {
    setActionError('');
    try {
      await axiosInstance.patch(`/appointments/${id}/cancel`);
      fetchMyAppointments(); // ξαναφόρτωσε τη λίστα με την ενημερωμένη κατάσταση
    } catch (err) {
      setActionError('Δεν ήταν δυνατή η ακύρωση του ραντεβού.');
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
        Τα Ραντεβού μου
      </h1>

      {actionError && (
        <p className="text-red-500 text-sm text-center mb-4">{actionError}</p>
      )}

      {appointments.length === 0 ? (
        <p className="text-center text-gray-500">Δεν έχετε κλείσει ραντεβού ακόμα.</p>
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
                  με {appointment.employee.firstName} {appointment.employee.lastName}
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

                {(appointment.status === 'PENDING' || appointment.status === 'CONFIRMED') && (
                  <button
                    onClick={() => handleCancel(appointment.id)}
                    className="text-sm text-red-500 hover:text-red-600 font-medium"
                  >
                    Ακύρωση
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

export default MyAppointmentsPage;