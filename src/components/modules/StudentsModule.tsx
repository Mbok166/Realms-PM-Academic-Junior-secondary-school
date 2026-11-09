import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Student, GradeLevel, Stream } from '../../types';
import { ASSET_PATHS } from '../../data/mockData';
import {
  Search,
  Plus,
  Filter,
  GraduationCap,
  CreditCard,
  Printer,
  X,
  CheckCircle,
  AlertTriangle,
  Building,
  HeartPulse,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Lock
} from 'lucide-react';

export const StudentsModule: React.FC = () => {
  const {
    students,
    addStudent,
    deleteStudent,
    openPrintDoc,
    reportCards,
    setActiveModule,
    canAccessFinances
  } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [selectedBoarding, setSelectedBoarding] = useState<string>('All');
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [activeProfileStudent, setActiveProfileStudent] = useState<Student | null>(null);

  // New Admission Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male' as 'Male' | 'Female',
    grade: 'Grade 7 (JSS)' as GradeLevel,
    stream: 'Alpha' as Stream,
    dob: '2012-04-15',
    guardianName: '',
    guardianPhone: '+254 ',
    guardianEmail: '',
    residence: '',
    boardingStatus: 'Day' as 'Day' | 'Boarder',
    dormitoryId: '',
    bedNo: '',
    bloodGroup: 'O+',
    allergies: '',
    totalBilled: 32000,
    upiNo: '',
    nemisStatus: 'Pending Validation' as Student['nemisStatus']
  });

  const gradesList: GradeLevel[] = [
    'PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4',
    'Grade 5', 'Grade 6', 'Grade 7 (JSS)', 'Grade 8 (JSS)', 'Grade 9 (JSS)'
  ];

  const filteredStudents = students.filter(student => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesQuery = fullName.includes(query) ||
      student.admissionNo.toLowerCase().includes(query) ||
      student.upiNo.toLowerCase().includes(query);

    const matchesGrade = selectedGrade === 'All' || student.grade === selectedGrade;
    const matchesBoarding = selectedBoarding === 'All' || student.boardingStatus === selectedBoarding;

    return matchesQuery && matchesGrade && matchesBoarding;
  });

  const handleOpenReportCard = (student: Student) => {
    const reportCard = reportCards[student.id] || {
      ...reportCards['std-101'],
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      admissionNo: student.admissionNo,
      grade: student.grade,
      stream: student.stream,
      upiNo: student.upiNo
    };

    openPrintDoc({
      type: 'reportCard',
      title: `Official CBC Assessment Report - ${student.firstName} ${student.lastName}`,
      payload: { student, reportCard }
    });
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.guardianPhone.trim()) {
      alert('Please fill in required fields: First Name, Last Name, and Guardian Phone.');
      return;
    }

    addStudent({
      ...formData,
      upiNo: formData.upiNo.trim() || `KICD-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100 + Math.random() * 900)}X`,
      photoUrl: formData.gender === 'Male' ? ASSET_PATHS.studentAvatar : undefined
    });

    setIsAdmissionModalOpen(false);
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      gender: 'Male',
      grade: 'Grade 7 (JSS)',
      stream: 'Alpha',
      dob: '2012-04-15',
      guardianName: '',
      guardianPhone: '+254 ',
      guardianEmail: '',
      residence: '',
      boardingStatus: 'Day',
      dormitoryId: '',
      bedNo: '',
      bloodGroup: 'O+',
      allergies: '',
      totalBilled: 32000,
      upiNo: '',
      nemisStatus: 'Pending Validation'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Learner Records & Admissions</h1>
          <p className="text-xs text-slate-500">
            Official enrollment registry, KICD CBC tracking, bio-data, and NEMIS identifiers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdmissionModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Admit New Learner</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by learner name, admission no, or UPI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Class:</span>
          </div>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="All">All Grades (PP1 - Grade 9)</option>
            {gradesList.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <select
            value={selectedBoarding}
            onChange={(e) => setSelectedBoarding(e.target.value)}
            className="text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="All">All Boarding Types</option>
            <option value="Day">Day Scholars</option>
            <option value="Boarder">Full Boarders</option>
          </select>
        </div>
      </div>

      {/* Learners Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Learner & Admission</th>
                <th className="py-3 px-3">Class & Stream</th>
                <th className="py-3 px-3">NEMIS / UPI</th>
                <th className="py-3 px-3">Residence / Type</th>
                {canAccessFinances && <th className="py-3 px-3">Fee Status</th>}
                <th className="py-3 px-3">Attendance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={canAccessFinances ? 7 : 6} className="py-12 text-center text-slate-500">
                    <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium">No learners found matching criteria</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search terms or admission filters.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Learner Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {std.photoUrl ? (
                          <img
                            src={std.photoUrl}
                            alt={std.firstName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                            {std.firstName[0]}{std.lastName[0]}
                          </div>
                        )}
                        <div>
                          <button
                            onClick={() => setActiveProfileStudent(std)}
                            className="font-bold text-slate-900 hover:text-blue-700 transition-colors text-left"
                          >
                            {std.firstName} {std.lastName}
                          </button>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {std.admissionNo} · {std.gender}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Class & Stream */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{std.grade}</div>
                      <div className="text-[11px] text-slate-500">Stream {std.stream}</div>
                    </td>

                    {/* UPI */}
                    <td className="py-3 px-3 font-mono text-[11px]">
                      <div className="text-slate-800 font-medium">{std.upiNo}</div>
                      <div className="text-[10px] text-slate-500">
                        {std.nemisStatus === 'Verified' ? (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> MoE Verified
                          </span>
                        ) : (
                          <span className="text-amber-700 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> {std.nemisStatus}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Residence / Boarding */}
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-700">
                        {std.boardingStatus === 'Boarder' ? (
                          <span className="text-blue-800 font-semibold">Boarder ({std.bedNo || 'Hostel'})</span>
                        ) : (
                          <span className="text-slate-600">Day Scholar</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[140px]">{std.residence}</div>
                    </td>

                    {/* Fee Status (Restricted to Principal & Bursar) */}
                    {canAccessFinances && (
                      <td className="py-3 px-3 font-mono">
                        {std.feeBalance === 0 ? (
                          <div>
                            <span className="text-emerald-700 font-bold">Cleared</span>
                            <div className="text-[10px] text-slate-400">KES {std.totalBilled.toLocaleString()}</div>
                          </div>
                        ) : (
                          <div>
                            <span className="text-rose-700 font-bold">KES {std.feeBalance.toLocaleString()}</span>
                            <div className="text-[10px] text-slate-400">Bal of {std.totalBilled.toLocaleString()}</div>
                          </div>
                        )}
                      </td>
                    )}

                    {/* Attendance */}
                    <td className="py-3 px-3 font-mono">
                      <span className="font-bold text-slate-800">{std.attendanceRate}%</span>
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            std.attendanceRate >= 95 ? 'bg-emerald-500' : std.attendanceRate >= 85 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${std.attendanceRate}%` }}
                        />
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenReportCard(std)}
                          title="Generate CBC Assessment Report"
                          className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-md transition-colors"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setActiveProfileStudent(std)}
                          className="px-2 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                        >
                          Profile
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admission Modal */}
      {isAdmissionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 my-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-base font-bold text-slate-900">Learner Admission Form</h2>
                <p className="text-xs text-slate-500">RealmsPM Academy Official Student Registry</p>
              </div>
              <button
                onClick={() => setIsAdmissionModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Personal Info */}
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-3">1. Pupil Bio-Data</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Victor"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Baraza"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Placement */}
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-3">2. Grade & NEMIS Placement</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Academic Grade *</label>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value as any })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                    >
                      {gradesList.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Stream</label>
                    <select
                      value={formData.stream}
                      onChange={(e) => setFormData({ ...formData, stream: e.target.value as any })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                    >
                      <option value="Alpha">Alpha</option>
                      <option value="Beta">Beta</option>
                      <option value="Emerald">Emerald</option>
                      <option value="Gold">Gold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">NEMIS UPI (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. KICD-9981-224M"
                      value={formData.upiNo}
                      onChange={(e) => setFormData({ ...formData, upiNo: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Boarding Type</label>
                    <select
                      value={formData.boardingStatus}
                      onChange={(e) => setFormData({ ...formData, boardingStatus: e.target.value as any })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                    >
                      <option value="Day">Day Scholar</option>
                      <option value="Boarder">Full Boarder</option>
                    </select>
                  </div>
                  {formData.boardingStatus === 'Boarder' && (
                    <>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Dormitory</label>
                        <select
                          value={formData.dormitoryId}
                          onChange={(e) => setFormData({ ...formData, dormitoryId: e.target.value })}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                        >
                          <option value="dorm-01">Mount Kenya Hall (Boys)</option>
                          <option value="dorm-02">Kilimanjaro House (Girls)</option>
                          <option value="dorm-03">Aberdare Wing (Boys)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Bed / Cubicle No</label>
                        <input
                          type="text"
                          placeholder="e.g. A-12"
                          value={formData.bedNo}
                          onChange={(e) => setFormData({ ...formData, bedNo: e.target.value })}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Guardian Info */}
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-3">3. Guardian / Parent Contact</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Guardian Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mary Wanjiku Baraza"
                      value={formData.guardianName}
                      onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Guardian Phone (SMS Alerts) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+254 712 345 678"
                      value={formData.guardianPhone}
                      onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Guardian Email</label>
                    <input
                      type="email"
                      placeholder="parent@domain.com"
                      value={formData.guardianEmail}
                      onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Residence / Estate</label>
                    <input
                      type="text"
                      placeholder="e.g. Karen, Miotoni Road"
                      value={formData.residence}
                      onChange={(e) => setFormData({ ...formData, residence: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Medical Profile (& Fee Setup if Authorized) */}
              <div>
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-3">
                  {canAccessFinances ? '4. Medical Profile & Fee Setup' : '4. Learner Medical Profile'}
                </h3>
                <div className={`grid grid-cols-1 ${canAccessFinances ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-3`}>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                    >
                      <option value="O+">O+</option>
                      <option value="A+">A+</option>
                      <option value="B+">B+</option>
                      <option value="AB+">AB+</option>
                      <option value="O-">O-</option>
                      <option value="A-">A-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Allergies / Special Medical Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Asthmatic, Penicillin allergy"
                      value={formData.allergies}
                      onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                  {canAccessFinances && (
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Term 1 Billed Fees (KES)</label>
                      <input
                        type="number"
                        value={formData.totalBilled}
                        onChange={(e) => setFormData({ ...formData, totalBilled: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAdmissionModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold shadow-xs"
                >
                  Confirm & Admit Learner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pupil Profile Details Drawer / Modal */}
      {activeProfileStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                {activeProfileStudent.photoUrl ? (
                  <img
                    src={activeProfileStudent.photoUrl}
                    alt={activeProfileStudent.firstName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-400"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-blue-600 text-white text-xl font-bold flex items-center justify-center">
                    {activeProfileStudent.firstName[0]}{activeProfileStudent.lastName[0]}
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-bold">
                    {activeProfileStudent.firstName} {activeProfileStudent.lastName}
                  </h2>
                  <p className="text-xs text-blue-200 font-mono">
                    {activeProfileStudent.admissionNo} · {activeProfileStudent.grade} ({activeProfileStudent.stream})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveProfileStudent(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-slate-400 font-medium block">NEMIS Unique Personal Identifier:</span>
                  <span className="font-mono font-bold text-slate-900">{activeProfileStudent.upiNo}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Enrollment Status:</span>
                  <span className="text-emerald-700 font-semibold">{activeProfileStudent.boardingStatus} Scholar</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Guardian Contact:</span>
                  <span className="font-bold text-slate-900">{activeProfileStudent.guardianName}</span>
                  <div className="text-slate-500 font-mono">{activeProfileStudent.guardianPhone}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Fee Balance:</span>
                  {canAccessFinances ? (
                    <span className={`font-mono font-bold ${activeProfileStudent.feeBalance === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      KES {activeProfileStudent.feeBalance.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic flex items-center gap-1 font-sans text-[11px] mt-0.5">
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span>Restricted (Principal & Bursar)</span>
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Medical Profile:</span>
                  <span className="text-slate-700">Blood Group {activeProfileStudent.bloodGroup}</span>
                  {activeProfileStudent.allergies && (
                    <div className="text-rose-600 font-medium">{activeProfileStudent.allergies}</div>
                  )}
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Attendance Record:</span>
                  <span className="font-bold font-mono text-slate-800">{activeProfileStudent.attendanceRate}% Present</span>
                </div>
              </div>

              {/* Action Buttons inside Drawer */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <button
                  onClick={() => {
                    handleOpenReportCard(activeProfileStudent);
                    setActiveProfileStudent(null);
                  }}
                  className="px-3.5 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-semibold inline-flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print CBC Report Card</span>
                </button>

                <button
                  onClick={() => {
                    deleteStudent(activeProfileStudent.id);
                    setActiveProfileStudent(null);
                  }}
                  className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg font-medium"
                >
                  Archive Learner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
