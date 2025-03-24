import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { toast } from 'react-hot-toast';

export default function AddCategoryModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  type = 'category', // 'category' or 'variation'
  title 
}) {
  const [name, setName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset state when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setError('');
    } else {
      // Clean up when modal closes
      setName('');
      setSelectedImage(null);
      setError('');
    }
  }, [isOpen]);

  const handleImageChange = (file) => {
    console.log('Selected file in modal:', file);
    setSelectedImage(file);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a name');
      return;
    }
    
    if (!selectedImage || !(selectedImage instanceof File)) {
      toast.error('Please select a valid image file');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    onSubmit({ name, image: selectedImage })
      .then(() => {
        // Reset form
        setName('');
        setSelectedImage(null);
        onClose();
        toast.success(`${type === 'category' ? 'Category' : 'Variation'} added successfully`);
      })
      .catch(error => {
        console.error('Error in form submission:', error);
        setError(error.message || `Failed to add ${type}`);
        toast.error(`Failed to add ${type}: ${error.message || 'Unknown error'}`);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleClose = () => {
    setName('');
    setSelectedImage(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-gray-900">
          {title || `Add New ${type === 'category' ? 'Category' : 'Variation'}`}
        </h2>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm text-gray-900"
              placeholder={`Enter ${type} name`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {type === 'category' ? 'Featured Image' : 'Image'}
            </label>
            <ImageUpload
              value={selectedImage}
              onChange={handleImageChange}
              onRemove={() => setSelectedImage(null)}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name || !selectedImage}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : `Add ${type === 'category' ? 'Category' : 'Variation'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 