import Link from 'next/link';
import { Home, Image, FolderTree, Settings } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/admin' },
    { icon: FolderTree, label: 'Categories', href: '/admin/categories' },
    { icon: Image, label: 'Image Gallery', href: '/admin/gallery' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-purple-600">Srija Admin</h2>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar; 