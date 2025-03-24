import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { toast } from 'react-hot-toast';

export default function EditCategoryModal({
  isOpen,
  onClose,
  onSubmit,
  type,
  title,
  initialData
}) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      // For categories, use featuredImage, for variations use image
      setImage(initialData.featuredImage || initialData.image || '');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !image) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      await onSubmit({ 
        name, 
        // If image is an array (new upload) use first file, otherwise use string URL
        image: Array.isArray(image) ? image[0] : image
      });
      toast.success(`${type} updated successfully`);
      handleClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(`Failed to update ${type}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setImage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder={`Enter ${type} name`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {type === 'category' ? 'Featured Image' : 'Image'}
            </label>
            <ImageUpload
              value={image}
              onChange={setImage}
              onRemove={() => setImage('')}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name || !image || loading}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 