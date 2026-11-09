import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { ClinicVisit, Student } from '../../types';
import {
  HeartPulse,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Thermometer,
  Activity,
  FilePlus,
  Search
} from 'lucide-react';

export const ClinicModule: React.FC = () => {
  const { clinicVisits, addClinicVisit, students } = useSchool();

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [medication, setMedication] = useState('');
  const [temperature, setTemperature] = useState('37.1°C');
  const [bloodPressure, setBloodPressure] = useState('110/70 mmHg');
  const [referralRequired, setReferralRequired] = useState(false);
  const [nurseInCharge, setNurseInCharge] = useState('Sister Beatrice Wanjiku (RN)');

  const allergyStudents = students.filter(s => s.allergies && s.allergies.trim().length > 0);

  const handleCreateVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const std = students.find(s => s.id === selectedStudentId);
    if (!std) return;

    addClinicVisit({
      studentId: std.id,
      studentName: `${std.firstName} ${std.lastName}`,
      admissionNo: std.admissionNo,
      grade: std.grade,
      symptoms,
      diagnosis,
      treatment,
      medicationDispensed: medication,
      nurseInCharge,
      temperature,
      bloodPressure,
      referralRequired,
      status: referralRequired ? 'Referred' : 'Discharged'
    });

    setIsLogModalOpen(false);
    setSymptoms('');
    setDiagnosis('');
    setTreatment('');
    setMedication('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Clinic & Infirmary Health Records</h1>
          <p className="text-xs text-slate-500">
            Learner medical profiles, outpatient treatment logs, allergy watchlists, and triage
          </p>
        </div>

        <button
          onClick={() => setIsLogModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Log Clinic Visit</span>
        </button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Logged Visits
            </span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {clinicVisits.length} Records
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Term 1 Outpatient</div>
          </div>
          <div className="p-2.5 bg-rose-50 text-rose-700 rounded-lg">
            <HeartPulse className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
              Allergy Watchlist
            </span>
            <div className="text-2xl font-bold font-mono text-amber-800 mt-1">
              {allergyStudents.length} Pupils
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Asthma / Food allergies</div>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Resident Medical Officer
            </span>
            <div className="text-sm font-bold text-slate-900 mt-1">
              Sr. Beatrice Wanjiku (RN)
            </div>
            <div className="text-xs text-emerald-600 mt-0.5">Infirmary Bay 1 · On Duty</div>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Visits Log & Medical Alert Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Visit Logs */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Infirmary Consultations & Prescriptions
            </h2>
            <span className="text-[11px] text-slate-500 font-mono">{clinicVisits.length} entries</span>
          </div>

          <div className="divide-y divide-slate-100">
            {clinicVisits.map(visit => (
              <div key={visit.id} className="p-4 hover:bg-slate-50/50 transition-colors text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{visit.studentName}</span>
                    <span className="text-slate-400 font-mono text-[11px]">({visit.admissionNo})</span>
                    <span className="text-slate-300" aria-hidden="true">·</span>
                    <span className="text-slate-500">{visit.grade}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-slate-500">{visit.date} {visit.time}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      visit.status === 'Discharged' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {visit.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-700 block">Symptoms & Presentation:</span>
                    <span>{visit.symptoms}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 block">Diagnosis:</span>
                    <span className="font-medium text-slate-900">{visit.diagnosis}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                  <div className="text-slate-600">
                    <strong>Rx / Treatment:</strong> {visit.treatment} {visit.medicationDispensed && `(${visit.medicationDispensed})`}
                  </div>
                  <div className="text-slate-400 font-mono">
                    Vitals: {visit.temperature} · {visit.bloodPressure}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Allergy Watchlist */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              High-Risk Medical Watchlist
            </h2>
          </div>

          <div className="space-y-3">
            {allergyStudents.map(s => (
              <div key={s.id} className="p-3 bg-amber-50/50 rounded-lg border border-amber-200/70 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950">{s.firstName} {s.lastName}</span>
                </div>
                <div className="text-[11px] text-amber-800 font-medium">
                  {s.allergies}
                </div>
                <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between pt-1">
                  <span>Guardian: {s.guardianName}</span>
                  <span>{s.guardianPhone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Log Visit Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden text-xs">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold">Record Infirmary Consultation</h2>
                <p className="text-[11px] text-rose-300">RealmsPM Student Wellness Clinic</p>
              </div>
              <button onClick={() => setIsLogModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateVisit} className="p-5 space-y-3 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Learner *</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none font-semibold text-slate-800"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.admissionNo}) — {s.grade}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Temperature</label>
                  <input
                    type="text"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Blood Pressure</label>
                  <input
                    type="text"
                    value={bloodPressure}
                    onChange={(e) => setBloodPressure(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Presenting Symptoms *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Headache, fever, stomach upset"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Diagnosis *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acute tonsillitis, mild dehydration"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Treatment Administered</label>
                  <input
                    type="text"
                    placeholder="e.g. Rest in bed, oral rehydration"
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Medication Dispensed</label>
                  <input
                    type="text"
                    placeholder="e.g. Paracetamol 500mg"
                    value={medication}
                    onChange={(e) => setMedication(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="refReq"
                  checked={referralRequired}
                  onChange={(e) => setReferralRequired(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="refReq" className="text-slate-700 font-semibold cursor-pointer">
                  Require Referral to Sub-County Hospital / Guardian Collection?
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-semibold shadow-xs"
                >
                  Save Clinic Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
