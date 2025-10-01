import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { pollsAPI } from '../../api/polls';
import { bannersAPI } from '../../api/banners';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { BarChart3, TrendingUp, Vote, Award } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [polls, setPolls] = useState([]);
  const [banners, setBanners] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, voted: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pollsDataRaw, bannersDataRaw] = await Promise.all([
          pollsAPI.getAllPolls(),
          bannersAPI.getBanners(),
        ]);

        // Extract arrays safely
        const pollsData = Array.isArray(pollsDataRaw) ? pollsDataRaw : pollsDataRaw.results || [];
        const bannersData = Array.isArray(bannersDataRaw) ? bannersDataRaw : bannersDataRaw.results || [];

        setPolls(pollsData);
        setBanners(bannersData);

        const active = pollsData.filter(p => p.active).length;
        const voted = pollsData.filter(p => p.user_voted).length; // ✅ Now calculating!
        
        setStats({
          total: pollsData.length,
          active,
          voted, // ✅ Real count!
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setPolls([]);
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.username}!</h1>
          <p className="text-gray-600 mt-2">Your voting dashboard</p>
        </div>

        {banners.length > 0 && (
          <div className="mb-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {banners.map((banner) => (
                <Card key={banner.id} className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  <div className="flex items-center space-x-3">
                    <Award className="h-8 w-8" />
                    <div>
                      <h3 className="font-bold text-lg">{banner.title}</h3>
                      <p className="text-sm opacity-90">Poll Winner Announcement</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Polls</p>
                <p className="text-3xl font-bold mt-1">{stats.total}</p>
              </div>
              <BarChart3 className="h-12 w-12 text-blue-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active Polls</p>
                <p className="text-3xl font-bold mt-1">{stats.active}</p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Votes Cast</p>
                <p className="text-3xl font-bold mt-1">{stats.voted}</p>
              </div>
              <Vote className="h-12 w-12 text-orange-200" />
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Polls</h2>
            <Link to="/polls">
              <Button size="sm">View All Polls</Button>
            </Link>
          </div>

          <div className="space-y-4">
            {polls.slice(0, 5).map((poll) => (
              <div
                key={poll.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="font-semibold text-gray-900">{poll.title}</h3>
                    {poll.user_voted && (
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        ✓ Voted
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{poll.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-gray-500">{poll.category}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${poll.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {poll.active ? 'Active' : 'Closed'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {poll.total_votes} {poll.total_votes === 1 ? 'vote' : 'votes'}
                    </span>
                  </div>
                </div>
                <Link to={`/polls/${poll.id}`}>
                  <Button size="sm" variant={poll.active && !poll.user_voted ? 'primary' : 'secondary'}>
                    {poll.user_voted ? 'View Results' : poll.active ? 'Vote Now' : 'View Results'}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}