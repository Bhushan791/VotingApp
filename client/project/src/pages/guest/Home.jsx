import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pollsAPI } from '../../api/polls';
import { bannersAPI } from '../../api/banners';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Vote, TrendingUp, Users, Award } from 'lucide-react';

export default function Home() {
  const [polls, setPolls] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

const fetchData = async () => {
  try {
    const [pollsDataRaw, bannersDataRaw] = await Promise.all([
      pollsAPI.getAllPolls(),
      bannersAPI.getBanners(),
    ]);

    // Ensure arrays
    const pollsArray = Array.isArray(pollsDataRaw) ? pollsDataRaw : pollsDataRaw.results || [];
    const bannersArray = Array.isArray(bannersDataRaw) ? bannersDataRaw : bannersDataRaw.results || [];

    // Only active polls
    setPolls(pollsArray.filter((p) => p.active).slice(0, 6));
    setBanners(bannersArray.slice(0, 3)); // optional: limit banners
  } catch (error) {
    console.error('Failed to fetch data:', error);
    setPolls([]);
    setBanners([]);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Vote className="h-20 w-20 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Make Your Voice Heard
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users in shaping decisions through democratic voting.
            Create polls, cast votes, and see real-time results.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link to="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>

        {banners.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Recent Winners
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {banners.slice(0, 3).map((banner) => (
                <Card key={banner.id} hover className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  <div className="flex items-center space-x-3">
                    <Award className="h-10 w-10" />
                    <div>
                      <h3 className="font-bold text-xl">{banner.title}</h3>
                      <p className="text-sm opacity-90">Winner Announcement</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-3 mb-16">
          <Card hover className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <Vote className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Create Polls</h3>
            <p className="text-gray-600">
              Easily create custom polls with multiple options and categories
            </p>
          </Card>

          <Card hover className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Cast Votes</h3>
            <p className="text-gray-600">
              Participate in active polls and make your opinion count
            </p>
          </Card>

          <Card hover className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-orange-100 p-4 rounded-full">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">See Results</h3>
            <p className="text-gray-600">
              View real-time analytics and predicted winners instantly
            </p>
          </Card>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Active Polls</h2>
              <p className="text-gray-600">Browse and vote on trending topics</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {polls.map((poll) => (
                <Card key={poll.id} hover>
                  <div className="flex flex-col h-full">
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700 mb-3 inline-block w-fit">
                      {poll.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{poll.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">
                      {poll.description}
                    </p>
                    <div className="text-xs text-gray-500 mb-4">
                      {poll.options?.length || 0} options available
                    </div>
                    <Link to="/register" className="mt-auto">
                      <Button fullWidth>Sign Up to Vote</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Link to="/register">
                <Button size="lg">
                  View All Polls
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
