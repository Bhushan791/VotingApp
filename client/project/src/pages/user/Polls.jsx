import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pollsAPI } from '../../api/polls';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Search, Filter } from 'lucide-react';

export default function Polls() {
  const [polls, setPolls] = useState([]);
  const [filteredPolls, setFilteredPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchPolls();
  }, []);

  useEffect(() => {
    filterPolls();
  }, [polls, searchTerm, filterStatus]);

  const fetchPolls = async () => {
    try {
      const data = await pollsAPI.getAllPolls();
      setPolls(data);
      setFilteredPolls(data);
    } catch (error) {
      console.error('Failed to fetch polls:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPolls = () => {
    let filtered = polls;

    if (searchTerm) {
      filtered = filtered.filter(
        (poll) =>
          poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          poll.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          poll.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((poll) =>
        filterStatus === 'active' ? poll.active : !poll.active
      );
    }

    setFilteredPolls(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Polls</h1>
          <p className="text-gray-600 mt-2">Browse and vote on active polls</p>
        </div>

        <Card className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search polls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Polls</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </Card>

        {filteredPolls.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No polls found</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPolls.map((poll) => (
              <Card key={poll.id} hover>
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                      {poll.category}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        poll.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {poll.active ? 'Active' : 'Closed'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{poll.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">
                    {poll.description}
                  </p>

                  <div className="text-xs text-gray-500 mb-4">
                    {poll.options?.length || 0} options
                  </div>

                  <Link to={`/polls/${poll.id}`} className="mt-auto">
                    <Button fullWidth variant={poll.active ? 'primary' : 'secondary'}>
                      {poll.active ? 'Vote Now' : 'View Results'}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
