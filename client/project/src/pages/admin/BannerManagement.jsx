import { useEffect, useState } from 'react';
import { adminManagementAPI } from '../../api/adminManagement';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { Search, Edit2, Trash2, RefreshCw, Image as ImageIcon } from 'lucide-react';

export default function BannerManagement() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 });
  
  // Modals
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, bannerId: null, title: '' });
  const [editModal, setEditModal] = useState({ isOpen: false, banner: null });
  const [selectedBanners, setSelectedBanners] = useState([]);
  
  const [editForm, setEditForm] = useState({
    title: '',
    poll: '',
    image: null,
  });

  useEffect(() => {
    fetchBanners();
  }, [pagination.page]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        page_size: pagination.pageSize,
        search: searchTerm,
      };
      const data = await adminManagementAPI.getBanners(params);
      setBanners(data.results || []);
      setPagination({ ...pagination, total: data.count || 0 });
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchBanners();
  };

  const openEditModal = async (banner) => {
    try {
      const fullBanner = await adminManagementAPI.getBanner(banner.id);
      setEditForm({
        title: fullBanner.title,
        poll: fullBanner.poll,
        image: null,
      });
      setEditModal({ isOpen: true, banner: fullBanner });
    } catch (error) {
      console.error('Failed to fetch banner details:', error);
    }
  };

  const handleEdit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', editForm.title);
      formData.append('poll', editForm.poll);
      if (editForm.image) {
        formData.append('image', editForm.image);
      }

      await adminManagementAPI.updateBanner(editModal.banner.id, formData);
      setEditModal({ isOpen: false, banner: null });
      fetchBanners();
    } catch (error) {
      console.error('Failed to update banner:', error);
      alert(error.response?.data?.error || 'Failed to update banner');
    }
  };

  const handleDelete = async () => {
    try {
      await adminManagementAPI.deleteBanner(deleteModal.bannerId);
      setDeleteModal({ isOpen: false, bannerId: null, title: '' });
      fetchBanners();
    } catch (error) {
      console.error('Failed to delete banner:', error);
      alert(error.response?.data?.error || 'Failed to delete banner');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBanners.length === 0) return;
    if (!window.confirm(`Delete ${selectedBanners.length} selected banners?`)) return;

    try {
      await adminManagementAPI.bulkDeleteBanners(selectedBanners);
      setSelectedBanners([]);
      fetchBanners();
    } catch (error) {
      console.error('Failed to bulk delete:', error);
      alert(error.response?.data?.error || 'Failed to delete banners');
    }
  };

  const toggleBannerSelection = (bannerId) => {
    setSelectedBanners(prev =>
      prev.includes(bannerId) ? prev.filter(id => id !== bannerId) : [...prev, bannerId]
    );
  };

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  if (loading && banners.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-900">Banner Management</h1>
          <p className="text-gray-600 mt-2">Manage winner announcement banners</p>
        </div>

        <Card className="mb-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by banner title or poll name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button type="submit">Search</Button>
            <Button type="button" variant="outline" onClick={fetchBanners}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </form>
        </Card>

        {selectedBanners.length > 0 && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <p className="text-blue-900 font-medium">
                {selectedBanners.length} banner(s) selected
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
                          setSelectedBanners(banners.map(b => b.id));
                        } else {
                          setSelectedBanners([]);
                        }
                      }}
                      checked={selectedBanners.length === banners.length && banners.length > 0}
                      className="w-4 h-4 rounded"
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Image</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Poll</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Poll Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => (
                  <tr key={banner.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedBanners.includes(banner.id)}
                        onChange={() => toggleBannerSelection(banner.id)}
                        className="w-4 h-4 rounded"
                      />
                    </td>
                    <td className="py-4 px-4">
                      {banner.image ? (
                        <img
                          src={banner.image}
                          alt={banner.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">{banner.title}</p>
                      <p className="text-sm text-gray-500">ID: {banner.id}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-900">{banner.poll_title}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${
                          banner.poll_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {banner.poll_active ? 'Active' : 'Closed'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm">
                      {new Date(banner.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(banner)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, bannerId: banner.id, title: banner.title })}
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

          {banners.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No banners found</p>
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
          onClose={() => setDeleteModal({ isOpen: false, bannerId: null, title: '' })}
          title="Delete Banner"
          onConfirm={handleDelete}
          confirmText="Delete"
          confirmVariant="primary"
        >
          <p className="text-gray-600">
            Are you sure you want to delete banner <strong>{deleteModal.title}</strong>? This action cannot be undone.
          </p>
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, banner: null })}
          title="Edit Banner"
          onConfirm={handleEdit}
          confirmText="Save Changes"
        >
          <div className="space-y-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Image</label>
              {editModal.banner?.image && (
                <img
                  src={editModal.banner.image}
                  alt={editModal.banner.title}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
              )}
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload New Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEditForm({ ...editForm, image: e.target.files[0] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              {editForm.image && (
                <p className="text-sm text-gray-600 mt-1">Selected: {editForm.image.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Associated Poll</label>
              <input
                type="text"
                value={editModal.banner?.poll_title || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">Poll association cannot be changed</p>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}