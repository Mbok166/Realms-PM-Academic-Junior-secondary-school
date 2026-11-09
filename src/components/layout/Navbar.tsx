import React from 'react';
import { useSchool, UserRole } from '../../context/SchoolContext';
import { ASSET_PATHS } from '../../data/mockData';
import { ChevronDown, Plus, Download, Printer, Menu, X, ShieldCheck, Lock } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeModule,
    setActiveModule,
    userRole,
    setUserRole,
    canAccessFinances,
    isStudentRole,
    currentStudentId,
    setCurrentStudentId,
    currentTerm,
    academicYear,
    openPrintDoc,
    reportCards,
    students,
    isSidebarOpen,
    toggleSidebar
  } = useSchool();

  const roles: UserRole[] = [
    'Principal / Admin',
    'Class Teacher',
    'Bursar',
    'School Nurse',
    'Hostel Warden',
    'Student / Learner'
  ];

  const moduleTitles: Record<string, string> = {
    dashboard: 'Campus Operations Overview',
    students: 'Learner Records & Admissions',
    attendance: 'Daily Attendance Registers',
    fees: 'Fee Ledgers & Financials',
    cbc: 'CBC / CBE Assessments & Report Cards',
    timetables: 'Timetables & Automated Schemes of Work',
    communication: 'Parent SMS & Noticeboard',
    boarding: 'Hostels & Exeat Gate Passes',
    clinic: 'Infirmary & Health Records',
    staff: 'Academic & Non-Teaching Staff',
    nemis: 'NEMIS & MoE UPI Integration'
  };

  const handleQuickReportCard = () => {
    const student = students[0];
    const reportCard = reportCards[student.id];
    if (student && reportCard) {
      openPrintDoc({
        type: 'reportCard',
        title: `Official CBC Assessment Report - ${student.firstName} ${student.lastName}`,
        payload: { student, reportCard }
      });
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 h-16 px-6 bg-white border-b border-slate-200">
      {/* Zone 1: Sidebar Toggle & Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={toggleSidebar}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer ${
            isSidebarOpen
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200/90 text-slate-700 border-slate-200'
          }`}
          aria-label={isSidebarOpen ? 'Hide navigation menu' : 'Open navigation menu'}
          title={isSidebarOpen ? 'Hide navigation menu' : 'Open navigation menu'}
        >
          {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4 text-blue-600" />}
          <span className="font-medium">{isSidebarOpen ? 'Close Menu' : 'Menu'}</span>
        </button>

        <div className="flex items-center gap-2.5">
          <img
            src={ASSET_PATHS.crest}
            alt="RealmsPM Crest"
            className="w-10 h-10 object-contain rounded-full shadow-xs border border-slate-200 bg-white"
          />
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
              RealmsPM
            </span>
            <span className="text-xs font-semibold text-blue-700 tracking-wider">
              ACADEMY & JUNIOR SCHOOL
            </span>
          </div>
        </div>
      </div>

      {/* Zone 2: Navigation Links / Breadcrumb Context */}
      <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-900">{moduleTitles[activeModule] || 'Dashboard'}</span>
          <span className="text-slate-300" aria-hidden="true">/</span>
          <span className="text-slate-600 font-mono tabular-nums">{currentTerm} · {academicYear}</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveModule('dashboard')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeModule === 'dashboard'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveModule('students')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeModule === 'students'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Learners
          </button>
          {canAccessFinances && (
            <button
              onClick={() => setActiveModule('fees')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeModule === 'fees'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Accounts
            </button>
          )}
          <button
            onClick={() => setActiveModule('cbc')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeModule === 'cbc'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            CBC Reports
          </button>
        </div>
      </div>

      {/* Zone 3: Role Switcher & Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Role context dropdown */}
        <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50">
          <span className="text-xs text-slate-500 hidden sm:inline">Role:</span>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            className="text-xs font-semibold text-slate-800 bg-transparent border-0 focus:outline-none cursor-pointer"
          >
            {roles.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          {isStudentRole ? (
            <span
              className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 hidden xl:inline-flex items-center gap-1"
              title="Student Portal: Read-only access to view and download results"
            >
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              <span>Student View</span>
            </span>
          ) : canAccessFinances ? (
            <span
              className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 hidden xl:inline-flex items-center gap-1"
              title="Finance Authorized: Full access to student fee balances, receipts, and cash ledgers"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Finance Auth</span>
            </span>
          ) : (
            <span
              className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 hidden xl:inline-flex items-center gap-1"
              title="Academic / Operations Role: Financial records restricted to Principal & Bursar"
            >
              <Lock className="w-2.5 h-2.5 text-slate-400" />
              <span>Academic Staff</span>
            </span>
          )}
        </div>

        {/* If student role, allow student profile selection */}
        {isStudentRole && (
          <div className="hidden sm:flex items-center gap-2 border border-blue-200 rounded-lg px-2.5 py-1.5 bg-blue-50/50">
            <span className="text-xs text-blue-800 font-semibold">Learner:</span>
            <select
              value={currentStudentId}
              onChange={(e) => setCurrentStudentId(e.target.value)}
              className="text-xs font-bold text-blue-900 bg-transparent border-0 focus:outline-none cursor-pointer"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} ({s.grade})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Quick Report preview button */}
        <button
          onClick={handleQuickReportCard}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
          title="Print Sample CBC Report Card"
        >
          <Printer className="w-3.5 h-3.5 text-slate-500" />
          <span>Print Report</span>
        </button>

        {/* Primary CTA button */}
        {isStudentRole ? (
          <button
            onClick={() => setActiveModule('cbc')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>View & Download My Results</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveModule('students')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Admit Learner</span>
          </button>
        )}
      </div>
    </header>
  );
};
