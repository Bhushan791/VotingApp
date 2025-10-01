import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../../api/dashboard';
import { pollsAPI } from '../../api/polls';
import { adminManagementAPI } from '../../api/adminManagement';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { BarChart3, Users, Vote, TrendingUp, Plus, Award, Settings, UserCog, Image as ImageIcon, FileText } from 'lucide-react';

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [stats, setStats] = useState(null);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [summaryData, pollsData, statsData] = await Promise.all([
        dashboardAPI.getAdminSummary(),
        pollsAPI.getAllPolls(),
        adminManagementAPI.getStats(),
      ]);

      setSummary(summaryData);
      setPolls(pollsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage polls, users, and view analytics</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/admin/create-poll">
              <Button>
                <Plus className="h-5 w-5 mr-2" />
                Create Poll
              </Button>
            </Link>
            <Link to="/admin/create-banner">
              <Button variant="outline">
                <Award className="h-5 w-5 mr-2" />
                Create Banner
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Polls</p>
                <p className="text-3xl font-bold mt-1">{stats?.total_polls || polls.length}</p>
                <p className="text-blue-100 text-xs mt-1">{stats?.active_polls || 0} active</p>
              </div>
              <BarChart3 className="h-12 w-12 text-blue-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Users</p>
                <p className="text-3xl font-bold mt-1">{stats?.total_users || 0}</p>
                <p className="text-green-100 text-xs mt-1">{stats?.admin_users || 0} admins</p>
              </div>
              <Users className="h-12 w-12 text-green-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Total Votes</p>
                <p className="text-3xl font-bold mt-1">{stats?.total_votes || 0}</p>
              </div>
              <Vote className="h-12 w-12 text-orange-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Banners</p>
                <p className="text-3xl font-bold mt-1">{stats?.total_banners || 0}</p>
              </div>
              <Award className="h-12 w-12 text-purple-200" />
            </div>
          </Card>
        </div>

        {/* Management Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Link to="/admin/users">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <UserCog className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">User Management</p>
                  <p className="text-sm text-gray-500">Manage all users</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/admin/polls-management">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Settings className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Poll Management</p>
                  <p className="text-sm text-gray-500">Edit & delete polls</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/admin/banners-management">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-500">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <ImageIcon className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Banner Management</p>
                  <p className="text-sm text-gray-500">Manage banners</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/admin/votes-management">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-orange-500">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FileText className="h-8 w-8 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Vote Logs</p>
                  <p className="text-sm text-gray-500">Monitor votes</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Recent Polls Table */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Polls</h2>
            <Link to="/admin/polls-management">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Options</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {polls.slice(0, 5).map((poll) => (
                  <tr key={poll.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{poll.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{poll.description}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        {poll.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${
                          poll.active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {poll.active ? 'Active' : 'Closed'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{poll.options?.length || 0}</td>
                    <td className="py-4 px-4 text-right">
                      <Link to={`/admin/polls/${poll.id}/stats`}>
                        <Button size="sm" variant="outline">
                          View Stats
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}