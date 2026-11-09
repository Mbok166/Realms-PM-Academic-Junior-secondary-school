import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { GradeLevel, Stream, AttendanceStatus, AttendanceRecord } from '../../types';
import {
  CalendarCheck,
  CheckCircle,
  XCircle,
  Clock,
  HelpCircle,
  CheckCheck,
  FileSpreadsheet,
  Calendar as CalendarIcon
} from 'lucide-react';

export const AttendanceModule: React.FC = () => {
  const { students, attendanceRecords, recordAttendance } = useSchool();

  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('Grade 7 (JSS)');
  const [selectedStream, setSelectedStream] = useState<Stream>('Alpha');
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  const gradesList: GradeLevel[] = [
    'PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4',
    'Grade 5', 'Grade 6', 'Grade 7 (JSS)', 'Grade 8 (JSS)', 'Grade 9 (JSS)'
  ];

  // Filter students for the active class & stream
  const classStudents = students.filter(
    s => s.grade === selectedGrade && s.stream === selectedStream
  );

  // Build current roster state
  const getStatusForStudent = (studentId: string): AttendanceStatus => {
    const existing = attendanceRecords.find(
      r => r.studentId === studentId && r.date === selectedDate
    );
    return existing ? existing.status : 'Present';
  };

  const getNotesForStudent = (studentId: string): string => {
    const existing = attendanceRecords.find(
      r => r.studentId === studentId && r.date === selectedDate
    );
    return existing?.notes || '';
  };

  // Local editing states
  const [localStatuses, setLocalStatuses] = useState<Record<string, AttendanceStatus>>({});
  const [localNotes, setLocalNotes] = useState<Record<string, string>>({});

  const getCurrentStatus = (studentId: string): AttendanceStatus => {
    return localStatuses[studentId] || getStatusForStudent(studentId);
  };

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    setLocalStatuses(prev => ({ ...prev, [studentId]: status }));
  };

  const setNote = (studentId: string, note: string) => {
    setLocalNotes(prev => ({ ...prev, [studentId]: note }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const updated: Record<string, AttendanceStatus> = {};
    classStudents.forEach(s => {
      updated[s.id] = status;
    });
    setLocalStatuses(prev => ({ ...prev, ...updated }));
  };

  const handleSaveRegister = () => {
    const newRecords: AttendanceRecord[] = classStudents.map(s => ({
      id: `att-${s.id}-${selectedDate}`,
      studentId: s.id,
      date: selectedDate,
      grade: selectedGrade,
      stream: selectedStream,
      status: getCurrentStatus(s.id),
      notes: localNotes[s.id] || getNotesForStudent(s.id) || undefined
    }));

    recordAttendance(newRecords);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  // Summary counts
  const totalInClass = classStudents.length;
  const presentCount = classStudents.filter(s => getCurrentStatus(s.id) === 'Present').length;
  const absentCount = classStudents.filter(s => getCurrentStatus(s.id) === 'Absent').length;
  const lateCount = classStudents.filter(s => getCurrentStatus(s.id) === 'Late').length;
  const excusedCount = classStudents.filter(s => getCurrentStatus(s.id) === 'Excused').length;
  const presentRate = totalInClass > 0 ? Math.round((presentCount / totalInClass) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Daily Attendance Management</h1>
          <p className="text-xs text-slate-500">
            Official class register, roll-call verification, and daily attendance logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccessNotice && (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              ✓ Register Saved Successfully
            </span>
          )}
          <button
            onClick={handleSaveRegister}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors"
          >
            Save Register
          </button>
        </div>
      </div>

      {/* Class Selector Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Class / Grade</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value as GradeLevel)}
              className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none"
            >
              {gradesList.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Stream</label>
            <select
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value as Stream)}
              className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none"
            >
              <option value="Alpha">Alpha</option>
              <option value="Beta">Beta</option>
              <option value="Emerald">Emerald</option>
              <option value="Gold">Gold</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Register Date</label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs font-medium text-slate-800 bg-transparent focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Quick Bulk Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleMarkAll('Present')}
            className="px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors inline-flex items-center gap-1.5"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All Present</span>
          </button>
          <button
            onClick={() => handleMarkAll('Absent')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Class Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total on Roll</span>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">{totalInClass}</div>
        </div>
        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Present</span>
          <div className="text-xl font-bold font-mono text-emerald-700 mt-1">{presentCount}</div>
        </div>
        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Absent</span>
          <div className="text-xl font-bold font-mono text-rose-700 mt-1">{absentCount}</div>
        </div>
        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Late</span>
          <div className="text-xl font-bold font-mono text-amber-700 mt-1">{lateCount}</div>
        </div>
        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Attendance %</span>
          <div className="text-xl font-bold font-mono text-blue-700 mt-1">{presentRate}%</div>
        </div>
      </div>

      {/* Class Roll Call Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Pupil & Admission No</th>
                <th className="py-3 px-3">Boarding Status</th>
                <th className="py-3 px-4">Attendance Status</th>
                <th className="py-3 px-4">Reason / Teacher Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {classStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <CalendarCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-800">No pupils registered in {selectedGrade} ({selectedStream})</p>
                    <p className="text-xs text-slate-400 mt-1">Select a different grade or admit learners into this stream.</p>
                  </td>
                </tr>
              ) : (
                classStudents.map((std, index) => {
                  const status = getCurrentStatus(std.id);
                  const note = localNotes[std.id] !== undefined ? localNotes[std.id] : getNotesForStudent(std.id);

                  return (
                    <tr key={std.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400">{index + 1}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{std.firstName} {std.lastName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{std.admissionNo} · {std.upiNo}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-700">{std.boardingStatus}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setStatus(std.id, 'Present')}
                            className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors flex items-center gap-1 ${
                              status === 'Present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Present</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setStatus(std.id, 'Absent')}
                            className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors flex items-center gap-1 ${
                              status === 'Absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Absent</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setStatus(std.id, 'Late')}
                            className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors flex items-center gap-1 ${
                              status === 'Late'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Late</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setStatus(std.id, 'Excused')}
                            className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors flex items-center gap-1 ${
                              status === 'Excused'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>Excused</span>
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          placeholder={status === 'Present' ? 'Optional remark...' : 'State reason (e.g. sick at home, clinic visit)'}
                          value={note}
                          onChange={(e) => setNote(std.id, e.target.value)}
                          className="w-full max-w-xs px-2.5 py-1 text-xs border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
