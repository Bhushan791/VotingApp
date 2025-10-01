import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pollsAPI } from '../../api/polls';
import Card from '../../components/Card';
import { ArrowLeft, TrendingUp, Award, Users } from 'lucide-react';

export default function PollStats() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [pollData, resultsData] = await Promise.all([
        pollsAPI.getPoll(id),
        pollsAPI.getResults(id),
      ]);

      setPoll(pollData);
      setResults(resultsData);
      
      console.log('Poll Data:', pollData);
      console.log('Results Data:', resultsData);
    } catch (error) {
      console.error('Failed to fetch poll stats:', error);
    } finally {
      setLoading(false);
    }
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

  // Calculate total votes from results
  const totalVotes = results?.options?.reduce((sum, opt) => sum + (opt.votes_count || 0), 0) || 0;

  // Find the leading option
  const leadingOption = results?.options?.reduce((max, opt) => 
    (opt.votes_count || 0) > (max?.votes_count || 0) ? opt : max
  , results?.options?.[0]) || null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{poll.title}</h1>
          <p className="text-gray-600 mt-2">{poll.description}</p>
          <div className="flex items-center space-x-4 mt-4">
            <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700">
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
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Votes</p>
                <p className="text-3xl font-bold mt-1">{totalVotes}</p>
              </div>
              <Users className="h-12 w-12 text-blue-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Options</p>
                <p className="text-3xl font-bold mt-1">{poll.options?.length || 0}</p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Leading Option</p>
                <p className="text-xl font-bold mt-1 line-clamp-1">
                  {leadingOption?.option_text || 'No votes yet'}
                </p>
              </div>
              <Award className="h-12 w-12 text-yellow-200" />
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Vote Distribution</h2>
          
          {!results?.options || results.options.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No voting data available yet.</p>
          ) : (
            <div className="space-y-4">
              {results.options.map((option) => {
                const voteCount = option.votes_count || 0;
                const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
                const isLeading = leadingOption && option.option_text === leadingOption.option_text && voteCount > 0;

                return (
                  <div
                    key={option.option_text}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isLeading ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{option.option_text}</span>
                        {isLeading && (
                          <Award className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                          {voteCount} {voteCount === 1 ? 'vote' : 'votes'}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isLeading ? 'bg-green-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {leadingOption && totalVotes > 0 && (
            <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
              <p className="text-yellow-800 font-medium">
                Leading Option: {leadingOption.option_text} with {leadingOption.votes_count} votes
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}