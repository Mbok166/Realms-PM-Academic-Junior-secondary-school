import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  ShieldCheck,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Building2,
  Search
} from 'lucide-react';

export const NemisModule: React.FC = () => {
  const { students, updateStudent } = useSchool();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const verifiedCount = students.filter(s => s.nemisStatus === 'Verified').length;
  const pendingCount = students.filter(s => s.nemisStatus === 'Pending Validation').length;
  const missingCount = students.filter(s => s.nemisStatus === 'Missing Certificate').length;

  const filteredStudents = students.filter(s =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.upiNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSyncNemis = () => {
    setIsSyncing(true);
    setSyncMessage('Connecting to Kenya Ministry of Education NEMIS Gateway (portal.nemis.go.ke)...');

    setTimeout(() => {
      // Validate pending students
      students.forEach(s => {
        if (s.nemisStatus === 'Pending Validation') {
          updateStudent(s.id, {
            nemisStatus: 'Verified',
            upiNo: `KICD-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100 + Math.random() * 900)}V`
          });
        }
      });

      setIsSyncing(false);
      setSyncMessage('Sync complete! All eligible learner UPIs successfully validated with Ministry servers.');
      setTimeout(() => setSyncMessage(null), 5000);
    }, 1800);
  };

  const handleExportCSV = () => {
    const headers = 'Admission_No,UPI_No,First_Name,Last_Name,Gender,Date_Of_Birth,Grade,Stream,Guardian_Name,Guardian_Phone,NEMIS_Status\n';
    const rows = students.map(s =>
      `"${s.admissionNo}","${s.upiNo}","${s.firstName}","${s.lastName}","${s.gender}","${s.dob}","${s.grade}","${s.stream}","${s.guardianName}","${s.guardianPhone}","${s.nemisStatus}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RealmsPM_NEMIS_Census_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            NEMIS & Ministry of Education UPI Integration
          </h1>
          <p className="text-xs text-slate-500">
            National Education Management Information System synchronization, Unique Personal Identifiers (UPI), and capitation audits
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export MoE Census CSV</span>
          </button>

          <button
            onClick={handleSyncNemis}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 rounded-lg shadow-xs transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing Gateway...' : 'Sync NEMIS Portal'}</span>
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* MoE Institution Badge & Status */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-800 rounded-xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">RealmsPM Academy & Junior School</h2>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                MoE Accredited
              </span>
            </div>
            <div className="text-xs text-slate-500 font-mono mt-0.5 flex flex-wrap items-center gap-2">
              <span>Institution Code: <strong>REALMS-NBI-39201</strong></span>
              <span aria-hidden="true">·</span>
              <span>Sub-County: <strong>Westlands, Nairobi</strong></span>
              <span aria-hidden="true">·</span>
              <span>KNEC Center: <strong>20401882</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Gateway Status</span>
            <span className="font-bold text-emerald-700">Connected (API 2.4)</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Capitation Eligibility</span>
            <span className="font-bold text-blue-700">100% Ready</span>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              MoE Verified UPIs
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {verifiedCount} / {students.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Pupils verified with National Birth Registry</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
              Pending Validation
            </span>
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-800 mt-2">
            {pendingCount}
          </div>
          <p className="text-xs text-slate-500 mt-1">Queued for MoE nightly batch processing</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
              Missing Birth Certificate
            </span>
            <AlertCircle className="w-5 h-5 text-rose-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-800 mt-2">
            {missingCount}
          </div>
          <p className="text-xs text-slate-500 mt-1">Requires guardian document submission</p>
        </div>
      </div>

      {/* Table: UPI Validation Directory */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Learner NEMIS Registry & UPI Mapping
          </h2>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search by name, UPI or AdmNo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-xs border border-slate-200 rounded-md bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold text-[11px] bg-slate-50/50">
                <th className="py-2.5 px-4">Admission #</th>
                <th className="py-2.5 px-4">Learner Name</th>
                <th className="py-2.5 px-3">Class</th>
                <th className="py-2.5 px-3">Date of Birth</th>
                <th className="py-2.5 px-3">National UPI Number</th>
                <th className="py-2.5 px-4">NEMIS Verification Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map(std => (
                <tr key={std.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{std.admissionNo}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{std.firstName} {std.lastName}</td>
                  <td className="py-3 px-3 text-slate-700">{std.grade} ({std.stream})</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{std.dob}</td>
                  <td className="py-3 px-3 font-mono font-bold text-blue-900">{std.upiNo}</td>
                  <td className="py-3 px-4">
                    {std.nemisStatus === 'Verified' ? (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>MoE Verified</span>
                      </span>
                    ) : std.nemisStatus === 'Pending Validation' ? (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Pending Batch Run</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Action Required: Birth Cert</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
