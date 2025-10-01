import { useEffect, useState } from 'react';
import { adminManagementAPI } from '../../api/adminManagement';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { Search, Edit2, Trash2, RefreshCw, ToggleLeft, ToggleRight, Plus, X } from 'lucide-react';

export default function PollManagement() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 });
  
  // Modals
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, pollId: null, title: '' });
  const [editModal, setEditModal] = useState({ isOpen: false, poll: null });
  const [selectedPolls, setSelectedPolls] = useState([]);
  
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    active: true,
    options: [],
  });

  useEffect(() => {
    fetchPolls();
  }, [pagination.page, activeFilter]);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        page_size: pagination.pageSize,
        search: searchTerm,
        active: activeFilter,
      };
      const data = await adminManagementAPI.getPolls(params);
      setPolls(data.results || []);
      setPagination({ ...pagination, total: data.count || 0 });
    } catch (error) {
      console.error('Failed to fetch polls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchPolls();
  };

  const openEditModal = async (poll) => {
    try {
      const fullPoll = await adminManagementAPI.getPoll(poll.id);
      setEditForm({
        title: fullPoll.title,
        description: fullPoll.description,
        category: fullPoll.category,
        active: fullPoll.active,
        options: fullPoll.options.map(opt => opt.option_text),
      });
      setEditModal({ isOpen: true, poll: fullPoll });
    } catch (error) {
      console.error('Failed to fetch poll details:', error);
    }
  };

  const handleEdit = async () => {
    try {
      await adminManagementAPI.updatePoll(editModal.poll.id, {
        ...editForm,
        options: editForm.options.filter(opt => opt.trim() !== ''),
      });
      setEditModal({ isOpen: false, poll: null });
      fetchPolls();
    } catch (error) {
      console.error('Failed to update poll:', error);
      alert(error.response?.data?.error || 'Failed to update poll');
    }
  };

  const handleDelete = async () => {
    try {
      await adminManagementAPI.deletePoll(deleteModal.pollId);
      setDeleteModal({ isOpen: false, pollId: null, title: '' });
      fetchPolls();
    } catch (error) {
      console.error('Failed to delete poll:', error);
      alert(error.response?.data?.error || 'Failed to delete poll');
    }
  };

  const handleToggleActive = async (pollId) => {
    try {
      await adminManagementAPI.togglePollActive(pollId);
      fetchPolls();
    } catch (error) {
      console.error('Failed to toggle poll status:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPolls.length === 0) return;
    if (!window.confirm(`Delete ${selectedPolls.length} selected polls?`)) return;

    try {
      await adminManagementAPI.bulkDeletePolls(selectedPolls);
      setSelectedPolls([]);
      fetchPolls();
    } catch (error) {
      console.error('Failed to bulk delete:', error);
      alert(error.response?.data?.error || 'Failed to delete polls');
    }
  };

  const togglePollSelection = (pollId) => {
    setSelectedPolls(prev =>
      prev.includes(pollId) ? prev.filter(id => id !== pollId) : [...prev, pollId]
    );
  };

  const addOption = () => {
    setEditForm({ ...editForm, options: [...editForm.options, ''] });
  };

  const removeOption = (index) => {
    const newOptions = editForm.options.filter((_, i) => i !== index);
    setEditForm({ ...editForm, options: newOptions });
  };

  const updateOption = (index, value) => {
    const newOptions = [...editForm.options];
    newOptions[index] = value;
    setEditForm({ ...editForm, options: newOptions });
  };

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  if (loading && polls.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-900">Poll Management</h1>
          <p className="text-gray-600 mt-2">Manage all polls, options, and status</p>
        </div>

        <Card className="mb-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search polls by title or description..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Closed</option>
            </select>
            <Button type="submit">Search</Button>
            <Button type="button" variant="outline" onClick={fetchPolls}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </form>
        </Card>

        {selectedPolls.length > 0 && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <p className="text-blue-900 font-medium">
                {selectedPolls.length} poll(s) selected
              </p>
              <Button variant="outline" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          </Card>
        )}

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPolls(polls.map(p => p.id));
                        } else {
                          setSelectedPolls([]);
                        }
                      }}
                      checked={selectedPolls.length === polls.length && polls.length > 0}
                      className="w-4 h-4 rounded"
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Votes</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Options</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {polls.map((poll) => (
                  <tr key={poll.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedPolls.includes(poll.id)}
                        onChange={() => togglePollSelection(poll.id)}
                        className="w-4 h-4 rounded"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">{poll.title}</p>
                      <p className="text-sm text-gray-500">by {poll.created_by_username}</p>
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
                    <td className="py-4 px-4 text-gray-600">{poll.total_votes || 0}</td>
                    <td className="py-4 px-4 text-gray-600">{poll.options_count || 0}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleToggleActive(poll.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title={poll.active ? 'Deactivate' : 'Activate'}
                        >
                          {poll.active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => openEditModal(poll)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, pollId: poll.id, title: poll.title })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
                {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Delete Modal */}
        <Modal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, pollId: null, title: '' })}
          title="Delete Poll"
          onConfirm={handleDelete}
          confirmText="Delete"
          confirmVariant="primary"
        >
          <p className="text-gray-600">
            Are you sure you want to delete poll <strong>{deleteModal.title}</strong>? This will also delete all votes. This action cannot be undone.
          </p>
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, poll: null })}
          title="Edit Poll"
          onConfirm={handleEdit}
          confirmText="Save Changes"
        >
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editForm.active}
                  onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Active Poll</span>
              </label>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Options</label>
                <button
                  type="button"
                  onClick={addOption}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Option
                </button>
              </div>
              <div className="space-y-2">
                {editForm.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {editForm.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-yellow-600 mt-2">
                ⚠️ Warning: Updating options will delete all existing votes!
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}