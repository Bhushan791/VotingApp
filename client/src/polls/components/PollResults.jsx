// client/src/polls/components/PollResults.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPollResults } from '../api';

export default function PollResults() {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResults();
  }, [pollId]);

  const fetchResults = async () => {
    setLoading(true);
    const result = await getPollResults(pollId);

    if (result.success) {
      setResults(result.data);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {JSON.stringify(error)}
        </div>
      </div>
    );
  }

  const totalVotes = results?.options?.reduce(
    (sum, opt) => sum + opt.votes_count,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow-md">
        <button
          onClick={() => navigate('/')}
          className="mb-4 text-blue-500 hover:underline"
        >
          ← Back to Polls
        </button>

        <h2 className="text-2xl font-bold mb-2">{results?.poll}</h2>
        <p className="text-gray-600 mb-6">Total Votes: {totalVotes}</p>

        <div className="space-y-4">
          {results?.options?.map((option, index) => {
            const percentage =
              totalVotes > 0 ? (option.votes_count / totalVotes) * 100 : 0;

            return (
              <div key={index} className="border rounded p-4">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">{option.option_text}</span>
                  <span className="text-gray-600">
                    {option.votes_count} votes ({percentage.toFixed(1)}%)
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-500 h-4 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {totalVotes === 0 && (
          <div className="mt-6 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            No votes have been cast yet. Be the first to vote!
          </div>
        )}

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate(`/polls/${pollId}/vote`)}
            className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Vote Now
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Refresh Results
          </button>
        </div>
      </div>
    </div>
  );
}