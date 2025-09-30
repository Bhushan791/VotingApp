// client/src/polls/components/PollList.jsx
import { useEffect, useState } from 'react';
import { getPolls } from '../api';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../common/auth';

export default function PollList() {
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isLoggedIn = isAuthenticated();

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    setLoading(true);
    const result = await getPolls();

    if (result.success) {
      setPolls(result.data);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleVoteClick = (pollId) => {
    if (!isLoggedIn) {
      alert('Please login or register to vote!');
      navigate('/login');
    } else {
      navigate(`/polls/${pollId}/vote`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading polls...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">VoteNow 🗳️</h1>
          <div className="flex gap-4">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Register
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Dashboard
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6">Active Polls</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {JSON.stringify(error)}
          </div>
        )}

        {polls.length === 0 ? (
          <div className="bg-white p-8 rounded shadow-md text-center">
            <p className="text-gray-600">No active polls available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll) => (
              <div key={poll.id} className="bg-white p-6 rounded shadow-md">
                <div className="mb-4">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {poll.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-2">{poll.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{poll.description}</p>

                <div className="text-xs text-gray-500 mb-4">
                  Created: {new Date(poll.created_at).toLocaleDateString()}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleVoteClick(poll.id)}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Vote Now
                  </button>
                  <button
                    onClick={() => navigate(`/polls/${poll.id}/results`)}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Results
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}