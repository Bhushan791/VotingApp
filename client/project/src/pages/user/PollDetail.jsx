import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pollsAPI } from '../../api/polls';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function PollDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetchPoll();
  }, [id]);

  const fetchPoll = async () => {
    try {
      const data = await pollsAPI.getPoll(id);
      setPoll(data);

      if (!data.active) {
        const resultsData = await pollsAPI.getResults(id);
        setResults(resultsData);
        setHasVoted(true);
      }
    } catch (error) {
      console.error('Failed to fetch poll:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedOption) return;

    setVoting(true);
    try {
      await pollsAPI.vote(id, selectedOption);
      setHasVoted(true);
      const resultsData = await pollsAPI.getResults(id);
      setResults(resultsData);
    } catch (error) {
      if (error.response?.status === 400) {
        alert('You have already voted on this poll');
        setHasVoted(true);
        const resultsData = await pollsAPI.getResults(id);
        setResults(resultsData);
      } else {
        alert('Failed to submit vote. Please try again.');
      }
    } finally {
      setVoting(false);
    }
  };

  const calculatePercentage = (optionId) => {
    if (!results?.options) return 0;
    const option = results.options.find((o) => o.option_id === optionId);
    const totalVotes = results.options.reduce((sum, o) => sum + (o.vote_count || 0), 0);
    return totalVotes > 0 ? ((option?.vote_count || 0) / totalVotes) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <p className="text-gray-600">Poll not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/polls')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Polls
        </button>

        <Card>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                {poll.category}
              </span>
              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  poll.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {poll.active ? 'Active' : 'Closed'}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{poll.title}</h1>
            <p className="text-gray-600 text-lg">{poll.description}</p>
          </div>

          {hasVoted || !poll.active ? (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Results</h2>
              <div className="space-y-4">
                {(results?.options || poll.options).map((option) => {
                  const percentage = calculatePercentage(option.id);
                  const voteCount = results?.options?.find(
                    (o) => o.option_id === option.id
                  )?.vote_count || 0;
                  const isWinner = results?.winner?.option_id === option.id;

                  return (
                    <div
                      key={option.id}
                      className={`relative p-4 rounded-lg border-2 ${
                        isWinner ? 'border-green-500 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 flex items-center">
                          {option.option_text}
                          {isWinner && (
                            <CheckCircle2 className="ml-2 h-5 w-5 text-green-600" />
                          )}
                        </span>
                        <span className="text-sm text-gray-600">
                          {voteCount} votes ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isWinner ? 'bg-green-600' : 'bg-blue-600'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {results?.winner && (
                <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg">
                  <p className="text-green-800 font-medium">
                    Winner: {results.winner.option_text}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Cast Your Vote</h2>
              <div className="space-y-3 mb-6">
                {poll.options.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedOption === option.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="poll-option"
                      value={option.id}
                      checked={selectedOption === option.id}
                      onChange={() => setSelectedOption(option.id)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="ml-3 text-gray-900 font-medium">
                      {option.option_text}
                    </span>
                  </label>
                ))}
              </div>
              <Button
                onClick={handleVote}
                disabled={!selectedOption || voting}
                fullWidth
                size="lg"
              >
                {voting ? 'Submitting...' : 'Submit Vote'}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}