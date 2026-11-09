/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardOverview } from './components/modules/DashboardOverview';
import { StudentsModule } from './components/modules/StudentsModule';
import { AttendanceModule } from './components/modules/AttendanceModule';
import { FeesModule } from './components/modules/FeesModule';
import { CBCModule } from './components/modules/CBCModule';
import { TimetableSchemesModule } from './components/modules/TimetableSchemesModule';
import { CommunicationModule } from './components/modules/CommunicationModule';
import { BoardingModule } from './components/modules/BoardingModule';
import { ClinicModule } from './components/modules/ClinicModule';
import { StaffModule } from './components/modules/StaffModule';
import { NemisModule } from './components/modules/NemisModule';
import { PrintModal } from './components/common/PrintModal';
import { Menu } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeModule, isSidebarOpen, closeSidebar, toggleSidebar } = useSchool();

  // Close sidebar when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        closeSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen, closeSidebar]);

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'students':
        return <StudentsModule />;
      case 'attendance':
        return <AttendanceModule />;
      case 'fees':
        return <FeesModule />;
      case 'cbc':
        return <CBCModule />;
      case 'timetables':
        return <TimetableSchemesModule />;
      case 'communication':
        return <CommunicationModule />;
      case 'boarding':
        return <BoardingModule />;
      case 'clinic':
        return <ClinicModule />;
      case 'staff':
        return <StaffModule />;
      case 'nemis':
        return <NemisModule />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 relative">
      <Navbar />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Backdrop overlay when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 top-16 z-30 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={closeSidebar}
            aria-label="Close navigation overlay"
          />
        )}

        {/* Slide-out Sidebar Drawer - Auto-hides when any navigation item is clicked */}
        <aside
          className={`fixed inset-y-0 left-0 top-16 z-40 w-72 max-w-[85vw] transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
          }`}
          aria-label="Side navigation"
        >
          <Sidebar />
        </aside>

        {/* Main Content Area - Expands to full screen width so users can see pages unobstructed */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full transition-all duration-300">
          <div className="max-w-7xl mx-auto">
            {renderActiveModule()}
          </div>
        </main>

        {/* Quick floating Menu launcher for fast module access */}
        {!isSidebarOpen && (
          <button
            type="button"
            onClick={toggleSidebar}
            className="fixed bottom-6 left-6 z-20 flex items-center gap-2 px-3.5 py-2.5 bg-slate-900/90 hover:bg-slate-900 text-white rounded-full shadow-lg hover:shadow-xl border border-slate-700/80 transition-all duration-200 hover:scale-105 active:scale-95 group text-xs font-semibold backdrop-blur-md cursor-pointer"
            title="Open side navigation menu"
          >
            <Menu className="w-4 h-4 text-blue-400 group-hover:rotate-90 transition-transform duration-200" />
            <span>Modules Menu</span>
          </button>
        )}
      </div>
      <PrintModal />
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <AppContent />
    </SchoolProvider>
  );
}
