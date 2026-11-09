import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { ASSET_PATHS, PERFORMANCE_LEVELS } from '../../data/mockData';
import { Printer, X, Download, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Student, StudentReportCard, FeeTransaction, Exeat, SchemeOfWorkItem } from '../../types';

export const PrintModal: React.FC = () => {
  const { activePrintDoc, closePrintDoc, canAccessFinances } = useSchool();

  if (!activePrintDoc) return null;

  const handlePrint = () => {
    window.print();
  };

  const renderContent = () => {
    switch (activePrintDoc.type) {
      case 'reportCard': {
        const student: Student = activePrintDoc.payload.student;
        const reportCard: StudentReportCard = activePrintDoc.payload.reportCard;

        return (
          <div className="p-8 max-w-4xl mx-auto bg-white text-slate-900 font-sans space-y-6 print:p-0 print:m-0 print:max-w-none">
            {/* Official School Header */}
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between gap-6">
              <img
                src={ASSET_PATHS.crest}
                alt="RealmsPM Crest"
                className="w-24 h-24 object-contain rounded-full border border-slate-300 p-1 shrink-0"
              />
              <div className="text-center flex-1">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                  RealmsPM Academy & Junior School
                </h1>
                <p className="text-xs font-semibold text-slate-700 tracking-wider uppercase mt-0.5">
                  Ministry of Education Reg: MOE/P/204018 · KNEC Center No: 20401882
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  P.O. Box 48201-00100 Nairobi, Kenya · Tel: +254 722 000 111 · info@realmspm.ac.ke
                </p>
                <div className="mt-2 inline-block px-4 py-1 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded">
                  Official Competency-Based Curriculum (CBC) Learner Assessment Report
                </div>
              </div>
              <div className="w-24 text-right font-mono text-[11px] text-slate-500 shrink-0">
                <div><strong>Term:</strong> {reportCard.term}</div>
                <div><strong>Year:</strong> {reportCard.academicYear}</div>
              </div>
            </div>

            {/* Learner Bio Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-300 rounded text-xs font-mono">
              <div>
                <span className="text-slate-500 font-sans block text-[10px] uppercase">Learner Name:</span>
                <span className="font-bold text-slate-900 text-sm font-sans">{reportCard.studentName}</span>
              </div>
              <div>
                <span className="text-slate-500 font-sans block text-[10px] uppercase">Admission Number:</span>
                <span className="font-bold text-slate-900">{reportCard.admissionNo}</span>
              </div>
              <div>
                <span className="text-slate-500 font-sans block text-[10px] uppercase">NEMIS UPI Number:</span>
                <span className="font-bold text-blue-900">{reportCard.upiNo}</span>
              </div>
              <div>
                <span className="text-slate-500 font-sans block text-[10px] uppercase">Class & Stream:</span>
                <span className="font-bold text-slate-900">{reportCard.grade} ({reportCard.stream})</span>
              </div>
              <div>
                <span className="text-slate-500 font-sans block text-[10px] uppercase">Term Attendance:</span>
                <span className="font-bold text-slate-900">{reportCard.daysPresent} / {reportCard.totalDays} Days ({Math.round((reportCard.daysPresent/reportCard.totalDays)*100)}%)</span>
              </div>
              <div>
                <span className="text-slate-500 font-sans block text-[10px] uppercase">Boarding Status:</span>
                <span className="font-bold text-slate-900">{student.boardingStatus}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 font-sans block text-[10px] uppercase">Guardian:</span>
                <span className="font-bold text-slate-900">{student.guardianName} ({student.guardianPhone})</span>
              </div>
            </div>

            {/* Learning Areas Rubric Table */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-300 pb-1">
                A. Learning Areas Mastery & Performance Levels
              </h2>
              <table className="w-full text-left border-collapse text-xs border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-[10px] font-bold text-slate-700 uppercase">
                    <th className="py-2 px-3 border-r border-slate-300">Learning Area / Subject</th>
                    <th className="py-2 px-3 border-r border-slate-300">Strand / Competencies Evaluated</th>
                    <th className="py-2 px-2 text-center border-r border-slate-300">EE (4)</th>
                    <th className="py-2 px-2 text-center border-r border-slate-300">ME (3)</th>
                    <th className="py-2 px-2 text-center border-r border-slate-300">AE (2)</th>
                    <th className="py-2 px-2 text-center border-r border-slate-300">BE (1)</th>
                    <th className="py-2 px-3">Subject Teacher Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {reportCard.assessments.map(item => (
                    <tr key={item.subject}>
                      <td className="py-2 px-3 font-bold border-r border-slate-300">{item.subject}</td>
                      <td className="py-2 px-3 text-[11px] border-r border-slate-300">
                        <div className="font-medium text-slate-800">{item.strand}</div>
                        <div className="text-[10px] text-slate-500">{item.subStrand}</div>
                      </td>
                      <td className="py-2 px-2 text-center font-bold border-r border-slate-300 font-mono">
                        {item.rating === 'EE' ? '✓' : ''}
                      </td>
                      <td className="py-2 px-2 text-center font-bold border-r border-slate-300 font-mono">
                        {item.rating === 'ME' ? '✓' : ''}
                      </td>
                      <td className="py-2 px-2 text-center font-bold border-r border-slate-300 font-mono">
                        {item.rating === 'AE' ? '✓' : ''}
                      </td>
                      <td className="py-2 px-2 text-center font-bold border-r border-slate-300 font-mono">
                        {item.rating === 'BE' ? '✓' : ''}
                      </td>
                      <td className="py-2 px-3 text-[11px] text-slate-600 italic">{item.teacherRemarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-1 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                <span>EE: Exceeding Expectations (80-100%)</span>
                <span>ME: Meeting Expectations (65-79%)</span>
                <span>AE: Approaching Expectations (50-64%)</span>
                <span>BE: Below Expectations (&lt;50%)</span>
              </div>
            </div>

            {/* Core Competencies & Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-300 rounded p-3 text-xs">
                <h3 className="font-bold uppercase tracking-wider text-[11px] mb-2 text-slate-900 border-b border-slate-200 pb-1">
                  B. CBC Core Competencies
                </h3>
                <div className="space-y-1.5 text-[11px]">
                  {reportCard.coreCompetencies.map(c => (
                    <div key={c.competency} className="flex items-center justify-between">
                      <span className="text-slate-700">{c.competency}:</span>
                      <span className="font-bold font-mono text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                        {c.rating}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-slate-300 rounded p-3 text-xs">
                <h3 className="font-bold uppercase tracking-wider text-[11px] mb-2 text-slate-900 border-b border-slate-200 pb-1">
                  C. National Core Values Demonstrated
                </h3>
                <div className="space-y-1.5 text-[11px]">
                  {reportCard.valuesDemonstrated.map(v => (
                    <div key={v.value} className="flex items-center justify-between">
                      <span className="text-slate-700">{v.value}:</span>
                      <span className="font-bold font-mono text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                        {v.rating}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Teacher Remarks & Official Seal */}
            <div className="border border-slate-300 rounded p-4 text-xs space-y-3">
              <div>
                <span className="font-bold text-slate-800 uppercase text-[10px] block">Class Teacher Remarks:</span>
                <p className="italic text-slate-700 mt-0.5">{reportCard.classTeacherRemarks}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Sign: ___________________ (Class Tutor)</span>
                  <span>Date: {new Date().toISOString().split('T')[0]}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-800 uppercase text-[10px] block">Headteacher Remarks & Stamp:</span>
                <p className="italic text-slate-700 mt-0.5">{reportCard.headTeacherRemarks}</p>
                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Dr. Samuel Adebayo, PhD (Principal)</span>
                  <div className="border-2 border-blue-900 text-blue-900 px-3 py-1 font-bold text-[10px] uppercase rotate-[-3deg] text-center">
                    REALMSPM ACADEMY<br />OFFICIAL SEAL
                  </div>
                  <span>Next Term Commences: <strong>{reportCard.openingDateNextTerm}</strong></span>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'feeReceipt': {
        if (!canAccessFinances) {
          return (
            <div className="p-8 max-w-md mx-auto bg-white rounded-2xl text-center space-y-4 my-8 border border-slate-200 shadow-xl">
              <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Confidential Financial Document</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Official fee receipt viewing and printing is restricted to the School Principal and Bursar.
              </p>
              <button
                type="button"
                onClick={closePrintDoc}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Document
              </button>
            </div>
          );
        }

        const txn: FeeTransaction = activePrintDoc.payload.transaction;
        const student: Student = activePrintDoc.payload.student;

        return (
          <div className="p-8 max-w-2xl mx-auto bg-white text-slate-900 font-sans space-y-6 print:p-0 print:m-0 print:max-w-none">
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={ASSET_PATHS.crest}
                  alt="RealmsPM Crest"
                  className="w-16 h-16 object-contain rounded-full border border-slate-300 p-0.5"
                />
                <div>
                  <h1 className="text-xl font-extrabold uppercase tracking-tight">RealmsPM Academy</h1>
                  <p className="text-[11px] text-slate-600">Bursar & Accounts Office · P.O. Box 48201-00100 Nairobi</p>
                  <p className="text-[10px] text-slate-500 font-mono">M-Pesa Paybill: 400222 · Bank: Equity Bank 01802991023</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Official Receipt</span>
                <span className="text-base font-extrabold font-mono text-slate-900">{txn.receiptNo}</span>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">{txn.date}</div>
              </div>
            </div>

            {/* Receipt Particulars */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded border border-slate-300 text-xs font-mono">
              <div>
                <span className="text-slate-500 font-sans block text-[10px] uppercase">Learner Name:</span>
                <span className="font-bold text-slate-900 text-sm font-sans">{txn.studentName}</span>
              </div>
              <div>
                <span className="text-slate-500 font-sans block text-[10px] uppercase">Admission Number:</span>
                <span className="font-bold text-slate-900">{txn.admissionNo}</span>
              </div>
              <div>
                <span className="text-slate-500 font-sans block text-[10px] uppercase">Payment Method:</span>
                <span className="font-bold text-slate-900">{txn.paymentMethod}</span>
              </div>
              <div>
                <span className="text-slate-500 font-sans block text-[10px] uppercase">Payment Reference:</span>
                <span className="font-bold text-blue-900">{txn.reference}</span>
              </div>
            </div>

            {/* Financial Ledger Breakdown */}
            <div className="border border-slate-300 rounded overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-[10px] text-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-right">Amount (KES)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  <tr>
                    <td className="py-3 px-3 font-sans">
                      <div className="font-bold">{txn.description}</div>
                      <div className="text-[10px] text-slate-500">{txn.term} ({txn.academicYear})</div>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      KES {txn.amount.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td className="py-2.5 px-3 font-sans text-right uppercase text-[11px]">Total Paid:</td>
                    <td className="py-2.5 px-3 text-right text-emerald-800 text-sm">
                      KES {txn.amount.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans text-right text-slate-500 text-[11px]">Remaining Balance:</td>
                    <td className="py-2 px-3 text-right text-slate-700">
                      KES {student.feeBalance.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Signature & Stamp */}
            <div className="pt-4 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Received By:</span>
                <span className="font-bold text-slate-800">{txn.recordedBy}</span>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">Signature: __________________</div>
              </div>

              <div className="border-2 border-emerald-800 text-emerald-800 px-4 py-1.5 font-bold text-xs uppercase rotate-[-2deg] text-center font-mono">
                REALMSPM ACCOUNTS<br />OFFICIAL PAID
              </div>
            </div>
          </div>
        );
      }

      case 'exeatPass': {
        const exeat: Exeat = activePrintDoc.payload.exeat;
        const student: Student = activePrintDoc.payload.student;

        return (
          <div className="p-8 max-w-xl mx-auto bg-white text-slate-900 font-sans space-y-5 print:p-0 print:m-0 print:max-w-none">
            <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-black uppercase tracking-tight">RealmsPM Academy</h1>
                <p className="text-xs text-slate-600 font-semibold">Official Student Exeat Gate Pass Slip</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-400 uppercase block">Pass Number</span>
                <span className="font-bold text-slate-900 text-sm">{exeat.passNo}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs font-mono p-4 bg-slate-50 border border-slate-300 rounded">
              <div className="flex justify-between border-b border-slate-200 pb-1.5 font-sans">
                <span className="text-slate-500 font-semibold">Pupil Full Name:</span>
                <span className="font-bold text-slate-900">{exeat.studentName} ({exeat.admissionNo})</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500 font-sans">Class / Grade:</span>
                <span className="font-bold text-slate-900">{exeat.grade}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500 font-sans">Dormitory:</span>
                <span className="font-bold text-slate-900">{exeat.dormitory}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500 font-sans">Reason for Exeat:</span>
                <span className="font-bold text-slate-900 font-sans">{exeat.reason}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500 font-sans">Departure Date:</span>
                <span className="font-bold text-slate-900">{exeat.departureDate}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500 font-sans">Expected Return:</span>
                <span className="font-bold text-rose-700">{exeat.expectedReturnDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Authorized Guardian:</span>
                <span className="font-bold text-slate-900 font-sans">{exeat.guardianName} ({exeat.guardianPhone})</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Authorized By:</span>
                <span className="font-bold text-slate-800">{exeat.approvedBy}</span>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">Sign: ________________</div>
              </div>

              <div className="border border-slate-900 text-slate-900 px-3 py-2 text-center text-[10px] uppercase font-bold font-mono">
                SECURITY GATE 1<br />CLEARANCE STAMP
              </div>
            </div>
          </div>
        );
      }

      case 'schemeOfWork': {
        const scheme: SchemeOfWorkItem = activePrintDoc.payload.scheme;

        return (
          <div className="p-8 max-w-4xl mx-auto bg-white text-slate-900 font-sans space-y-5 print:p-0 print:m-0 print:max-w-none">
            <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-black uppercase tracking-tight">RealmsPM Academy & Junior School</h1>
                <p className="text-xs text-slate-600 font-semibold">KICD Competency-Based Curriculum (CBC) Scheme of Work</p>
              </div>
              <div className="text-right text-xs font-mono">
                <div><strong>Grade:</strong> {scheme.grade}</div>
                <div><strong>Subject:</strong> {scheme.subject}</div>
                <div><strong>Term:</strong> {scheme.term}</div>
              </div>
            </div>

            <table className="w-full text-left border-collapse text-xs border border-slate-300">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-[10px] font-bold text-slate-700 uppercase">
                  <th className="py-2 px-2 border-r border-slate-300">Wk</th>
                  <th className="py-2 px-2 border-r border-slate-300">Les</th>
                  <th className="py-2 px-3 border-r border-slate-300">Strand / Sub-Strand</th>
                  <th className="py-2 px-3 border-r border-slate-300">Specific Learning Outcomes</th>
                  <th className="py-2 px-3 border-r border-slate-300">Key Inquiry Question</th>
                  <th className="py-2 px-3 border-r border-slate-300">Learning Experiences</th>
                  <th className="py-2 px-3">Assessment / Resources</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 px-2 font-mono font-bold text-center border-r border-slate-300">{scheme.week}</td>
                  <td className="py-3 px-2 font-mono font-bold text-center border-r border-slate-300">{scheme.lesson}</td>
                  <td className="py-3 px-3 border-r border-slate-300 font-medium">
                    <div className="font-bold text-slate-900">{scheme.strand}</div>
                    <div className="text-[10px] text-slate-600">{scheme.subStrand}</div>
                  </td>
                  <td className="py-3 px-3 border-r border-slate-300 text-[11px] leading-relaxed">
                    {scheme.specificLearningOutcomes}
                  </td>
                  <td className="py-3 px-3 border-r border-slate-300 text-[11px] italic leading-relaxed">
                    "{scheme.keyInquiryQuestions}"
                  </td>
                  <td className="py-3 px-3 border-r border-slate-300 text-[11px] leading-relaxed">
                    {scheme.learningExperiences}
                  </td>
                  <td className="py-3 px-3 text-[11px]">
                    <div className="mb-1"><strong>Resources:</strong> {scheme.learningResources}</div>
                    <div><strong>Assessment:</strong> {scheme.assessmentMethods}</div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
              <span className="font-bold text-slate-800 uppercase text-[10px] block">Teacher's Self-Reflection:</span>
              <p className="italic text-slate-700">{scheme.reflection}</p>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 my-6 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Controls Bar (Hidden in print) */}
        <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Print Document Preview
            </span>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <span className="text-xs text-blue-200 font-medium truncate max-w-md">
              {activePrintDoc.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={closePrintDoc}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Body */}
        <div className="overflow-y-auto flex-1 bg-slate-100 p-4 print:p-0 print:bg-white">
          <div className="shadow-lg print:shadow-none bg-white rounded-xl overflow-hidden">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
