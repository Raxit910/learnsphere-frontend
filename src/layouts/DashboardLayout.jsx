import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col h-screen">
      {/* Fixed navbar at the top */}
      <div className="sticky top-0 z-10">
        <Navbar />
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Fixed sidebar */}
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
        {/* Scrollable main content */}
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}