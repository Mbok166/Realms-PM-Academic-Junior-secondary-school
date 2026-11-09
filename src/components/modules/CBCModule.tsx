import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Student, PerformanceLevel, StudentReportCard, CBCSubjectAssessment } from '../../types';
import { PERFORMANCE_LEVELS, ASSET_PATHS } from '../../data/mockData';
import {
  Award,
  Printer,
  Edit3,
  CheckCircle2,
  BookOpen,
  Sparkles,
  User,
  GraduationCap,
  UploadCloud,
  Plus,
  X,
  ShieldCheck
} from 'lucide-react';

export const CBCModule: React.FC = () => {
  const { students, reportCards, updateReportCard, openPrintDoc, isStudentRole, currentStudentId } = useSchool();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(() =>
    isStudentRole ? currentStudentId : (students[0]?.id || 'std-101')
  );

  // Keep selected student synced if role is student
  React.useEffect(() => {
    if (isStudentRole && currentStudentId) {
      setSelectedStudentId(currentStudentId);
    }
  }, [isStudentRole, currentStudentId]);

  const activeStudent = students.find(s => s.id === selectedStudentId) || students[0];

  // Upload Result Modal state (for teachers)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadSubject, setUploadSubject] = useState('Computer Science & Coding');
  const [uploadStrand, setUploadStrand] = useState('Digital Technology');
  const [uploadSubStrand, setUploadSubStrand] = useState('Algorithmic Thinking');
  const [uploadRating, setUploadRating] = useState<PerformanceLevel>('EE');
  const [uploadScore, setUploadScore] = useState(85);
  const [uploadRemarks, setUploadRemarks] = useState('Outstanding grasp of computational logic.');

  // Active student report card (fallback to standard template if not initialized)
  const reportCard: StudentReportCard = reportCards[selectedStudentId] || {
    id: `rep-${activeStudent.id}`,
    studentId: activeStudent.id,
    studentName: `${activeStudent.firstName} ${activeStudent.lastName}`,
    admissionNo: activeStudent.admissionNo,
    upiNo: activeStudent.upiNo,
    grade: activeStudent.grade,
    stream: activeStudent.stream,
    term: 'Term 1',
    academicYear: '2026',
    assessments: [
      { subject: 'Integrated Science', strand: 'Scientific Inquiry', subStrand: 'Laboratory Safety', rating: 'EE', score: 85, teacherRemarks: 'Sound practical grasp of lab tools.' },
      { subject: 'Mathematics', strand: 'Numbers', subStrand: 'Prime Factorization', rating: 'ME', score: 76, teacherRemarks: 'Consistent problem decomposition.' },
      { subject: 'English Language', strand: 'Oral Skills', subStrand: 'Listening & Speaking', rating: 'EE', score: 82, teacherRemarks: 'Articulate public debate skills.' },
      { subject: 'Kiswahili', strand: 'Kusoma na Kuandika', subStrand: 'Insha na Sarufi', rating: 'ME', score: 72, teacherRemarks: 'Maendeleo ya kuridhisha.' },
      { subject: 'Social Studies', strand: 'Natural Environment', subStrand: 'Weather & Climate', rating: 'EE', score: 80, teacherRemarks: 'Active participation in group research.' },
      { subject: 'Agriculture & Nutrition', strand: 'Crop Production', subStrand: 'Kitchen Gardens', rating: 'ME', score: 74, teacherRemarks: 'Diligent garden maintenance.' },
      { subject: 'Creative Arts & Sports', strand: 'Visual Arts', subStrand: 'Drawing & Painting', rating: 'EE', score: 86, teacherRemarks: 'Impressive aesthetic expression.' }
    ],
    coreCompetencies: [
      { competency: 'Communication and Collaboration', rating: 'EE', evidence: 'Engages fruitfully in classroom discussions and teams.' },
      { competency: 'Critical Thinking and Problem Solving', rating: 'ME', evidence: 'Formulates logical approaches to math problems.' },
      { competency: 'Imagination and Creativity', rating: 'EE', evidence: 'Expresses unique concepts in projects and art.' },
      { competency: 'Digital Literacy', rating: 'ME', evidence: 'Proficient in basic spreadsheet and typing exercises.' },
      { competency: 'Self-Efficacy & Leadership', rating: 'EE', evidence: 'Demonstrates exemplary responsibility.' }
    ],
    valuesDemonstrated: [
      { value: 'Integrity', rating: 'EE' },
      { value: 'Respect', rating: 'EE' },
      { value: 'Responsibility', rating: 'EE' },
      { value: 'Peace', rating: 'ME' }
    ],
    classTeacherRemarks: `${activeStudent.firstName} is an enthusiastic and diligent learner who exhibits strong moral integrity and academic commitment.`,
    headTeacherRemarks: 'Commendable effort and dedication. Keep maintaining this standard of excellence!',
    openingDateNextTerm: 'May 4, 2026',
    daysPresent: 60,
    totalDays: 63,
    coCurricularActivities: ['Junior Robotics Club', 'Debating Society']
  };

  const handleUpdateRating = (subjectIndex: number, newRating: PerformanceLevel) => {
    if (isStudentRole) return;
    const updatedAssessments = [...reportCard.assessments];
    updatedAssessments[subjectIndex] = {
      ...updatedAssessments[subjectIndex],
      rating: newRating,
      score: newRating === 'EE' ? 88 : newRating === 'ME' ? 74 : newRating === 'AE' ? 58 : 42
    };
    updateReportCard(selectedStudentId, { assessments: updatedAssessments });
  };

  const handleUpdateRemarks = (field: 'classTeacherRemarks' | 'headTeacherRemarks', text: string) => {
    if (isStudentRole) return;
    updateReportCard(selectedStudentId, { [field]: text });
  };

  const handleUploadResultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStudentRole) return;

    const newAssessment: CBCSubjectAssessment = {
      subject: uploadSubject,
      strand: uploadStrand,
      subStrand: uploadSubStrand,
      rating: uploadRating,
      score: uploadScore,
      teacherRemarks: uploadRemarks
    };

    const updatedAssessments = [newAssessment, ...reportCard.assessments];
    updateReportCard(selectedStudentId, { assessments: updatedAssessments });
    setIsUploadModalOpen(false);
  };

  const handlePrintReport = () => {
    openPrintDoc({
      type: 'reportCard',
      title: `Official CBC Assessment Report - ${activeStudent.firstName} ${activeStudent.lastName}`,
      payload: { student: activeStudent, reportCard }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              CBC / CBE Assessments & Report Cards
            </h1>
            {isStudentRole && (
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                <span>Student Portal (Read-Only)</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            {isStudentRole
              ? 'View your official term assessments and download your report card'
              : 'KICD-aligned competency assessments, formative rubrics, teacher uploads, and official learner report cards'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isStudentRole && (
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <UploadCloud className="w-4 h-4 text-blue-600" />
              <span>Upload Subject Result</span>
            </button>
          )}

          <button
            onClick={handlePrintReport}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Download Official Report Card</span>
          </button>
        </div>
      </div>

      {/* Student Portal Notice Banner */}
      {isStudentRole && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3 text-xs text-blue-900">
          <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="font-bold text-blue-950 text-sm">Welcome to Your Student Academic Portal</h2>
            <p className="leading-relaxed text-blue-900">
              As a student, you have secure read-only access to view your formative assessment rubrics, subject scores, teacher feedback, and attendance. You can download or print your official report card at any time using the button above.
            </p>
          </div>
        </div>
      )}

      {/* 4-Tier CBC Level Key Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {PERFORMANCE_LEVELS.map(lvl => (
          <div key={lvl.code} className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                lvl.code === 'EE' ? 'bg-emerald-100 text-emerald-800' :
                lvl.code === 'ME' ? 'bg-blue-100 text-blue-800' :
                lvl.code === 'AE' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
              }`}>
                Level {lvl.code === 'EE' ? '4' : lvl.code === 'ME' ? '3' : lvl.code === 'AE' ? '2' : '1'} ({lvl.code})
              </span>
              <span className="font-mono text-xs text-slate-500">{lvl.scoreRange}</span>
            </div>
            <div className="text-xs font-semibold text-slate-900 mt-2">{lvl.label}</div>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {lvl.description}
            </p>
          </div>
        ))}
      </div>

      {/* Learner Selector Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isStudentRole ? 'Your Student Profile' : 'Active Learner Assessment'}
            </label>
            {isStudentRole ? (
              <div className="text-sm font-bold text-slate-900">
                {activeStudent.firstName} {activeStudent.lastName} — {activeStudent.grade} ({activeStudent.admissionNo})
              </div>
            ) : (
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="text-sm font-bold text-slate-900 bg-transparent border-0 focus:outline-none cursor-pointer"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} — {s.grade} ({s.admissionNo})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span className="font-mono">UPI: <strong className="text-slate-900">{activeStudent.upiNo}</strong></span>
          <span aria-hidden="true">·</span>
          <span>Term 1, 2026</span>
          <span aria-hidden="true">·</span>
          <span>Attendance: <strong className="text-emerald-700 font-mono">{reportCard.daysPresent}/{reportCard.totalDays} Days</strong></span>
        </div>
      </div>

      {/* Main Grid: Subject Assessment Rubrics & Remarks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Learning Areas Matrix */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Learning Areas & Formative Assessment Rubrics
            </h2>
            <span className="text-[11px] text-slate-500">
              {isStudentRole ? 'Official Evaluated Grades' : 'Click level to adjust rating'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold text-[11px] bg-slate-50/50">
                  <th className="py-2.5 px-4">Learning Area / Subject</th>
                  <th className="py-2.5 px-3">Strand & Sub-Strand</th>
                  <th className="py-2.5 px-3">Performance Level</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-4">Teacher Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportCard.assessments.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">{item.subject}</td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-700">{item.strand}</div>
                      <div className="text-[10px] text-slate-400">{item.subStrand}</div>
                    </td>
                    <td className="py-3 px-3">
                      {isStudentRole ? (
                        <span className={`px-2 py-1 text-[11px] font-bold rounded ${
                          item.rating === 'EE' ? 'bg-emerald-100 text-emerald-800' :
                          item.rating === 'ME' ? 'bg-blue-100 text-blue-800' :
                          item.rating === 'AE' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {item.rating} - {item.rating === 'EE' ? 'Exceeding' : item.rating === 'ME' ? 'Meeting' : item.rating === 'AE' ? 'Approaching' : 'Below'}
                        </span>
                      ) : (
                        <div className="flex items-center gap-1">
                          {(['EE', 'ME', 'AE', 'BE'] as PerformanceLevel[]).map(lvl => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => handleUpdateRating(idx, lvl)}
                              className={`px-1.5 py-0.5 text-[10px] font-bold rounded transition-colors cursor-pointer ${
                                item.rating === lvl
                                  ? lvl === 'EE' ? 'bg-emerald-600 text-white' :
                                    lvl === 'ME' ? 'bg-blue-600 text-white' :
                                    lvl === 'AE' ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white'
                                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">{item.score}%</td>
                    <td className="py-3 px-4 text-slate-600 text-[11px] italic max-w-xs">{item.teacherRemarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Core Values, Competencies & Teacher Remarks */}
        <div className="space-y-4">
          {/* Core Values */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              National CBC Core Values Demonstrated
            </h3>
            <div className="space-y-1.5 text-xs">
              {reportCard.valuesDemonstrated.map(v => (
                <div key={v.value} className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="font-medium text-slate-700">{v.value}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    v.rating === 'EE' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {v.rating}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher Remarks */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Summative Teacher Remarks
            </h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Class Teacher Remarks</label>
              {isStudentRole ? (
                <div className="p-2.5 bg-slate-50 rounded-lg text-slate-800 border border-slate-200 italic leading-relaxed">
                  "{reportCard.classTeacherRemarks}"
                </div>
              ) : (
                <textarea
                  rows={2}
                  value={reportCard.classTeacherRemarks}
                  onChange={(e) => handleUpdateRemarks('classTeacherRemarks', e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-800 bg-slate-50 focus:bg-white focus:outline-none"
                />
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Headteacher Remarks</label>
              {isStudentRole ? (
                <div className="p-2.5 bg-slate-50 rounded-lg text-slate-800 border border-slate-200 italic leading-relaxed">
                  "{reportCard.headTeacherRemarks}"
                </div>
              ) : (
                <textarea
                  rows={2}
                  value={reportCard.headTeacherRemarks}
                  onChange={(e) => handleUpdateRemarks('headTeacherRemarks', e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-800 bg-slate-50 focus:bg-white focus:outline-none"
                />
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={handlePrintReport}
                className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Download Official Report Card</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Result Modal (For Teachers) */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm">Upload & Publish Subject Result</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadResultSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Learner / Student</label>
                <div className="p-2 bg-slate-100 rounded-lg font-bold text-slate-900">
                  {activeStudent.firstName} {activeStudent.lastName} ({activeStudent.grade} - {activeStudent.admissionNo})
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Learning Area / Subject *</label>
                  <input
                    type="text"
                    required
                    value={uploadSubject}
                    onChange={(e) => setUploadSubject(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                    placeholder="e.g. Computer Science"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Strand *</label>
                  <input
                    type="text"
                    required
                    value={uploadStrand}
                    onChange={(e) => setUploadStrand(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                    placeholder="e.g. Digital Technology"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sub-Strand</label>
                  <input
                    type="text"
                    value={uploadSubStrand}
                    onChange={(e) => setUploadSubStrand(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Performance Level</label>
                  <select
                    value={uploadRating}
                    onChange={(e) => {
                      const r = e.target.value as PerformanceLevel;
                      setUploadRating(r);
                      setUploadScore(r === 'EE' ? 88 : r === 'ME' ? 74 : r === 'AE' ? 58 : 42);
                    }}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none font-bold"
                  >
                    <option value="EE">EE (Exceeding)</option>
                    <option value="ME">ME (Meeting)</option>
                    <option value="AE">AE (Approaching)</option>
                    <option value="BE">BE (Below)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Score (%)</label>
                  <input
                    type="number"
                    value={uploadScore}
                    onChange={(e) => setUploadScore(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Teacher Assessment Remarks</label>
                <textarea
                  rows={3}
                  value={uploadRemarks}
                  onChange={(e) => setUploadRemarks(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                >
                  Upload & Publish Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
