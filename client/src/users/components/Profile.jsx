// client/src/users/components/Profile.jsx
import { useEffect, useState } from 'react';
import { getUserProfile } from '../api';
import { logout } from '../../common/auth';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const result = await getUserProfile();

    if (result.success) {
      setUser(result.data);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading profile: {JSON.stringify(error)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6">User Profile</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">ID</label>
            <p className="text-lg">{user?.id}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Username</label>
            <p className="text-lg">{user?.username}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <p className="text-lg">{user?.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Role</label>
            <p className="text-lg">
              <span
                className={`px-3 py-1 rounded ${
                  user?.role === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {user?.role}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}