import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { ParentMessage } from '../../types';
import {
  MessageSquare,
  Send,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Smartphone,
  AlertTriangle
} from 'lucide-react';

export const CommunicationModule: React.FC = () => {
  const { messages, sendMessage, students, canAccessFinances } = useSchool();

  const [title, setTitle] = useState('');
  const [messageType, setMessageType] = useState<ParentMessage['messageType']>(() =>
    canAccessFinances ? 'Fee Reminder' : 'Academic Report'
  );
  const [recipientGroup, setRecipientGroup] = useState<ParentMessage['recipientGroup']>(() =>
    canAccessFinances ? 'Fee Defaulters' : 'All Parents'
  );
  const [messageBody, setMessageBody] = useState(() =>
    canAccessFinances
      ? 'Dear RealmsPM Parent/Guardian, kindly be reminded that the deadline for clearing Term 1 fee arrears is 10th February. Payments via M-Pesa Paybill 400222 (A/C: Adm No). Thank you.'
      : 'Dear RealmsPM Parent, CBC assessment report cards for Term 1 have been finalized and are available in the portal. Open Day with class tutors is scheduled for this Friday at 10:00 AM.'
  );
  const [sendSuccess, setSendSuccess] = useState(false);

  // If role switches to a non-finance role while Fee Reminder is active, reset to Academic Report
  React.useEffect(() => {
    if (!canAccessFinances && (messageType === 'Fee Reminder' || recipientGroup === 'Fee Defaulters')) {
      setMessageType('Academic Report');
      setRecipientGroup('All Parents');
      setMessageBody('Dear RealmsPM Parent, CBC assessment report cards for Term 1 have been finalized and are available in the portal. Open Day with class tutors is scheduled for this Friday at 10:00 AM.');
    }
  }, [canAccessFinances, messageType, recipientGroup]);

  // Calculate target parent count based on selected group
  const getTargetCount = (group: ParentMessage['recipientGroup']) => {
    if (group === 'All Parents') return students.length * 2;
    if (group === 'Fee Defaulters') return students.filter(s => s.feeBalance > 0).length;
    if (group === 'Boarders Only') return students.filter(s => s.boardingStatus === 'Boarder').length;
    return students.length;
  };

  const handleApplyTemplate = (type: ParentMessage['messageType']) => {
    setMessageType(type);
    if (type === 'Fee Reminder') {
      setTitle('Term 1 Fee Settlement Notice');
      setRecipientGroup('Fee Defaulters');
      setMessageBody('Dear RealmsPM Parent/Guardian, kindly settle outstanding Term 1 fee balances by Friday 10th Feb via M-Pesa Paybill 400222 or Equity A/C 01802991023 to avoid student clearance inconveniences. Thank you.');
    } else if (type === 'Academic Report') {
      setTitle('CBC Mid-Term Assessment Reports Published');
      setRecipientGroup('All Parents');
      setMessageBody('Dear RealmsPM Parent, CBC assessment report cards for Term 1 have been finalized and are available in the portal. Open Day with class tutors is scheduled for this Friday at 10:00 AM.');
    } else if (type === 'AGM / Event') {
      setTitle('Annual General Meeting (AGM) Notice');
      setRecipientGroup('All Parents');
      setMessageBody('Notice is hereby given for RealmsPM Academy AGM on Saturday 14th Feb at 9:00 AM in the Campus Hall. We kindly request the attendance of all parents and guardians.');
    } else if (type === 'Emergency') {
      setTitle('Urgent Campus Notice');
      setRecipientGroup('All Parents');
      setMessageBody('URGENT: Heavy rains have affected road access around Gate 2. School buses are safely routed through Gate 1. All learners are supervised and safe.');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageBody.trim()) return;

    sendMessage({
      title: title || `${messageType} Broadcast`,
      messageType,
      recipientGroup,
      targetCount: getTargetCount(recipientGroup),
      messageBody,
      sender: 'RealmsPM Administration'
    });

    setSendSuccess(true);
    setTimeout(() => setSendSuccess(false), 4000);
    setTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Parent Communication & Bulk SMS</h1>
          <p className="text-xs text-slate-500">
            SMS gateway dispatch, noticeboard announcements, and parent engagement history
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500 font-mono">SMS Balance:</span>
          <span className="font-bold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            14,820 Credits Available
          </span>
        </div>
      </div>

      {/* Main Grid: Composer & Outbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Dispatch Composer */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>Compose Broadcast / SMS Dispatch</span>
            </h2>

            {sendSuccess && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ✓ Message Sent to {getTargetCount(recipientGroup)} Guardians
              </span>
            )}
          </div>

          {/* Quick Template Buttons */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              1-Click Message Templates
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(['Fee Reminder', 'Academic Report', 'AGM / Event', 'Emergency'] as ParentMessage['messageType'][])
                .filter(t => canAccessFinances || t !== 'Fee Reminder')
                .map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleApplyTemplate(t)}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                  >
                    {t}
                  </button>
                ))}
            </div>
          </div>

          <form onSubmit={handleSendMessage} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subject / Broadcast Header</label>
              <input
                type="text"
                placeholder="e.g. Term 1 Clearance Notice"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notice Category</label>
                <select
                  value={messageType}
                  onChange={(e) => setMessageType(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                >
                  {canAccessFinances && <option value="Fee Reminder">Fee Reminder</option>}
                  <option value="Academic Report">Academic Report</option>
                  <option value="AGM / Event">AGM / School Event</option>
                  <option value="Emergency">Urgent Notice</option>
                  <option value="General Notice">General Announcement</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Guardian Group</label>
                <select
                  value={recipientGroup}
                  onChange={(e) => setRecipientGroup(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none font-semibold text-slate-800"
                >
                  <option value="All Parents">All Enrolled Parents ({students.length * 2})</option>
                  {canAccessFinances && (
                    <option value="Fee Defaulters">Fee Defaulters ({students.filter(s => s.feeBalance > 0).length})</option>
                  )}
                  <option value="Boarders Only">Boarding Parents ({students.filter(s => s.boardingStatus === 'Boarder').length})</option>
                  <option value="JSS Parents">Junior Secondary Parents</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">SMS Message Content *</label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {messageBody.length} chars · {Math.ceil(messageBody.length / 160)} SMS Parts
                </span>
              </div>
              <textarea
                rows={4}
                required
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 leading-relaxed"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div className="text-[11px] text-slate-600">
                <span>Sender Mask: <strong>REALMSPM</strong></span>
                <span className="mx-2">·</span>
                <span>Recipients: <strong className="font-mono">{getTargetCount(recipientGroup)}</strong> Contacts</span>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold shadow-xs inline-flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Broadcast SMS</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Outbox History */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Recent Broadcast Outbox
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">
              {messages.filter(msg => canAccessFinances || msg.messageType !== 'Fee Reminder').length} Dispatches
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {messages
              .filter(msg => canAccessFinances || msg.messageType !== 'Fee Reminder')
              .map(msg => (
              <div key={msg.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/40 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 truncate max-w-[200px]">{msg.title}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {msg.status}
                  </span>
                </div>

                <p className="text-slate-600 line-clamp-3 leading-relaxed text-[11px]">
                  "{msg.messageBody}"
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>To: {msg.recipientGroup} ({msg.targetCount})</span>
                  <span>{msg.sentAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
