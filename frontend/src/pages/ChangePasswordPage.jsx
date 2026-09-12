import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axiosInstance.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      setSuccess('Ο κωδικός άλλαξε επιτυχώς!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Κάτι πήγε στραβά.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Αλλαγή Κωδικού
      </h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Τρέχων Κωδικός
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Νέος Κωδικός
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm text-center">{success}</p>}

        <button
          type="submit"
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          Αλλαγή Κωδικού
        </button>
      </form>
    </div>
  );
}

export default ChangePasswordPage;