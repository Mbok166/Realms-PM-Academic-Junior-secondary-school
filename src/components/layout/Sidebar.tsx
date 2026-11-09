import React from 'react';
import { useSchool, ActiveModule } from '../../context/SchoolContext';
import {
  LayoutDashboard,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  Award,
  BookOpen,
  MessageSquare,
  Building,
  HeartPulse,
  Users,
  ShieldCheck,
  Building2,
  X,
  ChevronLeft,
  Lock
} from 'lucide-react';

interface NavItem {
  id: ActiveModule;
  label: string;
  subtext: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const {
    activeModule,
    setActiveModule,
    students,
    exeats,
    clinicVisits,
    closeSidebar,
    canAccessFinances
  } = useSchool();

  const activeExeatsCount = exeats.filter(e => e.status === 'Active').length;
  const pendingNemisCount = students.filter(s => s.nemisStatus !== 'Verified').length;
  const todayClinicCount = clinicVisits.length;

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Campus Overview',
      subtext: 'Analytics & executive health',
      icon: LayoutDashboard,
    },
    {
      id: 'students',
      label: 'Student Records',
      subtext: 'Admissions & bio-data',
      icon: GraduationCap,
      badge: students.length,
      badgeColor: 'text-slate-600 font-mono',
    },
    {
      id: 'attendance',
      label: 'Attendance Register',
      subtext: 'Daily roll call & rates',
      icon: CalendarCheck,
    },
    {
      id: 'fees',
      label: 'Fees & Finance',
      subtext: canAccessFinances ? 'Ledgers, M-Pesa & receipts' : 'Principal & Bursar only',
      icon: canAccessFinances ? CreditCard : Lock,
      badge: canAccessFinances ? undefined : 'Locked',
      badgeColor: 'text-amber-400 bg-amber-950/70 border border-amber-800/60 font-mono text-[10px]',
    },
    {
      id: 'cbc',
      label: 'CBC Assessments',
      subtext: 'KICD rubrics & report cards',
      icon: Award,
    },
    {
      id: 'timetables',
      label: 'Timetables & Schemes',
      subtext: 'Automated lesson matrices',
      icon: BookOpen,
    },
    {
      id: 'communication',
      label: 'Parent Communication',
      subtext: 'Bulk SMS & noticeboard',
      icon: MessageSquare,
    },
    {
      id: 'boarding',
      label: 'Boarding & Hostels',
      subtext: 'Dormitories & exeat passes',
      icon: Building,
      badge: activeExeatsCount > 0 ? `${activeExeatsCount} Out` : undefined,
      badgeColor: 'text-amber-700 font-medium',
    },
    {
      id: 'clinic',
      label: 'Clinic & Infirmary',
      subtext: 'Health logs & prescriptions',
      icon: HeartPulse,
      badge: todayClinicCount > 0 ? `${todayClinicCount} logs` : undefined,
      badgeColor: 'text-emerald-700 font-medium',
    },
    {
      id: 'staff',
      label: 'Staff Management',
      subtext: 'Teachers, TSC & workloads',
      icon: Users,
    },
    {
      id: 'nemis',
      label: 'NEMIS & UPI Sync',
      subtext: 'Ministry of Education portal',
      icon: ShieldCheck,
      badge: pendingNemisCount > 0 ? `${pendingNemisCount} pending` : undefined,
      badgeColor: 'text-blue-700 font-medium',
    },
  ];

  const handleNavClick = (id: ActiveModule) => {
    setActiveModule(id);
    closeSidebar();
  };

  return (
    <div className="w-full h-full bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 select-none shadow-2xl">
      <div className="flex flex-col py-3 overflow-y-auto min-h-0 flex-1">
        {/* Header with Title and Close Button */}
        <div className="px-4 pb-3 mb-2 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-200 block">
                Operations Suite
              </span>
              <span className="text-[10px] text-slate-400 block">
                Auto-hides on click to reveal page
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={closeSidebar}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-1 focus:ring-slate-500"
            title="Close navigation panel (Esc)"
            aria-label="Close navigation panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="space-y-0.5 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg transition-colors group cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-medium shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <div className="truncate">
                    <div className="text-xs font-medium leading-none truncate">
                      {item.label}
                    </div>
                    <div className={`text-[10px] mt-0.5 truncate ${
                      isActive ? 'text-blue-100' : 'text-slate-500'
                    }`}>
                      {item.subtext}
                    </div>
                  </div>
                </div>

                {item.badge !== undefined && (
                  <span className={`text-[11px] px-1.5 py-0.5 rounded text-right whitespace-nowrap tabular-nums ${
                    isActive ? 'bg-blue-700 text-white' : item.badgeColor || 'text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="p-3 mx-3 mb-3 rounded-lg bg-slate-950/70 border border-slate-800/80 shrink-0">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-medium text-slate-300">RealmsPM v4.2</span>
          <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            ACTIVE
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
          KICD Curriculum Compliant · CBC Level 1–9 Ready · NEMIS Integrated
        </p>
      </div>
    </div>
  );
};
