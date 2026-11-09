import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Student, FeeTransaction } from '../../types';
import {
  CreditCard,
  Plus,
  Search,
  Printer,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  Smartphone,
  ShieldAlert,
  Lock,
  ArrowLeft,
  UserCheck,
  KeyRound,
  ShieldCheck
} from 'lucide-react';

export const FeesModule: React.FC = () => {
  const {
    students,
    transactions,
    feeStructures,
    recordFeePayment,
    openPrintDoc,
    currentTerm,
    academicYear,
    canAccessFinances,
    isStudentRole,
    currentStudentId,
    userRole,
    setUserRole,
    setActiveModule
  } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Cleared' | 'Pending'>('All');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedStudentForPay, setSelectedStudentForPay] = useState<Student | null>(null);

  // If student role, allow seeing outstanding fee balance only
  if (isStudentRole) {
    const myStudent = students.find(s => s.id === currentStudentId) || students[0];
    return (
      <div className="max-w-xl mx-auto my-8 p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-xl space-y-6 text-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-base font-bold text-slate-950">Student Fee Account Statement</h1>
            <p className="text-slate-500">Term 1, {academicYear} · RealmsPM Finance Bureau</p>
          </div>
          <div className="text-right">
            <span className="font-bold font-mono text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              {myStudent.admissionNo}
            </span>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">Learner Name:</span>
            <span className="font-bold text-slate-900">{myStudent.firstName} {myStudent.lastName} ({myStudent.grade} {myStudent.stream})</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">Boarding Status:</span>
            <span className="font-medium text-slate-800">{myStudent.boardingStatus}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">Total Billed Fees:</span>
            <span className="font-mono font-bold text-slate-900">KES {myStudent.totalBilled.toLocaleString()}</span>
          </div>
        </div>

        {/* Outstanding Balance Highlight */}
        <div className="p-6 bg-blue-900 text-white rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold block mb-1">
              Outstanding Fee Balance
            </span>
            <div className="text-2xl sm:text-3xl font-black font-mono text-amber-300">
              KES {myStudent.feeBalance.toLocaleString()}
            </div>
            <p className="text-[11px] text-blue-100 mt-1">
              {myStudent.feeBalance === 0 ? 'Account fully cleared for Term 1.' : 'Please clear balance before end of term examinations.'}
            </p>
          </div>
          <button
            onClick={() => openPrintDoc({ type: 'feeReceipt', title: `Fee Statement - ${myStudent.firstName} ${myStudent.lastName}`, payload: { student: myStudent } })}
            className="px-4 py-2.5 bg-white text-blue-900 hover:bg-blue-50 font-bold rounded-xl shadow-md transition-colors inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Statement</span>
          </button>
        </div>

        <div className="pt-2 text-center text-slate-400 text-[11px]">
          For payment instructions (M-Pesa Paybill 888999 A/C {myStudent.admissionNo}), contact the School Bursar's office.
        </div>
      </div>
    );
  }

  // Access check guard for remaining roles (Teachers, Nurses, Wardens, etc. - cannot see finances)
  if (!canAccessFinances) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-100 text-amber-900 border border-amber-300">
            <Lock className="w-3.5 h-3.5" />
            <span>Confidential Financial Records · RBAC Protected</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Access Restricted to Principal & Bursar
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            In accordance with institutional pupil data privacy guidelines and school financial regulations, access to student fee balances, M-Pesa statements, payment ledgers, and financial reconciliation is strictly reserved for the <strong className="text-slate-900">Principal / Admin</strong> and <strong className="text-slate-900">School Bursar</strong>.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left max-w-md mx-auto space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Your Current Profile Role:</span>
            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
              {userRole}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Access Status:</span>
            <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Access Denied
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Authorized Roles:</span>
            <span className="font-semibold text-emerald-800">Principal / Admin, Bursar</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setActiveModule('dashboard')}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Campus Overview</span>
          </button>

          <button
            onClick={() => setUserRole('Principal / Admin')}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            <span>Switch to Principal Profile</span>
          </button>

          <button
            onClick={() => setUserRole('Bursar')}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-emerald-700" />
            <span>Switch to Bursar</span>
          </button>
        </div>
      </div>
    );
  }

  // Payment form state
  const [payAmount, setPayAmount] = useState<number>(15000);
  const [payMethod, setPayMethod] = useState<'M-Pesa' | 'Bank Slip' | 'Cash' | 'Cheque'>('M-Pesa');
  const [payReference, setPayReference] = useState('');
  const [payDescription, setPayDescription] = useState('Term 1 Tuition & Operations fee payment');

  // Aggregates
  const totalBilled = students.reduce((sum, s) => sum + s.totalBilled, 0);
  const totalOutstanding = students.reduce((sum, s) => sum + s.feeBalance, 0);
  const totalCollected = Math.max(0, totalBilled - totalOutstanding);
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

  const filteredStudents = students.filter(s => {
    const nameMatch = `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase());

    if (!nameMatch) return false;
    if (filterStatus === 'Cleared') return s.feeBalance === 0;
    if (filterStatus === 'Pending') return s.feeBalance > 0;
    return true;
  });

  const handleOpenPayModal = (student?: Student) => {
    if (student) {
      setSelectedStudentForPay(student);
      setPayAmount(student.feeBalance > 0 ? student.feeBalance : 10000);
    } else {
      setSelectedStudentForPay(students[0] || null);
      setPayAmount(students[0]?.feeBalance || 15000);
    }
    setPayReference(`QK${Math.floor(100000 + Math.random() * 900000)}`);
    setIsRecordModalOpen(true);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForPay) return;
    if (payAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    const newTxn = recordFeePayment({
      studentId: selectedStudentForPay.id,
      studentName: `${selectedStudentForPay.firstName} ${selectedStudentForPay.lastName}`,
      admissionNo: selectedStudentForPay.admissionNo,
      amount: payAmount,
      paymentMethod: payMethod,
      reference: payReference || `REF-${Date.now().toString().slice(-6)}`,
      term: currentTerm,
      academicYear: academicYear,
      recordedBy: 'Catherine Ndinda (Bursar)',
      description: payDescription
    });

    setIsRecordModalOpen(false);

    // Open printable receipt immediately
    openPrintDoc({
      type: 'feeReceipt',
      title: `Official Receipt - ${newTxn.receiptNo}`,
      payload: { transaction: newTxn, student: selectedStudentForPay }
    });
  };

  const handlePrintExistingReceipt = (txn: FeeTransaction) => {
    const student = students.find(s => s.id === txn.studentId) || {
      firstName: txn.studentName.split(' ')[0],
      lastName: txn.studentName.split(' ')[1] || '',
      admissionNo: txn.admissionNo,
      grade: 'Grade 7 (JSS)',
      stream: 'Alpha',
      guardianName: 'Parent / Guardian',
      feeBalance: 0
    };

    openPrintDoc({
      type: 'feeReceipt',
      title: `Official Receipt - ${txn.receiptNo}`,
      payload: { transaction: txn, student }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Fees & Financial Management</h1>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Authorized: {userRole}</span>
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Student fee accounts, M-Pesa receipts, bank slips, and fee collection audit
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenPayModal()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Record Fee Payment</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Term Billing
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            KES {totalBilled.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">{currentTerm} · {students.length} Pupils</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
            Amount Collected
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-2">
            KES {totalCollected.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">{collectionRate}% of term target</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider">
            Outstanding Arrears
          </span>
          <div className="text-2xl font-bold font-mono text-rose-700 mt-2">
            KES {totalOutstanding.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {students.filter(s => s.feeBalance > 0).length} defaulters flagged
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">
            Official Paybill
          </span>
          <div className="text-xl font-bold font-mono text-slate-900 mt-2">
            Paybill: 400222
          </div>
          <div className="text-xs text-slate-500 mt-1">A/C: [AdmNo] · Equity 01802991023</div>
        </div>
      </div>

      {/* Fee Structure Summary Table */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          Term 1 Fee Structure By Level (KICD Compliant)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                <th className="py-2.5 px-3">Grade Tier</th>
                <th className="py-2.5 px-3">Tuition</th>
                <th className="py-2.5 px-3">Boarding</th>
                <th className="py-2.5 px-3">Lunch Scheme</th>
                <th className="py-2.5 px-3">Activity & Games</th>
                <th className="py-2.5 px-3">Assessment/Exam</th>
                <th className="py-2.5 px-3 font-bold text-slate-800">Total / Term</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {feeStructures.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="py-2 px-3 font-sans font-semibold text-slate-900">{item.grade}</td>
                  <td className="py-2 px-3">KES {item.tuition.toLocaleString()}</td>
                  <td className="py-2 px-3">KES {item.boarding.toLocaleString()}</td>
                  <td className="py-2 px-3">KES {item.lunch.toLocaleString()}</td>
                  <td className="py-2 px-3">KES {item.activity.toLocaleString()}</td>
                  <td className="py-2 px-3">KES {item.examination.toLocaleString()}</td>
                  <td className="py-2 px-3 font-bold text-blue-700">KES {item.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Grid: Student Balances vs Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Student Fee Ledgers */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/60">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Student Fee Ledgers ({filteredStudents.length})
            </h2>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder="Search student or AdmNo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1 text-xs border border-slate-200 rounded-md bg-white focus:outline-none"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="text-xs font-medium text-slate-700 border border-slate-200 rounded-md px-2 py-1 bg-white focus:outline-none"
              >
                <option value="All">All Balances</option>
                <option value="Cleared">Cleared (KES 0)</option>
                <option value="Pending">Pending Balances</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Learner</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Total Billed</th>
                  <th className="py-2.5 px-3">Outstanding Balance</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map(std => (
                  <tr key={std.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{std.firstName} {std.lastName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{std.admissionNo}</div>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-700">{std.grade}</td>
                    <td className="py-2.5 px-3 font-mono">KES {std.totalBilled.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-mono">
                      {std.feeBalance === 0 ? (
                        <span className="text-emerald-700 font-bold">Cleared (KES 0)</span>
                      ) : (
                        <span className="text-rose-700 font-bold">KES {std.feeBalance.toLocaleString()}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleOpenPayModal(std)}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
                      >
                        Receive Pay
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Recent Transactions & Receipts */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Issued Receipts
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">{transactions.length} records</span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {transactions.map(txn => (
                <div key={txn.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono text-slate-900">{txn.receiptNo}</span>
                    <span className="font-mono font-bold text-emerald-700">KES {txn.amount.toLocaleString()}</span>
                  </div>
                  <div className="font-semibold text-slate-800 mt-1">{txn.studentName}</div>
                  <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between mt-1">
                    <span>{txn.paymentMethod}: {txn.reference}</span>
                    <span>{txn.date}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 truncate max-w-[160px]">{txn.recordedBy}</span>
                    <button
                      onClick={() => handlePrintExistingReceipt(txn)}
                      className="text-xs font-semibold text-blue-700 hover:underline inline-flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print Slip</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Record Fee Payment Modal */}
      {isRecordModalOpen && selectedStudentForPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden text-xs">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold">Record Student Fee Payment</h2>
                <p className="text-[11px] text-blue-200">RealmsPM Accounts & Bursar Desk</p>
              </div>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="p-5 space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-blue-900 block">
                    {selectedStudentForPay.firstName} {selectedStudentForPay.lastName}
                  </span>
                  <span className="text-blue-700 font-mono text-[11px]">
                    {selectedStudentForPay.admissionNo} · {selectedStudentForPay.grade}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-blue-600 block">Current Balance</span>
                  <span className="font-bold font-mono text-rose-700">
                    KES {selectedStudentForPay.feeBalance.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount to Pay (KES) *</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-bold font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method *</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none font-medium"
                  >
                    <option value="M-Pesa">M-Pesa Paybill</option>
                    <option value="Bank Slip">Direct Bank Deposit</option>
                    <option value="Cash">Cash at Bursar</option>
                    <option value="Cheque">Banker's Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Transaction Reference *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. QKX49921LA"
                    value={payReference}
                    onChange={(e) => setPayReference(e.target.value)}
                    className="w-full px-3 py-1.5 font-mono border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Narration / Payment Details</label>
                <input
                  type="text"
                  value={payDescription}
                  onChange={(e) => setPayDescription(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold shadow-xs"
                >
                  Generate Official Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
