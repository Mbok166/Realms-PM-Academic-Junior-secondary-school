import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Exeat, Dormitory, GradeLevel } from '../../types';
import {
  Building,
  Plus,
  Printer,
  CheckCircle,
  Clock,
  UserCheck,
  AlertCircle,
  Phone,
  ShieldCheck,
  X
} from 'lucide-react';

export const BoardingModule: React.FC = () => {
  const {
    dormitories,
    exeats,
    issueExeat,
    returnExeat,
    openPrintDoc,
    students
  } = useSchool();

  const [isExeatModalOpen, setIsExeatModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Returned'>('All');

  // New Exeat form
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students.find(s => s.boardingStatus === 'Boarder')?.id || students[0]?.id || ''
  );
  const [reason, setReason] = useState<Exeat['reason']>('Medical');
  const [departureDate, setDepartureDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [expectedReturnDate, setExpectedReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [guardianName, setGuardianName] = useState('David Mwangi');
  const [guardianPhone, setGuardianPhone] = useState('+254 733 112 456');
  const [approvedBy, setApprovedBy] = useState('Major Joseph Cheruiyot (Hostel Warden)');

  const boarderStudents = students.filter(s => s.boardingStatus === 'Boarder');

  const filteredExeats = exeats.filter(e => {
    if (filterStatus === 'Active') return e.status === 'Active';
    if (filterStatus === 'Returned') return e.status === 'Returned';
    return true;
  });

  const handleSelectStudent = (sId: string) => {
    setSelectedStudentId(sId);
    const std = students.find(s => s.id === sId);
    if (std) {
      setGuardianName(std.guardianName);
      setGuardianPhone(std.guardianPhone);
    }
  };

  const handleCreateExeat = (e: React.FormEvent) => {
    e.preventDefault();
    const std = students.find(s => s.id === selectedStudentId);
    if (!std) return;

    const dorm = dormitories.find(d => d.id === std.dormitoryId)?.name || 'Mount Kenya Hall';

    const newEx = issueExeat({
      studentId: std.id,
      studentName: `${std.firstName} ${std.lastName}`,
      admissionNo: std.admissionNo,
      dormitory: dorm,
      grade: std.grade,
      reason,
      departureDate,
      expectedReturnDate,
      guardianName,
      guardianPhone,
      approvedBy
    });

    setIsExeatModalOpen(false);

    // Launch printable exeat pass
    openPrintDoc({
      type: 'exeatPass',
      title: `Official Gate Pass - ${newEx.passNo}`,
      payload: { exeat: newEx, student: std }
    });
  };

  const handlePrintExeat = (ex: Exeat) => {
    const std = students.find(s => s.id === ex.studentId) || {
      firstName: ex.studentName.split(' ')[0],
      lastName: ex.studentName.split(' ')[1] || '',
      admissionNo: ex.admissionNo,
      grade: ex.grade,
      guardianName: ex.guardianName,
      guardianPhone: ex.guardianPhone,
      boardingStatus: 'Boarder'
    };

    openPrintDoc({
      type: 'exeatPass',
      title: `Official Gate Pass - ${ex.passNo}`,
      payload: { exeat: ex, student: std }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Boarding & Hostel Management</h1>
          <p className="text-xs text-slate-500">
            Dormitory bed allocation, roll-call audit, and official exeat gate pass security
          </p>
        </div>

        <button
          onClick={() => setIsExeatModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Exeat Gate Pass</span>
        </button>
      </div>

      {/* Dormitories Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dormitories.map(dorm => {
          const occupancyPct = Math.round((dorm.occupied / dorm.capacity) * 100);
          return (
            <div key={dorm.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{dorm.name}</h3>
                  <span className="text-[11px] text-slate-500">{dorm.wing} · {dorm.gender}</span>
                </div>
                <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                  <Building className="w-5 h-5" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500 font-medium">Bed Occupancy:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {dorm.occupied} / {dorm.capacity} ({occupancyPct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      occupancyPct > 90 ? 'bg-amber-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${occupancyPct}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-xs space-y-1 text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Warden:</span>
                  <span className="font-medium text-slate-800">{dorm.houseMaster}</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span>Emergency Phone:</span>
                  <span className="text-blue-700">{dorm.matronPhone}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Exeat Security Register */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Student Exeat & Gate Clearance Log
            </h2>
            <p className="text-[11px] text-slate-500">Official security clearance for boarding pupils leaving school premises</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-md px-2.5 py-1 focus:outline-none"
            >
              <option value="All">All Exeats</option>
              <option value="Active">Active Off-Campus</option>
              <option value="Returned">Returned & Cleared</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold text-[11px] bg-slate-50/50">
                <th className="py-2.5 px-4">Pass #</th>
                <th className="py-2.5 px-4">Pupil & Dormitory</th>
                <th className="py-2.5 px-3">Reason</th>
                <th className="py-2.5 px-3">Departure</th>
                <th className="py-2.5 px-3">Expected Return</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExeats.map(ex => (
                <tr key={ex.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{ex.passNo}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{ex.studentName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {ex.admissionNo} · {ex.dormitory}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">{ex.reason}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{ex.departureDate}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{ex.expectedReturnDate}</td>
                  <td className="py-3 px-3">
                    {ex.status === 'Active' ? (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Active Off-Campus
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Returned
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {ex.status === 'Active' && (
                        <button
                          onClick={() => returnExeat(ex.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded"
                        >
                          Check In
                        </button>
                      )}
                      <button
                        onClick={() => handlePrintExeat(ex)}
                        title="Print Gate Slip"
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Exeat Modal */}
      {isExeatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden text-xs">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold">Issue Student Exeat Gate Pass</h2>
                <p className="text-[11px] text-amber-300">Boarding & Campus Security Control</p>
              </div>
              <button
                onClick={() => setIsExeatModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExeat} className="p-5 space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Boarding Learner *</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => handleSelectStudent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none font-semibold text-slate-900"
                >
                  {boarderStudents.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.firstName} {b.lastName} ({b.admissionNo}) — {b.bedNo || 'Hostel'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reason for Departure *</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="Medical">Medical Checkup / Hospital</option>
                    <option value="Family Emergency">Family Emergency</option>
                    <option value="School Competition">School Competition / Tour</option>
                    <option value="Mid-Term Break">Official Mid-Term Break</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Departure Date *</label>
                  <input
                    type="date"
                    required
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expected Return Date *</label>
                  <input
                    type="date"
                    required
                    value={expectedReturnDate}
                    onChange={(e) => setExpectedReturnDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Approved By (Staff) *</label>
                  <input
                    type="text"
                    required
                    value={approvedBy}
                    onChange={(e) => setApprovedBy(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Authorized Guardian</label>
                  <input
                    type="text"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Guardian Phone (Gate Call)</label>
                  <input
                    type="tel"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsExeatModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-semibold shadow-xs"
                >
                  Authorize & Print Gate Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
