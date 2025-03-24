import { Inter } from "next/font/google";
import Sidebar from "../components/admin/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="container mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
} 