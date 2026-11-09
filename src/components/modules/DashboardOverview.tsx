import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { ASSET_PATHS } from '../../data/mockData';
import {
  GraduationCap,
  CalendarCheck,
  Award,
  ArrowUpRight,
  Send,
  Building,
  HeartPulse,
  BookOpen,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const {
    setActiveModule,
    students,
    attendanceRecords,
    clinicVisits,
    exeats,
    messages,
    openPrintDoc,
    reportCards
  } = useSchool();

  const totalStudents = students.length;
  const boardersCount = students.filter(s => s.boardingStatus === 'Boarder').length;
  const dayScholarsCount = totalStudents - boardersCount;

  // Attendance for today
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceRecords.filter(r => r.date === today);
  const presentCount = todayAttendance.filter(r => r.status === 'Present').length;
  const attendanceRate = todayAttendance.length > 0
    ? Math.round((presentCount / todayAttendance.length) * 100)
    : 96;

  // Active exeats
  const activeExeats = exeats.filter(e => e.status === 'Active');

  const handlePrintSampleReport = () => {
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
    <div className="space-y-6">
      {/* Institutional Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs">
        <div className="h-44 md:h-52 w-full relative">
          <img
            src={ASSET_PATHS.campus}
            alt="RealmsPM Academy Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-white max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 tracking-wider uppercase mb-1">
              <span>Center of Holistic Excellence</span>
              <span aria-hidden="true">·</span>
              <span>KICD CBC Certified</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white text-balance">
              RealmsPM Academic & Junior Secondary School
            </h1>
            <p className="text-sm text-slate-200 mt-1 max-w-xl line-clamp-2">
              Comprehensive institutional management platform governing admissions, academic assessment rubrics, boarding logistics, student wellness, and national NEMIS data.
            </p>
          </div>
        </div>

        {/* Quick action strip */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span className="font-semibold text-slate-900">Current Session:</span>
            <span>Term 1, Academic Year 2026</span>
            <span aria-hidden="true">·</span>
            <span>Active Pupils: <strong className="text-slate-900 font-mono tabular-nums">{totalStudents}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModule('attendance')}
              className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Mark Register</span>
            </button>
            <button
              onClick={() => setActiveModule('boarding')}
              className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Building className="w-3.5 h-3.5 text-amber-600" />
              <span>Hostels & Exeats</span>
            </button>
            <button
              onClick={() => setActiveModule('timetables')}
              className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Schemes of Work</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Primary Operational Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Enrollment */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Learner Population
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {totalStudents}
            </span>
            <span className="text-xs text-slate-500">Enrolled Learners</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>{boardersCount} Boarders</span>
            <span>·</span>
            <span>{dayScholarsCount} Day Scholars</span>
          </div>
        </div>

        {/* Metric 2: Attendance Rate */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Daily Attendance Rate
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {attendanceRate}%
            </span>
            <span className="text-xs font-medium text-emerald-600">Target: ≥95%</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>{presentCount} present today</span>
            <span>·</span>
            <span className="text-rose-600">{todayAttendance.length - presentCount} absent/late</span>
          </div>
        </div>

        {/* Metric 3: Boarding & Hostels Occupancy */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Boarding Occupancy
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              88%
            </span>
            <span className="text-xs text-slate-500">155 / 176 Bed Capacity</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>{activeExeats.length} active exeats</span>
            <button
              onClick={() => setActiveModule('boarding')}
              className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-0.5 cursor-pointer"
            >
              <span>View Hostels</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Metric 4: Academic Quality */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              CBC Performance Index
            </span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              91.4%
            </span>
            <span className="text-xs text-purple-700 font-medium">At/Above Expectations</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Formative + Summative</span>
            <button
              onClick={handlePrintSampleReport}
              className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-0.5"
            >
              <span>View Report</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Campus Status, Activity & Quick Hubs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Key Module Panels */}
        <div className="lg:col-span-2 space-y-6">
          {/* Campus Activity Log: Class Attendance & Roll Call Register */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Today's Class Attendance & Roll Call Register</h2>
                <p className="text-xs text-slate-500">Live morning roll call summary across primary and junior secondary streams</p>
              </div>
              <button
                onClick={() => setActiveModule('attendance')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Full Register</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {[
                { grade: 'Grade 7 (JSS)', stream: 'Alpha', enrolled: 42, present: 41, rate: 98, tutor: 'James Kimani' },
                { grade: 'Grade 8 (JSS)', stream: 'Emerald', enrolled: 38, present: 37, rate: 97, tutor: 'Grace Achieng' },
                { grade: 'Grade 6', stream: 'Gold', enrolled: 35, present: 33, rate: 94, tutor: 'Peter Maina' },
                { grade: 'Grade 5', stream: 'Beta', enrolled: 40, present: 39, rate: 98, tutor: 'Lucy Njeri' },
              ].map((cls, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-blue-50 text-blue-700 shrink-0">
                      <CalendarCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">
                        {cls.grade} · Stream {cls.stream}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Class Tutor: {cls.tutor}</span>
                        <span aria-hidden="true">·</span>
                        <span>Roll call taken at 08:15 AM</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold font-mono tabular-nums text-emerald-700">
                      {cls.present}/{cls.enrolled} ({cls.rate}%)
                    </span>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Register Cleared
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Operations Grid */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-3">Daily Operations Shortcuts</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setActiveModule('students')}
                className="p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-colors text-left group"
              >
                <GraduationCap className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-105 transition-transform" />
                <div className="text-xs font-semibold text-slate-900">Admit Student</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Enrollment & UPI</div>
              </button>

              <button
                onClick={() => setActiveModule('cbc')}
                className="p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-colors text-left group"
              >
                <Award className="w-5 h-5 text-purple-600 mb-2 group-hover:scale-105 transition-transform" />
                <div className="text-xs font-semibold text-slate-900">CBC Assessment</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Formative Rubrics</div>
              </button>

              <button
                onClick={() => setActiveModule('timetables')}
                className="p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-colors text-left group"
              >
                <BookOpen className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-105 transition-transform" />
                <div className="text-xs font-semibold text-slate-900">Scheme Generator</div>
                <div className="text-[11px] text-slate-500 mt-0.5">KICD Lesson Matrix</div>
              </button>

              <button
                onClick={() => setActiveModule('boarding')}
                className="p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-colors text-left group"
              >
                <Building className="w-5 h-5 text-amber-600 mb-2 group-hover:scale-105 transition-transform" />
                <div className="text-xs font-semibold text-slate-900">Exeat Gate Pass</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Authorized departures</div>
              </button>

              <button
                onClick={() => setActiveModule('clinic')}
                className="p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-colors text-left group"
              >
                <HeartPulse className="w-5 h-5 text-rose-600 mb-2 group-hover:scale-105 transition-transform" />
                <div className="text-xs font-semibold text-slate-900">Clinic Log</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Infirmary visits</div>
              </button>

              <button
                onClick={() => setActiveModule('communication')}
                className="p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-colors text-left group"
              >
                <Send className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-105 transition-transform" />
                <div className="text-xs font-semibold text-slate-900">Broadcast SMS</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Parent notifications</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Headmaster Note & Boarding / Infirmary Snapshot */}
        <div className="space-y-6">
          {/* Headteacher Profile & Welcome */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3">
              <img
                src={ASSET_PATHS.principalAvatar}
                alt="Dr. Samuel Adebayo"
                className="w-12 h-12 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h3 className="text-xs font-bold text-slate-900">Dr. Samuel Adebayo, PhD</h3>
                <p className="text-[11px] text-slate-500">Principal & Academic Director</p>
                <span className="inline-block mt-0.5 text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                  TSC/492811
                </span>
              </div>
            </div>

            <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 italic border border-slate-100">
              "At RealmsPM, we nurture competent, visionary minds anchored in integrity, critical inquiry, and cultural pride. Welcome to a seamless term of academic achievement."
            </div>
          </div>

          {/* Boarding & Gate Security Status */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold text-slate-900">Boarding & Exeats Status</h3>
              </div>
              <button
                onClick={() => setActiveModule('boarding')}
                className="text-xs text-blue-600 hover:underline"
              >
                View
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Active Exeats Off Campus:</span>
                <span className="font-bold text-amber-700 font-mono">{activeExeats.length} students</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Hostel Bed Occupancy:</span>
                <span className="font-bold text-slate-800 font-mono">155 / 176 (88%)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Night Roll-Call Status:</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>All Cleared</span>
                </span>
              </div>
            </div>
          </div>

          {/* Clinic & Wellness Alert */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-600" />
                <h3 className="text-xs font-bold text-slate-900">Clinic & Health Status</h3>
              </div>
              <button
                onClick={() => setActiveModule('clinic')}
                className="text-xs text-blue-600 hover:underline"
              >
                Log
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Infirmary Visits (Today):</span>
                <span className="font-mono font-bold text-slate-900">{clinicVisits.length} cases</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Special Medical Watchlist:</span>
                <span className="font-mono font-bold text-rose-600">3 pupils (Asthma/Allergies)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Resident Nurse on Duty:</span>
                <span className="text-slate-700 font-medium">Sr. Beatrice (RN)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
