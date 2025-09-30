// client/src/polls/components/PollCreate.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPoll, addPollOptions } from '../api';

export default function PollCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  });
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate options
    const validOptions = options.filter((opt) => opt.trim() !== '');
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options!');
      return;
    }

    setLoading(true);

    // Step 1: Create poll
    const pollResult = await createPoll(formData);

    if (!pollResult.success) {
      setError(pollResult.error);
      setLoading(false);
      return;
    }

    // Step 2: Add options to the poll
    const pollId = pollResult.data.id;
    const optionsResult = await addPollOptions(pollId, validOptions);

    if (optionsResult.success) {
      alert('Poll created successfully!');
      navigate('/admin-dashboard');
    } else {
      setError(optionsResult.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6">Create New Poll</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {JSON.stringify(error)}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              rows="3"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="e.g., Politics, Sports, Entertainment"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Options</label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded"
                  placeholder={`Option ${index + 1}`}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              + Add Option
            </button>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? 'Creating...' : 'Create Poll'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin-dashboard')}
              className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}