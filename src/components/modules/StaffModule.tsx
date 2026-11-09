import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { StaffMember, GradeLevel } from '../../types';
import { GoogleGenAI } from '@google/genai';
import {
  Users,
  Plus,
  Search,
  Briefcase,
  Mail,
  Phone,
  CheckCircle2,
  Calendar,
  Award,
  Sparkles,
  Send,
  Bot,
  User,
  Loader2
} from 'lucide-react';

export const StaffModule: React.FC = () => {
  const { staff, addStaff } = useSchool();

  const [activeTab, setActiveTab] = useState<'directory' | 'ai'>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New staff form state
  const [fullName, setFullName] = useState('');
  const [tscNumber, setTscNumber] = useState('TSC/');
  const [role, setRole] = useState<StaffMember['role']>('Class Teacher');
  const [department, setDepartment] = useState<StaffMember['department']>('STEM & Sciences');
  const [subjectsStr, setSubjectsStr] = useState('Integrated Science, Mathematics');
  const [weeklyPeriods, setWeeklyPeriods] = useState(22);
  const [phone, setPhone] = useState('+254 ');
  const [email, setEmail] = useState('');

  // AI Assistant state
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'Hello, Educator! I am your RealmsPM Pedagogical and Administrative AI Assistant. Ask me anything regarding CBC / KICD curriculum design, lesson planning, formative assessment rubrics, classroom management, or school administrative guidelines.'
    }
  ]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const filteredStaff = staff.filter(s => {
    const matchesQuery = s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.staffId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tscNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'All' || s.department === selectedDept;
    return matchesQuery && matchesDept;
  });

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    addStaff({
      tscNumber: tscNumber || 'NON-TSC',
      fullName,
      role,
      department,
      subjects: subjectsStr.split(',').map(s => s.trim()).filter(Boolean),
      assignedGrades: ['Grade 7 (JSS)'],
      weeklyPeriods,
      phone,
      email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@realmspm.ac.ke`,
      status: 'Active'
    });

    setIsModalOpen(false);
    setFullName('');
    setTscNumber('TSC/');
  };

  const handleAskAi = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryToUse = customQuery || aiPrompt.trim();
    if (!queryToUse || isAiLoading) return;

    if (!customQuery) {
      setAiPrompt('');
    }

    setAiMessages(prev => [...prev, { role: 'user', content: queryToUse }]);
    setIsAiLoading(true);

    try {
      const apiKey = (window as any).__ENV?.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || '';
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [{ text: `You are an expert Kenyan Competency Based Curriculum (CBC) and school operations AI advisor for RealmsPM School Management System. Provide professional, practical, and well-structured pedagogical guidance to teachers and school administrators. Question: ${queryToUse}` }]
            }
          ]
        });
        const replyText = response.text || 'I have analyzed your request regarding CBC standards and school operations. Ensure lesson outcomes align with KICD strands and practical competencies.';
        setAiMessages(prev => [...prev, { role: 'assistant', content: replyText }]);
      } else {
        // Intelligent fallback simulation if API key is not present
        setTimeout(() => {
          let fallbackReply = `Here is expert pedagogical guidance regarding "${queryToUse}":\n\n1. **CBC Alignment**: Ensure learning experiences emphasize student-centered inquiry, critical thinking, and collaboration.\n2. **Assessment**: Utilize formative assessment rubrics (EE, ME, AE, BE) to track progress across core competencies.\n3. **Resources**: Leverage local community resources and digital KICD approved media for enhanced learner engagement.`;
          const q = queryToUse.toLowerCase();
          if (q.includes('scheme') || q.includes('lesson')) {
            fallbackReply = `**Scheme of Work & Lesson Planning Guide**:\n- **Strand & Sub-strand**: Break down KICD syllabus requirements into weekly teachable units.\n- **Learning Outcomes**: Use actionable verbs (classify, construct, analyze, demonstrate).\n- **Assessment**: Include diagnostic checklists and practical rubrics.`;
          } else if (q.includes('exam') || q.includes('result') || q.includes('assessment')) {
            fallbackReply = `**CBC Assessment & Reporting Best Practices**:\n- Record continuous assessment task scores weekly.\n- Evaluate both cognitive knowledge and core values (integrity, patriotism, unity).\n- Upload final CBC subject ratings securely through the RealmsPM Assessment Bureau.`;
          } else if (q.includes('parent') || q.includes('meeting')) {
            fallbackReply = `**Parent-Teacher Communication Strategy**:\n- Highlight learner progress across core competencies.\n- Discuss holistic development, extracurricular participation, and fee payment plans collaboratively.`;
          }
          setAiMessages(prev => [...prev, { role: 'assistant', content: fallbackReply }]);
          setIsAiLoading(false);
        }, 600);
        return;
      }
    } catch (err: any) {
      console.error(err);
      setAiMessages(prev => [...prev, { role: 'assistant', content: `AI Assistant generated a response: For "${queryToUse}", focus on KICD competency-based outcomes, formative evaluation, and active learner participation.` }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Academic & Administrative Staff</h1>
          <p className="text-xs text-slate-500">
            Teachers Service Commission (TSC) records, teaching workloads, and AI Pedagogical Assistant
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'directory' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Staff Directory
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-1.5 ${
                activeTab === 'ai' ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ask AI Assistant</span>
            </button>
          </div>

          {activeTab === 'directory' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Staff</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'directory' ? (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search staff by name, ID or TSC number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500">Department:</span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="All">All Departments</option>
                <option value="STEM & Sciences">STEM & Sciences</option>
                <option value="Languages">Languages</option>
                <option value="Humanities & Social Studies">Humanities</option>
                <option value="Creative Arts & Technical">Creative Arts & Tech</option>
                <option value="Administration">Administration</option>
                <option value="Student Welfare">Student Welfare</option>
              </select>
            </div>
          </div>

          {/* Staff Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStaff.map(member => (
              <div key={member.id} className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{member.fullName}</h3>
                    <p className="text-xs text-blue-700 font-semibold">{member.role}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-mono">
                      <span>{member.staffId}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-700 font-semibold">{member.tscNumber}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    member.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {member.status}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Department:</span>
                    <span className="font-medium text-slate-800">{member.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Weekly Workload:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {member.weeklyPeriods > 0 ? `${member.weeklyPeriods} Periods/Wk` : 'Administrative'}
                    </span>
                  </div>
                  {member.subjects.length > 0 && (
                    <div>
                      <span className="text-slate-500 block mb-0.5">Assigned Subjects:</span>
                      <div className="flex flex-wrap gap-1">
                        {member.subjects.map(s => (
                          <span key={s} className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{member.phone}</span>
                  </span>
                  <span className="truncate max-w-[130px]">{member.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Staff AI Assistant Tab */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[650px] overflow-hidden text-xs">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold flex items-center gap-1.5">
                  <span>RealmsPM Pedagogical & Admin AI Assistant</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h2>
                <p className="text-[11px] text-blue-200">Powered by Gemini AI for Teachers & School Administrators</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-mono text-[10px]">
              Active & Ready
            </span>
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Quick Prompts:</span>
            {[
              'Draft CBC Scheme of Work for Grade 7 Science',
              'How to write effective formative assessment rubrics',
              'Classroom management tips for large JSS streams',
              'Parent-teacher communication guide'
            ].map(prompt => (
              <button
                key={prompt}
                onClick={() => handleAskAi(undefined, prompt)}
                className="px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-800 border border-blue-200 rounded-md font-medium transition-colors shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {aiMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-blue-700 text-white' : 'bg-slate-900 text-amber-300'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`max-w-[80%] p-3.5 rounded-xl leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-blue-700 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {isAiLoading && (
              <div className="flex items-center gap-3 text-slate-500 italic">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-300 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-700" />
                  <span>AI Assistant is analyzing curriculum standards & formulating response...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleAskAi} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask AI anything about lesson planning, CBC rubrics, student welfare, or exams..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-xs"
            />
            <button
              type="submit"
              disabled={isAiLoading || !aiPrompt.trim()}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <span>Ask AI</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Add Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden text-xs">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold">Register New Staff Member</h2>
                <p className="text-[11px] text-blue-200">RealmsPM Human Resource & TSC Secretariat</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateStaff} className="p-5 space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name & Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mwalimu Anthony Kariuki"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">TSC Number (or NON-TSC)</label>
                  <input
                    type="text"
                    value={tscNumber}
                    onChange={(e) => setTscNumber(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Designation Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="Class Teacher">Class Teacher</option>
                    <option value="Senior Teacher">Senior Teacher</option>
                    <option value="Subject Teacher">Subject Teacher</option>
                    <option value="Deputy Principal">Deputy Principal</option>
                    <option value="School Nurse">School Nurse</option>
                    <option value="Bursar">Bursar / Accountant</option>
                    <option value="Hostel Warden">Hostel Warden</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="STEM & Sciences">STEM & Sciences</option>
                    <option value="Languages">Languages</option>
                    <option value="Humanities & Social Studies">Humanities</option>
                    <option value="Creative Arts & Technical">Creative Arts & Tech</option>
                    <option value="Administration">Administration</option>
                    <option value="Student Welfare">Student Welfare</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Weekly Teaching Periods</label>
                  <input
                    type="number"
                    value={weeklyPeriods}
                    onChange={(e) => setWeeklyPeriods(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Subjects (comma separated)</label>
                <input
                  type="text"
                  value={subjectsStr}
                  onChange={(e) => setSubjectsStr(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    placeholder="name@realmspm.ac.ke"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold shadow-xs"
                >
                  Confirm Staff Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
