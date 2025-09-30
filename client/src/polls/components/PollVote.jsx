// client/src/polls/components/PollVote.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPollDetail, castVote } from '../api';

export default function PollVote() {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPollDetail();
  }, [pollId]);

  const fetchPollDetail = async () => {
    setLoading(true);
    const result = await getPollDetail(pollId);

    if (result.success) {
      setPoll(result.data);
      // Fetch options separately or from poll data
      // For now, we'll need to make another API call to get options
      // Since your serializer doesn't include options in PollSerializer
      // You might want to update the backend to include options
      // For now, let's assume we'll add them manually
      setOptions([]); // TODO: Fetch options
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleVoteSubmit = async () => {
    if (!selectedOption) {
      alert('Please select an option!');
      return;
    }

    setSubmitting(true);
    const result = await castVote(pollId, selectedOption);

    if (result.success) {
      alert('Vote cast successfully!');
      navigate(`/polls/${pollId}/results`);
    } else {
      alert(`Error: ${JSON.stringify(result.error)}`);
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading poll...</p>
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow-md">
        <button
          onClick={() => navigate('/')}
          className="mb-4 text-blue-500 hover:underline"
        >
          ← Back to Polls
        </button>

        <h2 className="text-2xl font-bold mb-4">{poll?.title}</h2>
        <p className="text-gray-600 mb-6">{poll?.description}</p>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Select your choice:</h3>

          {options.length === 0 ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <p>No options available for this poll.</p>
              <p className="text-sm mt-2">
                Note: Backend needs to return options in poll detail endpoint or
                create a separate endpoint.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center p-4 border rounded hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="poll-option"
                    value={option.id}
                    checked={selectedOption === option.id}
                    onChange={() => setSelectedOption(option.id)}
                    className="mr-3"
                  />
                  <span className="text-lg">{option.option_text}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleVoteSubmit}
          disabled={submitting || !selectedOption}
          className="w-full px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {submitting ? 'Submitting...' : 'Cast Vote'}
        </button>
      </div>
    </div>
  );
}