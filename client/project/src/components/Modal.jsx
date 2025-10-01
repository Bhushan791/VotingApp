import { X } from 'lucide-react';
import Button from './Button';

export default function Modal({ isOpen, onClose, title, children, onConfirm, confirmText = 'Confirm', confirmVariant = 'primary', loading = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 z-10 transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer */}
        {onConfirm && (
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant={confirmVariant}
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? 'Processing...' : confirmText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}