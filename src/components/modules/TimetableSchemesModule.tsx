import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { GradeLevel, SchemeOfWorkItem } from '../../types';
import {
  BookOpen,
  Calendar,
  Plus,
  Printer,
  Sparkles,
  Search,
  CheckCircle,
  FileText,
  Clock,
  Layers
} from 'lucide-react';

export const TimetableSchemesModule: React.FC = () => {
  const { schemes, addScheme, timetables, addTimetableSlot, deleteTimetableSlot, openPrintDoc, currentTerm } = useSchool();

  const [activeTab, setActiveTab] = useState<'schemes' | 'timetable'>('schemes');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('Grade 7 (JSS)');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);
  const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false);

  // Master timetable generator state
  const [ttGrade, setTtGrade] = useState<GradeLevel>('Grade 7 (JSS)');
  const [ttStream, setTtStream] = useState<'Alpha' | 'Beta' | 'Emerald' | 'Gold'>('Alpha');
  const [ttDay, setTtDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  const [ttPeriod, setTtPeriod] = useState<number>(1);
  const [ttTime, setTtTime] = useState('08:00 - 08:45');
  const [ttSubject, setTtSubject] = useState('Mathematics');
  const [ttTeacher, setTtTeacher] = useState('J. Muriithi');
  const [ttRoom, setTtRoom] = useState('Room 7A');

  const handleCreateTimetableSlot = (e: React.FormEvent) => {
    e.preventDefault();
    addTimetableSlot({
      grade: ttGrade,
      stream: ttStream,
      day: ttDay,
      period: ttPeriod,
      time: ttTime,
      subject: ttSubject,
      teacherName: ttTeacher,
      room: ttRoom
    });
    setIsTimetableModalOpen(false);
  };

  // Scheme of work generator state
  const [genSubject, setGenSubject] = useState('Integrated Science');
  const [genGrade, setGenGrade] = useState<GradeLevel>('Grade 7 (JSS)');
  const [genWeek, setGenWeek] = useState<number>(3);
  const [genLesson, setGenLesson] = useState<number>(1);
  const [genStrand, setGenStrand] = useState('Living Things and Their Environment');
  const [genSubStrand, setGenSubStrand] = useState('Micro-organisms & Disease Transmission');
  const [genOutcomes, setGenOutcomes] = useState('By the end of the lesson, the learner should be able to: classify common microbes (bacteria, fungi, viruses); observe bread mold under optical microscope; describe hygiene practices to prevent bacterial propagation.');
  const [genInquiry, setGenInquiry] = useState('How do invisible microscopic organisms influence our daily health and food preservation?');
  const [genExperiences, setGenExperiences] = useState('Learners in groups examine bread mold using hand lenses and prepare simple wet mount slides for light microscopy; debate airborne vs waterborne vector modes.');
  const [genResources, setGenResources] = useState('Light microscopes, prepared slides, dropper, bread mold specimens, KICD Science Learner Guide Pg 45-52.');
  const [genAssessment, setGenAssessment] = useState('Microscopy technique checklist, group debrief question rubrics, drawing evaluation.');
  const [genReflection, setGenReflection] = useState('Practical slide preparation completed successfully. Learners showed high engagement during microscopic observation.');

  const gradesList: GradeLevel[] = [
    'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
    'Grade 7 (JSS)', 'Grade 8 (JSS)', 'Grade 9 (JSS)'
  ];

  const subjectsList = [
    'All',
    'Integrated Science',
    'Mathematics',
    'English',
    'Kiswahili',
    'Social Studies',
    'Agriculture & Nutrition',
    'Creative Arts & Sports',
    'Pre-Technical Studies',
    'Computer Science'
  ];

  const filteredSchemes = schemes.filter(s => {
    const matchGrade = s.grade === selectedGrade;
    const matchSubject = selectedSubject === 'All' || s.subject === selectedSubject;
    return matchGrade && matchSubject;
  });

  const handleCreateScheme = (e: React.FormEvent) => {
    e.preventDefault();
    addScheme({
      grade: genGrade,
      subject: genSubject,
      term: currentTerm,
      week: genWeek,
      lesson: genLesson,
      strand: genStrand,
      subStrand: genSubStrand,
      specificLearningOutcomes: genOutcomes,
      keyInquiryQuestions: genInquiry,
      learningExperiences: genExperiences,
      learningResources: genResources,
      assessmentMethods: genAssessment,
      reflection: genReflection
    });
    setIsGeneratorModalOpen(false);
  };

  const handlePrintScheme = (scheme: SchemeOfWorkItem) => {
    openPrintDoc({
      type: 'schemeOfWork',
      title: `KICD Scheme of Work - ${scheme.subject} (${scheme.grade})`,
      payload: { scheme }
    });
  };

  // Preset curriculum autofill helper
  const handleAutoFillSubject = (subject: string) => {
    setGenSubject(subject);
    if (subject === 'Mathematics') {
      setGenStrand('Algebraic Expressions');
      setGenSubStrand('Linear Equations in One Unknown');
      setGenOutcomes('Formulate linear equations from practical shopping scenarios; solve equations using the balance method.');
      setGenInquiry('How can balance principles in market scales help us solve unknown quantities?');
      setGenExperiences('Learners manipulate virtual beam balance models; formulate equations for pocket money and school supplies.');
      setGenResources('Balance scale, counters, Mathematics Grade 7 Coursebook pg 89-94.');
      setGenAssessment('Step-by-step written algebraic proof, peer evaluation.');
    } else if (subject === 'English') {
      setGenStrand('Reading for Comprehension');
      setGenSubStrand('Inferential & Critical Reading');
      setGenOutcomes('Identify main thematic ideas in an excerpt on environmental conservation; deduce meanings of idiomatic expressions.');
      setGenInquiry('How does reading critically empower young citizens to protect local ecosystems?');
      setGenExperiences('Silent timed reading followed by jigsaw group discussion analyzing character motivations and vocabulary context.');
      setGenResources('English Anthology, environmental case story, vocabulary flashcards.');
      setGenAssessment('Short-answer comprehension questions, oral vocabulary defense.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Timetables & Automated Schemes of Work
          </h1>
          <p className="text-xs text-slate-500">
            KICD-aligned pedagogical schemes, lesson plans, and weekly master class timetables
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('schemes')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'schemes'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Schemes of Work
          </button>
          <button
            onClick={() => setActiveTab('timetable')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'timetable'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Master Timetable
          </button>
        </div>
      </div>

      {activeTab === 'schemes' ? (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Class / Grade
                </label>
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
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Subject / Area
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none"
                >
                  {subjectsList.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => setIsGeneratorModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Scheme of Work</span>
            </button>
          </div>

          {/* Schemes List */}
          <div className="space-y-4">
            {filteredSchemes.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-xs">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="font-bold text-slate-800 text-sm">No schemes of work generated for this selection</h3>
                <p className="text-xs text-slate-500 mt-1">Click the button above to generate a new KICD-compliant lesson scheme.</p>
              </div>
            ) : (
              filteredSchemes.map((scheme) => (
                <div key={scheme.id} className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                          Week {scheme.week} · Lesson {scheme.lesson}
                        </span>
                        <span className="text-slate-300" aria-hidden="true">·</span>
                        <span className="text-xs font-bold text-slate-900">{scheme.subject}</span>
                        <span className="text-slate-300" aria-hidden="true">·</span>
                        <span className="text-xs text-slate-500">{scheme.grade}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">
                        Strand: {scheme.strand} &rarr; {scheme.subStrand}
                      </h3>
                    </div>

                    <button
                      onClick={() => handlePrintScheme(scheme)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg inline-flex items-center gap-1.5 shrink-0"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500" />
                      <span>Print KICD Scheme Sheet</span>
                    </button>
                  </div>

                  {/* Scheme Grid Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        1. Specific Learning Outcomes
                      </span>
                      <p className="text-slate-700 leading-relaxed">{scheme.specificLearningOutcomes}</p>
                    </div>

                    <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        2. Key Inquiry Questions
                      </span>
                      <p className="text-slate-700 italic leading-relaxed">{scheme.keyInquiryQuestions}</p>
                    </div>

                    <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        3. Learning Experiences & Activities
                      </span>
                      <p className="text-slate-700 leading-relaxed">{scheme.learningExperiences}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Learning Resources:
                      </span>
                      <p className="text-slate-600 mt-0.5">{scheme.learningResources}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Assessment Method:
                      </span>
                      <p className="text-slate-600 mt-0.5">{scheme.assessmentMethods}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Teacher Reflection:
                      </span>
                      <p className="text-emerald-700 font-medium mt-0.5">{scheme.reflection}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Timetable Tab */
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Weekly Master Timetable Generator & Schedule
              </h2>
              <p className="text-xs text-slate-500">
                Configure instructional periods, allocate teachers, and manage class master timetables
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTimetableModalOpen(true)}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg inline-flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Generate Master Timetable Slot</span>
              </button>
              <button
                onClick={() => openPrintDoc({ type: 'schemeOfWork', title: 'Master Timetable Schedule', payload: { timetables } })}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 inline-flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Schedule</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                  <th className="py-2.5 px-3">Period</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Monday</th>
                  <th className="py-2.5 px-3">Tuesday</th>
                  <th className="py-2.5 px-3">Wednesday</th>
                  <th className="py-2.5 px-3">Thursday</th>
                  <th className="py-2.5 px-3">Friday</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-3 font-mono font-bold text-slate-700">P1</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">08:00 - 08:45</td>
                  <td className="py-3 px-3 font-bold text-blue-900 bg-blue-50/40 rounded">
                    Mathematics <span className="block text-[10px] font-normal text-slate-500">J. Muriithi (7A)</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-900 bg-emerald-50/40 rounded">
                    English <span className="block text-[10px] font-normal text-slate-500">E. Omondi (7A)</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-purple-900 bg-purple-50/40 rounded">
                    Integrated Sci <span className="block text-[10px] font-normal text-slate-500">Lab 1</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-blue-900 bg-blue-50/40 rounded">
                    Mathematics <span className="block text-[10px] font-normal text-slate-500">J. Muriithi</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-amber-900 bg-amber-50/40 rounded">
                    Social Studies <span className="block text-[10px] font-normal text-slate-500">H. Mutua</span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-3 font-mono font-bold text-slate-700">P2</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">08:45 - 09:30</td>
                  <td className="py-3 px-3 font-bold text-purple-900 bg-purple-50/40 rounded">
                    Integrated Sci <span className="block text-[10px] font-normal text-slate-500">Lab 1</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-blue-900 bg-blue-50/40 rounded">
                    Mathematics <span className="block text-[10px] font-normal text-slate-500">J. Muriithi</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-900 bg-emerald-50/40 rounded">
                    English <span className="block text-[10px] font-normal text-slate-500">E. Omondi</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-indigo-900 bg-indigo-50/40 rounded">
                    Pre-Technical <span className="block text-[10px] font-normal text-slate-500">Workshop B</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-teal-900 bg-teal-50/40 rounded">
                    Kiswahili <span className="block text-[10px] font-normal text-slate-500">Mwl. Juma</span>
                  </td>
                </tr>

                <tr className="bg-slate-100/60 font-semibold text-slate-500 text-[11px] text-center">
                  <td colSpan={7} className="py-1 tracking-wider uppercase">Morning Break & Snack (09:30 - 09:50)</td>
                </tr>

                <tr>
                  <td className="py-3 px-3 font-mono font-bold text-slate-700">P3</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">09:50 - 10:35</td>
                  <td className="py-3 px-3 font-bold text-emerald-900 bg-emerald-50/40 rounded">
                    English <span className="block text-[10px] font-normal text-slate-500">E. Omondi</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-purple-900 bg-purple-50/40 rounded">
                    Integrated Sci <span className="block text-[10px] font-normal text-slate-500">Lab 1</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-teal-900 bg-teal-50/40 rounded">
                    Kiswahili <span className="block text-[10px] font-normal text-slate-500">Mwl. Juma</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-900 bg-emerald-50/40 rounded">
                    English <span className="block text-[10px] font-normal text-slate-500">E. Omondi</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-rose-900 bg-rose-50/40 rounded">
                    Creative Arts <span className="block text-[10px] font-normal text-slate-500">Art Studio</span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-3 font-mono font-bold text-slate-700">P4</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">10:35 - 11:20</td>
                  <td className="py-3 px-3 font-bold text-teal-900 bg-teal-50/40 rounded">
                    Kiswahili <span className="block text-[10px] font-normal text-slate-500">Mwl. Juma</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-cyan-900 bg-cyan-50/40 rounded">
                    Computer Sci <span className="block text-[10px] font-normal text-slate-500">ICT Hub</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-amber-900 bg-amber-50/40 rounded">
                    Agriculture <span className="block text-[10px] font-normal text-slate-500">Farm Plot</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-purple-900 bg-purple-50/40 rounded">
                    Integrated Sci <span className="block text-[10px] font-normal text-slate-500">Lab 1</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-blue-900 bg-blue-50/40 rounded">
                    Mathematics <span className="block text-[10px] font-normal text-slate-500">J. Muriithi</span>
                  </td>
                </tr>

                <tr className="bg-slate-100/60 font-semibold text-slate-500 text-[11px] text-center">
                  <td colSpan={7} className="py-1 tracking-wider uppercase">Lunch Break & Dining Hall (12:25 - 13:30)</td>
                </tr>

                <tr>
                  <td className="py-3 px-3 font-mono font-bold text-slate-700">P7/8</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">14:00 - 15:30</td>
                  <td className="py-3 px-3 font-bold text-green-900 bg-green-50/40 rounded">
                    Physical Games <span className="block text-[10px] font-normal text-slate-500">Field Track</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-indigo-900 bg-indigo-50/40 rounded">
                    Life Skills / Clubs <span className="block text-[10px] font-normal text-slate-500">Auditorium</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-green-900 bg-green-50/40 rounded">
                    Physical Games <span className="block text-[10px] font-normal text-slate-500">Field Track</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-rose-900 bg-rose-50/40 rounded">
                    Music & Drama <span className="block text-[10px] font-normal text-slate-500">Choir Hall</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-800 bg-slate-100/80 rounded">
                    School Assembly <span className="block text-[10px] font-normal text-slate-500">Main Quad</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Custom Generated Timetable Slots Archive */}
          {timetables.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Recently Generated Timetable Slots ({timetables.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {timetables.map(slot => (
                  <div key={slot.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-start justify-between">
                    <div>
                      <div className="font-bold text-blue-900">{slot.subject} ({slot.grade} {slot.stream})</div>
                      <div className="text-slate-600 mt-0.5">{slot.day} · Period {slot.period} ({slot.time})</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">Teacher: {slot.teacherName} · {slot.room}</div>
                    </div>
                    <button
                      onClick={() => deleteTimetableSlot(slot.id)}
                      className="text-rose-600 hover:text-rose-800 font-semibold p-1"
                      title="Delete slot"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Scheme Generator Modal */}
      {isGeneratorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 my-8 overflow-hidden text-xs">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>KICD Automated Scheme of Work Generator</span>
                </h2>
                <p className="text-[11px] text-blue-200">RealmsPM Academic Curriculum Bureau</p>
              </div>
              <button
                onClick={() => setIsGeneratorModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateScheme} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Quick Preset Selector */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block mb-1.5">
                  Curriculum Quick Presets
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Integrated Science', 'Mathematics', 'English'].map(subj => (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => handleAutoFillSubject(subj)}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-white text-blue-800 rounded border border-blue-300 hover:bg-blue-100 transition-colors"
                    >
                      Autofill {subj}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Subject / Learning Area *</label>
                  <input
                    type="text"
                    required
                    value={genSubject}
                    onChange={(e) => setGenSubject(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Grade Level</label>
                  <select
                    value={genGrade}
                    onChange={(e) => setGenGrade(e.target.value as GradeLevel)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    {gradesList.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Week / Lesson</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={1}
                      max={14}
                      value={genWeek}
                      onChange={(e) => setGenWeek(Number(e.target.value))}
                      className="w-1/2 px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none font-mono"
                    />
                    <input
                      type="number"
                      min={1}
                      max={8}
                      value={genLesson}
                      onChange={(e) => setGenLesson(Number(e.target.value))}
                      className="w-1/2 px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Strand *</label>
                  <input
                    type="text"
                    required
                    value={genStrand}
                    onChange={(e) => setGenStrand(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sub-Strand *</label>
                  <input
                    type="text"
                    required
                    value={genSubStrand}
                    onChange={(e) => setGenSubStrand(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specific Learning Outcomes *</label>
                <textarea
                  rows={2}
                  required
                  value={genOutcomes}
                  onChange={(e) => setGenOutcomes(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Key Inquiry Questions *</label>
                <input
                  type="text"
                  required
                  value={genInquiry}
                  onChange={(e) => setGenInquiry(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Learning Experiences & Activities *</label>
                <textarea
                  rows={2}
                  required
                  value={genExperiences}
                  onChange={(e) => setGenExperiences(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Learning Resources</label>
                  <input
                    type="text"
                    value={genResources}
                    onChange={(e) => setGenResources(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assessment Method</label>
                  <input
                    type="text"
                    value={genAssessment}
                    onChange={(e) => setGenAssessment(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Teacher Reflection</label>
                <input
                  type="text"
                  value={genReflection}
                  onChange={(e) => setGenReflection(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsGeneratorModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold shadow-xs"
                >
                  Save to School Scheme Archive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Master Timetable Slot Generator Modal */}
      {isTimetableModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 my-8 overflow-hidden text-xs">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-300" />
                  <span>Generate Master Timetable Slot</span>
                </h2>
                <p className="text-[11px] text-blue-200">RealmsPM School Operations Bureau</p>
              </div>
              <button
                onClick={() => setIsTimetableModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTimetableSlot} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Grade Level *</label>
                  <select
                    value={ttGrade}
                    onChange={(e) => setTtGrade(e.target.value as GradeLevel)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    {gradesList.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stream *</label>
                  <select
                    value={ttStream}
                    onChange={(e) => setTtStream(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    {['Alpha', 'Beta', 'Emerald', 'Gold'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Day of Week *</label>
                  <select
                    value={ttDay}
                    onChange={(e) => setTtDay(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Period Number (1-8) *</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    required
                    value={ttPeriod}
                    onChange={(e) => setTtPeriod(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Time Window *</label>
                <input
                  type="text"
                  required
                  value={ttTime}
                  onChange={(e) => setTtTime(e.target.value)}
                  placeholder="e.g. 08:00 - 08:45"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject / Learning Area *</label>
                <input
                  type="text"
                  required
                  value={ttSubject}
                  onChange={(e) => setTtSubject(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Teacher *</label>
                  <input
                    type="text"
                    required
                    value={ttTeacher}
                    onChange={(e) => setTtTeacher(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Room / Venue *</label>
                  <input
                    type="text"
                    required
                    value={ttRoom}
                    onChange={(e) => setTtRoom(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTimetableModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold shadow-xs"
                >
                  Save Timetable Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
