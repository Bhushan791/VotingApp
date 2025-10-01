import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pollsAPI } from '../../api/polls';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { ArrowLeft, Plus, X } from 'lucide-react';

export default function CreatePoll() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    active: true,
  });
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  const validOptions = options.filter((opt) => opt.trim() !== '');
  if (validOptions.length < 2) {
    setError('Please provide at least 2 options');
    return;
  }

  setLoading(true);

  try {
    // Format options correctly for the serializer
    const payload = { 
      ...formData, 
      options: validOptions.map(opt => ({ option_text: opt }))  // Fixed!
    };
    await pollsAPI.createPoll(payload);

    navigate('/admin/dashboard');
  } catch (err) {
    setError(err.response?.data?.detail || 'Failed to create poll. Please try again.');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Poll</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poll Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter poll title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter poll description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Politics, Entertainment, Sports"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Active Poll</span>
              </label>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Options <span className="text-red-500">*</span>
                </label>
                <Button type="button" size="sm" onClick={addOption}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Option
                </Button>
              </div>

              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button type="submit" disabled={loading} fullWidth>
                {loading ? 'Creating...' : 'Create Poll'}
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
        </Card>
      </div>
    </div>
  );
}
