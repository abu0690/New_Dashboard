import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-full flex bg-gray-50 overflow-hidden">

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        closeSidebar={() => setIsSidebarOpen(false)} 
      />

      {/* MAIN CONTENT */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* NAVBAR */}
        <Navbar openSidebar={() => setIsSidebarOpen(true)} />

        {/* PAGE BODY */}
        <main className="flex-1 overflow-auto min-w-0">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
