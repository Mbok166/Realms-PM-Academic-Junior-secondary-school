import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  AttendanceRecord,
  FeeTransaction,
  FeeItem,
  StudentReportCard,
  SchemeOfWorkItem,
  TimetableSlot,
  ParentMessage,
  Dormitory,
  Exeat,
  ClinicVisit,
  StaffMember
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_STAFF,
  INITIAL_FEE_STRUCTURES,
  INITIAL_TRANSACTIONS,
  INITIAL_DORMITORIES,
  INITIAL_EXEATS,
  INITIAL_CLINIC_VISITS,
  INITIAL_MESSAGES,
  INITIAL_SCHEMES_OF_WORK,
  INITIAL_TIMETABLE_SLOTS,
  INITIAL_REPORT_CARD
} from '../data/mockData';

export type ActiveModule =
  | 'dashboard'
  | 'students'
  | 'attendance'
  | 'fees'
  | 'cbc'
  | 'timetables'
  | 'communication'
  | 'boarding'
  | 'clinic'
  | 'staff'
  | 'nemis';

export type UserRole = 'Principal / Admin' | 'Class Teacher' | 'Bursar' | 'School Nurse' | 'Hostel Warden' | 'Student / Learner';

export const canAccessFinancesRole = (role: UserRole): boolean => {
  return role === 'Principal / Admin' || role === 'Bursar';
};

export interface PrintDocumentData {
  type: 'reportCard' | 'feeReceipt' | 'exeatPass' | 'schemeOfWork';
  title: string;
  payload: any;
}

interface SchoolContextType {
  activeModule: ActiveModule;
  setActiveModule: (m: ActiveModule) => void;
  userRole: UserRole;
  setUserRole: (r: UserRole) => void;
  canAccessFinances: boolean;
  isStudentRole: boolean;
  currentStudentId: string;
  setCurrentStudentId: (id: string) => void;
  currentTerm: string;
  academicYear: string;

  // Students
  students: Student[];
  addStudent: (s: Omit<Student, 'id' | 'admissionNo' | 'enrollmentDate' | 'feeBalance' | 'attendanceRate'>) => void;
  updateStudent: (id: string, s: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  selectedStudent: Student | null;
  setSelectedStudent: (s: Student | null) => void;

  // Attendance
  attendanceRecords: AttendanceRecord[];
  recordAttendance: (records: AttendanceRecord[]) => void;

  // Fees
  transactions: FeeTransaction[];
  feeStructures: FeeItem[];
  recordFeePayment: (payment: Omit<FeeTransaction, 'id' | 'receiptNo' | 'date'>) => FeeTransaction;

  // CBC Assessments & Report Cards
  reportCards: Record<string, StudentReportCard>;
  updateReportCard: (studentId: string, card: Partial<StudentReportCard>) => void;

  // Schemes & Timetables
  schemes: SchemeOfWorkItem[];
  addScheme: (scheme: Omit<SchemeOfWorkItem, 'id'>) => void;
  timetables: TimetableSlot[];
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
  deleteTimetableSlot: (id: string) => void;

  // Communication
  messages: ParentMessage[];
  sendMessage: (msg: Omit<ParentMessage, 'id' | 'sentAt' | 'status'>) => void;

  // Boarding & Exeats
  dormitories: Dormitory[];
  exeats: Exeat[];
  issueExeat: (ex: Omit<Exeat, 'id' | 'passNo' | 'status'>) => Exeat;
  returnExeat: (id: string) => void;

  // Clinic
  clinicVisits: ClinicVisit[];
  addClinicVisit: (v: Omit<ClinicVisit, 'id' | 'date' | 'time'>) => void;

  // Staff
  staff: StaffMember[];
  addStaff: (s: Omit<StaffMember, 'id' | 'staffId' | 'dateJoined'>) => void;

  // Print Preview
  activePrintDoc: PrintDocumentData | null;
  openPrintDoc: (doc: PrintDocumentData) => void;
  closePrintDoc: () => void;

  // Sidebar navigation visibility
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('Principal / Admin');
  const [currentTerm] = useState('Term 1');
  const [academicYear] = useState('2026');

  const [canAccessFinances] = useState(canAccessFinancesRole(userRole));
  const isStudentRole = userRole === 'Student / Learner';
  const [currentStudentId, setCurrentStudentId] = useState<string>('std-101');

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);
  const openSidebar = () => setIsSidebarOpen(true);

  // Persistence with localStorage
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('realmspm_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('realmspm_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [transactions, setTransactions] = useState<FeeTransaction[]>(() => {
    const saved = localStorage.getItem('realmspm_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [feeStructures] = useState<FeeItem[]>(INITIAL_FEE_STRUCTURES);

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('realmspm_attendance');
    if (saved) return JSON.parse(saved);
    // Initial attendance for today
    const today = new Date().toISOString().split('T')[0];
    return INITIAL_STUDENTS.map((s, idx) => ({
      id: `att-${s.id}-${today}`,
      studentId: s.id,
      date: today,
      grade: s.grade,
      stream: s.stream,
      status: idx === 2 ? 'Absent' : idx === 4 ? 'Late' : 'Present',
      notes: idx === 2 ? 'Reported flu by parent via SMS' : undefined
    }));
  });

  const [schemes, setSchemes] = useState<SchemeOfWorkItem[]>(() => {
    const saved = localStorage.getItem('realmspm_schemes');
    return saved ? JSON.parse(saved) : INITIAL_SCHEMES_OF_WORK;
  });

  const [timetables, setTimetables] = useState<TimetableSlot[]>(() => {
    const saved = localStorage.getItem('realmspm_timetables');
    return saved ? JSON.parse(saved) : INITIAL_TIMETABLE_SLOTS;
  });

  const [messages, setMessages] = useState<ParentMessage[]>(() => {
    const saved = localStorage.getItem('realmspm_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [dormitories] = useState<Dormitory[]>(INITIAL_DORMITORIES);

  const [exeats, setExeats] = useState<Exeat[]>(() => {
    const saved = localStorage.getItem('realmspm_exeats');
    return saved ? JSON.parse(saved) : INITIAL_EXEATS;
  });

  const [clinicVisits, setClinicVisits] = useState<ClinicVisit[]>(() => {
    const saved = localStorage.getItem('realmspm_clinic');
    return saved ? JSON.parse(saved) : INITIAL_CLINIC_VISITS;
  });

  const [reportCards, setReportCards] = useState<Record<string, StudentReportCard>>(() => {
    const saved = localStorage.getItem('realmspm_reports');
    return saved ? JSON.parse(saved) : { 'std-101': INITIAL_REPORT_CARD };
  });

  const [activePrintDoc, setActivePrintDoc] = useState<PrintDocumentData | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('realmspm_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('realmspm_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('realmspm_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('realmspm_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('realmspm_schemes', JSON.stringify(schemes));
  }, [schemes]);

  useEffect(() => {
    localStorage.setItem('realmspm_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('realmspm_exeats', JSON.stringify(exeats));
  }, [exeats]);

  useEffect(() => {
    localStorage.setItem('realmspm_clinic', JSON.stringify(clinicVisits));
  }, [clinicVisits]);

  useEffect(() => {
    localStorage.setItem('realmspm_reports', JSON.stringify(reportCards));
  }, [reportCards]);

  useEffect(() => {
    localStorage.setItem('realmspm_timetables', JSON.stringify(timetables));
  }, [timetables]);

  const addStudent = (sData: Omit<Student, 'id' | 'admissionNo' | 'enrollmentDate' | 'feeBalance' | 'attendanceRate'>) => {
    const nextSeq = students.length + 120;
    const admissionNo = `RPM-2026-${String(nextSeq).padStart(4, '0')}`;
    const newStudent: Student = {
      ...sData,
      id: `std-${Date.now()}`,
      admissionNo,
      enrollmentDate: new Date().toISOString().split('T')[0],
      feeBalance: sData.totalBilled,
      attendanceRate: 100
    };
    setStudents(prev => [newStudent, ...prev]);
  };

  const updateStudent = (id: string, sUpdate: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...sUpdate } : s));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const recordAttendance = (records: AttendanceRecord[]) => {
    setAttendanceRecords(prev => {
      const remaining = prev.filter(p => !records.some(r => r.studentId === p.studentId && r.date === p.date));
      return [...records, ...remaining];
    });
  };

  const recordFeePayment = (payment: Omit<FeeTransaction, 'id' | 'receiptNo' | 'date'>): FeeTransaction => {
    if (!canAccessFinances) {
      throw new Error('Unauthorized: Only the Principal and Bursar can record fee payments.');
    }
    const rctNum = `RPM-RCT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTxn: FeeTransaction = {
      ...payment,
      id: `txn-${Date.now()}`,
      receiptNo: rctNum,
      date: new Date().toISOString().split('T')[0],
    };

    setTransactions(prev => [newTxn, ...prev]);

    // Update student balance
    setStudents(prev => prev.map(std => {
      if (std.id === payment.studentId) {
        const newBalance = Math.max(0, std.feeBalance - payment.amount);
        return { ...std, feeBalance: newBalance };
      }
      return std;
    }));

    return newTxn;
  };

  const updateReportCard = (studentId: string, cardUpdate: Partial<StudentReportCard>) => {
    setReportCards(prev => {
      const existing = prev[studentId] || { ...INITIAL_REPORT_CARD, studentId };
      return {
        ...prev,
        [studentId]: { ...existing, ...cardUpdate }
      };
    });
  };

  const addScheme = (schData: Omit<SchemeOfWorkItem, 'id'>) => {
    const newSch: SchemeOfWorkItem = {
      ...schData,
      id: `sch-${Date.now()}`
    };
    setSchemes(prev => [newSch, ...prev]);
  };

  const addTimetableSlot = (slotData: Omit<TimetableSlot, 'id'>) => {
    const newSlot: TimetableSlot = {
      ...slotData,
      id: `tt-${Date.now()}`
    };
    setTimetables(prev => [newSlot, ...prev]);
  };

  const deleteTimetableSlot = (id: string) => {
    setTimetables(prev => prev.filter(t => t.id !== id));
  };

  const sendMessage = (msgData: Omit<ParentMessage, 'id' | 'sentAt' | 'status'>) => {
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newMsg: ParentMessage = {
      ...msgData,
      id: `msg-${Date.now()}`,
      sentAt: timeStr,
      status: 'Delivered'
    };
    setMessages(prev => [newMsg, ...prev]);
  };

  const issueExeat = (exData: Omit<Exeat, 'id' | 'passNo' | 'status'>): Exeat => {
    const passNo = `RPM-EXT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newEx: Exeat = {
      ...exData,
      id: `ext-${Date.now()}`,
      passNo,
      status: 'Active'
    };
    setExeats(prev => [newEx, ...prev]);
    return newEx;
  };

  const returnExeat = (id: string) => {
    const returnTime = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setExeats(prev => prev.map(e => e.id === id ? { ...e, status: 'Returned', actualReturnDate: returnTime } : e));
  };

  const addClinicVisit = (vData: Omit<ClinicVisit, 'id' | 'date' | 'time'>) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newV: ClinicVisit = {
      ...vData,
      id: `cln-${Date.now()}`,
      date: dateStr,
      time: timeStr
    };
    setClinicVisits(prev => [newV, ...prev]);
  };

  const addStaff = (sData: Omit<StaffMember, 'id' | 'staffId' | 'dateJoined'>) => {
    const nextSeq = staff.length + 10;
    const staffId = `RPM-T-${String(nextSeq).padStart(3, '0')}`;
    const newS: StaffMember = {
      ...sData,
      id: `stf-${Date.now()}`,
      staffId,
      dateJoined: new Date().toISOString().split('T')[0]
    };
    setStaff(prev => [newS, ...prev]);
  };

  const openPrintDoc = (doc: PrintDocumentData) => {
    if (doc.type === 'feeReceipt' && !canAccessFinances) {
      console.warn('Unauthorized access: Only the Principal and Bursar can view fee receipts.');
      return;
    }
    setActivePrintDoc(doc);
  };

  const closePrintDoc = () => {
    setActivePrintDoc(null);
  };

  return (
    <SchoolContext.Provider
      value={{
        activeModule,
        setActiveModule,
        userRole,
        setUserRole,
        canAccessFinances,
        isStudentRole,
        currentStudentId,
        setCurrentStudentId,
        currentTerm,
        academicYear,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        selectedStudent,
        setSelectedStudent,
        attendanceRecords,
        recordAttendance,
        transactions,
        feeStructures,
        recordFeePayment,
        reportCards,
        updateReportCard,
        schemes,
        addScheme,
        timetables,
        addTimetableSlot,
        deleteTimetableSlot,
        messages,
        sendMessage,
        dormitories,
        exeats,
        issueExeat,
        returnExeat,
        clinicVisits,
        addClinicVisit,
        staff,
        addStaff,
        activePrintDoc,
        openPrintDoc,
        closePrintDoc,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        closeSidebar,
        openSidebar
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
