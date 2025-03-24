import { LayoutGrid, Image, FolderTree, Upload } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Categories', value: '5', icon: LayoutGrid },
    { label: 'Sub Categories', value: '9', icon: FolderTree },
    { label: 'Total Images', value: '124', icon: Image },
    { label: 'Recent Uploads', value: '12', icon: Upload },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to your admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-purple-200 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <Icon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          <div className="mt-4 space-y-4">
            <button className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Upload className="w-5 h-5 mr-2" />
              Upload New Images
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
              <FolderTree className="w-5 h-5 mr-2" />
              Manage Categories
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center text-sm text-gray-600">
              <Image className="w-4 h-4 mr-2" />
              <span>New images uploaded to Traditional Living Room</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FolderTree className="w-4 h-4 mr-2" />
              <span>Added new category: Modern Kitchen</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 