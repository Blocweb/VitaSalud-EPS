import { useState } from 'react';
import { Outlet } from 'react-router';
import { Toaster } from 'sonner@2.0.3';
import { VitaSaludHeader } from './VitaSaludHeader';
import { VitaSaludSidebar } from './VitaSaludSidebar';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <VitaSaludHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <VitaSaludSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-6 md:ml-64 mt-16 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Toaster position="top-right" richColors />
    </div>
  );
}
