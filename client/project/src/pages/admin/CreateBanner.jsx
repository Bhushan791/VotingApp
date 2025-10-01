import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bannersAPI } from '../../api/banners';
import { pollsAPI } from '../../api/polls';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { ArrowLeft, Upload } from 'lucide-react';

export default function CreateBanner() {
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);
  const [formData, setFormData] = useState({
    poll: '',
    title: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [fetchingPolls, setFetchingPolls] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      setFetchingPolls(true);
      
      // Fetch ALL polls (including closed) using the new admin endpoint
      const allPolls = await pollsAPI.getAdminAllPolls();
      
      // Try to fetch banners
      let existingBanners = [];
      try {
        existingBanners = await bannersAPI.getBanners();
      } catch (bannerError) {
        console.warn('Could not fetch banners, assuming none exist:', bannerError);
        existingBanners = [];
      }

      // Handle array responses safely
      const pollsArray = Array.isArray(allPolls) ? allPolls : allPolls?.results || [];
      const bannersArray = Array.isArray(existingBanners) ? existingBanners : existingBanners?.results || [];
      
      console.log('All Polls (including closed):', pollsArray);
      console.log('Existing Banners:', bannersArray);
      
      // Get poll IDs that already have banners
      const pollsWithBanners = new Set(
        bannersArray
          .filter(banner => banner && banner.poll)
          .map(banner => banner.poll)
      );
      console.log('Polls with banners (IDs):', Array.from(pollsWithBanners));
      
      // Filter: only closed polls without banners
      const availablePolls = pollsArray.filter(
        poll => poll && !poll.active && !pollsWithBanners.has(poll.id)
      );
      
      console.log('Available Polls for Banner:', availablePolls);
      
      setPolls(availablePolls);
      
      if (availablePolls.length === 0) {
        const closedPolls = pollsArray.filter(p => p && !p.active);
        if (closedPolls.length === 0) {
          setError('No closed polls found. Please close at least one poll first.');
        } else {
          setError('All closed polls already have banners.');
        }
      }
    } catch (error) {
      console.error('Failed to fetch polls:', error);
      setError('Failed to load polls. Please try again.');
    } finally {
      setFetchingPolls(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.poll || !formData.title) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('poll', formData.poll);
      data.append('title', formData.title);
      if (formData.image) {
        data.append('image', formData.image);
      }

      await bannersAPI.createBanner(data);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create banner. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>

        <Card>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Winner Banner</h1>

          {fetchingPolls ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading polls...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Poll <span className="text-red-500">*</span>
                </label>
                <select
                  name="poll"
                  value={formData.poll}
                  onChange={handleChange}
                  required
                  disabled={polls.length === 0}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {polls.length === 0 
                      ? 'No polls available' 
                      : 'Select a closed poll without a banner'}
                  </option>
                  {polls.map((poll) => (
                    <option key={poll.id} value={poll.id}>
                      {poll.title}
                    </option>
                  ))}
                </select>
                {polls.length === 0 && (
                  <p className="mt-2 text-sm text-gray-500">
                    Close a poll first or wait for polls to be closed before creating banners.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Winner Announcement"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      Upload an image
                    </span>
                    <input
                      type="file"
                      name="image"
                      onChange={handleChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                  {formData.image && (
                    <p className="text-sm text-gray-600 mt-2">{formData.image.name}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button type="submit" disabled={loading || polls.length === 0} fullWidth>
                  {loading ? 'Creating...' : 'Create Banner'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/dashboard')}
                  fullWidth
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}