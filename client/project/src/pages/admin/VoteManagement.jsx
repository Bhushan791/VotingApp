import { useEffect, useState } from 'react';
import { adminManagementAPI } from '../../api/adminManagement';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { RefreshCw, Trash2, Filter, AlertCircle } from 'lucide-react';

export default function VoteManagement() {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pollFilter, setPollFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0 });
  
  // Modal
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, voteId: null, info: '' });

  useEffect(() => {
    fetchVotes();
  }, [pagination.page, pollFilter, userFilter]);

  const fetchVotes = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        page_size: pagination.pageSize,
        poll_id: pollFilter,
        user_id: userFilter,
      };
      const data = await adminManagementAPI.getVotes(params);
      setVotes(data.results || []);
      setPagination({ ...pagination, total: data.count || 0 });
    } catch (error) {
      console.error('Failed to fetch votes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await adminManagementAPI.deleteVote(deleteModal.voteId);
      setDeleteModal({ isOpen: false, voteId: null, info: '' });
      fetchVotes();
    } catch (error) {
      console.error('Failed to delete vote:', error);
      alert(error.response?.data?.error || 'Failed to delete vote');
    }
  };

  const clearFilters = () => {
    setPollFilter('');
    setUserFilter('');
    setPagination({ ...pagination, page: 1 });
  };

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  if (loading && votes.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-900">Vote Management</h1>
          <p className="text-gray-600 mt-2">Monitor and moderate all votes</p>
        </div>

        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Poll ID
              </label>
              <input
                type="number"
                value={pollFilter}
                onChange={(e) => setPollFilter(e.target.value)}
                placeholder="Enter poll ID..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by User ID
              </label>
              <input
                type="number"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                placeholder="Enter user ID..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end space-x-2">
              <Button variant="outline" onClick={clearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button variant="outline" onClick={fetchVotes}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <Card className="mb-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-800 font-medium">Moderation Notice</p>
              <p className="text-sm text-yellow-700 mt-1">
                Deleting votes should only be done for moderation purposes (spam, fraud, etc.). 
                This action is permanent and cannot be undone.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Vote Logs</h2>
            <p className="text-sm text-gray-600">Total: {pagination.total} votes</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Vote ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Poll</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Option</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Voter</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Voted At</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {votes.map((vote) => (
                  <tr key={vote.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-900 font-mono text-sm">#{vote.id}</td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">{vote.poll_title}</p>
                      <p className="text-sm text-gray-500">Poll ID: {vote.poll}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                        {vote.option_text}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">{vote.voter_username}</p>
                      <p className="text-sm text-gray-500">User ID: {vote.voted_by}</p>
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm">
                      {new Date(vote.voted_at).toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => 
                            setDeleteModal({ 
                              isOpen: true, 
                              voteId: vote.id, 
                              info: `${vote.voter_username}'s vote on ${vote.poll_title}` 
                            })
                          }
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete vote (moderation only)"
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

          {votes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No votes found</p>
            </div>
          )}

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
          onClose={() => setDeleteModal({ isOpen: false, voteId: null, info: '' })}
          title="Delete Vote"
          onConfirm={handleDelete}
          confirmText="Delete"
          confirmVariant="primary"
        >
          <div className="space-y-3">
            <p className="text-gray-600">
              Are you sure you want to delete this vote?
            </p>
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm text-gray-700 font-medium">{deleteModal.info}</p>
            </div>
            <p className="text-sm text-red-600">
              ⚠️ This action is permanent and should only be used for moderation purposes.
            </p>
          </div>
        </Modal>
      </div>
    </div>
  );
}