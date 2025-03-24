import { useState } from 'react';
import { X } from 'lucide-react';
import ImageUpload from './ImageUpload';

export default function AddCategoryModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  type = 'category', // 'category' or 'variation'
  title 
}) {
  const [name, setName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, image: selectedImage });
    setName('');
    setSelectedImage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-gray-900">
          {title || `Add New ${type === 'category' ? 'Category' : 'Variation'}`}
        </h2>

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
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
              placeholder={`Enter ${type} name`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {type === 'category' ? 'Featured Image' : 'Image'}
            </label>
            <ImageUpload
              onUpload={(files) => setSelectedImage(files[0])}
              maxFiles={1}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add {type === 'category' ? 'Category' : 'Variation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 