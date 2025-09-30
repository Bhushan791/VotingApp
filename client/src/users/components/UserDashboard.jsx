// client/src/users/components/UserDashboard.jsx
import { useEffect, useState } from 'react';
import { getUser, logout } from '../../common/auth';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">VoteNow - User Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, <strong>{user?.username}</strong>
            </span>
            <button
              onClick={() => navigate('/profile')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-2">Active Polls</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
            <p className="text-sm text-gray-600 mt-2">Polls you can vote on</p>
          </div>

          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-2">Your Votes</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-sm text-gray-600 mt-2">Total votes cast</p>
          </div>

          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-2">Closed Polls</h3>
            <p className="text-3xl font-bold text-gray-600">0</p>
            <p className="text-sm text-gray-600 mt-2">Results available</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow-md">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/polls')}
              className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              View All Polls
            </button>
            <button
              onClick={() => navigate('/polls/vote')}
              className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Vote Now
            </button>
            <button
              onClick={() => navigate('/polls/results')}
              className="px-6 py-3 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              View Results
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow-md mt-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <p className="text-gray-600">No recent activity</p>
        </div>
      </div>
    </div>
  );
}