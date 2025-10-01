import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { pollsAPI } from '../../api/polls';
import { bannersAPI } from '../../api/banners';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { BarChart3, TrendingUp, Vote, Award, Trophy, Sparkles, Star } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

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

        const pollsData = Array.isArray(pollsDataRaw) ? pollsDataRaw : pollsDataRaw.results || [];
        const bannersData = Array.isArray(bannersDataRaw) ? bannersDataRaw : bannersDataRaw.results || [];

        setPolls(pollsData);
        setBanners(bannersData);

        const active = pollsData.filter(p => p.active).length;
        const voted = pollsData.filter(p => p.user_voted).length;
        
        setStats({
          total: pollsData.length,
          active,
          voted,
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

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome, {user?.username}!
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Your voting dashboard</p>
        </div>

        {banners.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="h-1 w-12 bg-gradient-to-r from-transparent via-yellow-400 to-yellow-400 rounded"></div>
              <Trophy className="h-8 w-8 text-yellow-600 animate-bounce" />
              <h2 className="text-3xl font-bold text-gray-900">Winner Announcements</h2>
              <Sparkles className="h-7 w-7 text-yellow-500 animate-pulse" />
              <div className="h-1 w-12 bg-gradient-to-r from-yellow-400 via-yellow-400 to-transparent rounded"></div>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {banners.map((banner, index) => (
                <Card key={banner.id} className="overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 relative">
                  <div className="absolute top-3 left-3 z-10">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold text-gray-700">#{index + 1}</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl flex items-center space-x-2 animate-pulse">
                      <Award className="h-5 w-5" />
                      <span>WINNER</span>
                    </div>
                  </div>

                  <div className="relative h-80 overflow-hidden bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
                    {banner.image ? (
                      <img 
                        src={getImageUrl(banner.image)}
                        alt={banner.title}
                        className="w-full h-full object-contain p-4"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          const fallback = document.createElement('div');
                          fallback.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-200 to-orange-300';
                          fallback.innerHTML = `
                            <div class="text-center p-6">
                              <svg class="w-28 h-28 text-yellow-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                              </svg>
                              <p class="text-yellow-800 font-bold text-xl">Champion!</p>
                            </div>
                          `;
                          e.target.parentElement.appendChild(fallback);
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-200 to-orange-300">
                        <div className="text-center p-6">
                          <Trophy className="w-28 h-28 text-yellow-700 mx-auto mb-3" />
                          <p className="text-yellow-800 font-bold text-xl">Champion!</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                      <div className="flex items-start space-x-3 text-white">
                        <Trophy className="h-9 w-9 flex-shrink-0 mt-1 text-yellow-300 animate-pulse" />
                        <div className="flex-1">
                          <h3 className="font-bold text-2xl mb-2 drop-shadow-2xl leading-tight">{banner.title}</h3>
                          <div className="flex items-center space-x-2">
                            <Sparkles className="h-4 w-4 text-yellow-300" />
                            <p className="text-sm text-yellow-100 font-medium">Poll Winner</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 animate-gradient"></div>
                    <div className="relative p-5 backdrop-blur-sm">
                      <div className="flex items-center justify-center space-x-2 text-white">
                        <Sparkles className="h-5 w-5 animate-spin" style={{ animationDuration: '3s' }} />
                        <span className="font-bold text-sm tracking-wide">CONGRATULATIONS!</span>
                        <Sparkles className="h-5 w-5 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Polls</p>
                <p className="text-4xl font-bold mt-2">{stats.total}</p>
              </div>
              <BarChart3 className="h-14 w-14 text-blue-200 opacity-80" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 text-white hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Active Polls</p>
                <p className="text-4xl font-bold mt-2">{stats.active}</p>
              </div>
              <TrendingUp className="h-14 w-14 text-green-200 opacity-80" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Votes Cast</p>
                <p className="text-4xl font-bold mt-2">{stats.voted}</p>
              </div>
              <Vote className="h-14 w-14 text-orange-200 opacity-80" />
            </div>
          </Card>
        </div>

        <Card className="shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Polls</h2>
            <Link to="/polls">
              <Button size="sm">View All Polls</Button>
            </Link>
          </div>

          <div className="space-y-3">
            {polls.slice(0, 5).map((poll) => (
              <div
                key={poll.id}
                className="flex items-center justify-between p-5 border-2 border-gray-100 rounded-xl hover:border-blue-300 hover:shadow-md transition-all bg-white"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">{poll.title}</h3>
                    {poll.user_voted && (
                      <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                        ✓ Voted
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{poll.description}</p>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                      {poll.category}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${poll.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                      {poll.active ? 'Active' : 'Closed'}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
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
      
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}