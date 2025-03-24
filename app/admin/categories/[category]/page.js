import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '../../../components/admin/ImageUpload';

export default function CategoryPage({ params }) {
  const { category } = params;
  const decodedCategory = decodeURIComponent(category);

  // Example featured images (in a real app, these would come from your database)
  const featuredImages = [
    { id: 1, url: '/path/to/image1.jpg', title: 'Living Room Set 1' },
    { id: 2, url: '/path/to/image2.jpg', title: 'Living Room Set 2' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/categories"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{decodedCategory}</h1>
          <p className="mt-1 text-gray-600">Manage images and subcategories</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Featured Images</h2>
        <p className="mt-2 text-gray-600">Upload and manage featured images for this category</p>

        <div className="mt-6">
          <ImageUpload maxFiles={5} />
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredImages.map((image) => (
            <div key={image.id} className="group relative">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-600">{image.title}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Custom Categories</h2>
            <p className="mt-2 text-gray-600">Add and manage custom categories</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Plus className="w-5 h-5 mr-2" />
            Add Custom Category
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Example custom category card */}
          <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-200 transition-colors">
            <h3 className="font-medium text-gray-900">Custom Set 1</h3>
            <p className="mt-1 text-sm text-gray-500">12 images</p>
          </div>
        </div>
      </div>
    </div>
  );
} 