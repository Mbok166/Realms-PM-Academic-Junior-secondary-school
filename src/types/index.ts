export type GradeLevel = 
  | 'PP1' 
  | 'PP2' 
  | 'Grade 1' 
  | 'Grade 2' 
  | 'Grade 3' 
  | 'Grade 4' 
  | 'Grade 5' 
  | 'Grade 6' 
  | 'Grade 7 (JSS)' 
  | 'Grade 8 (JSS)' 
  | 'Grade 9 (JSS)';

export type Stream = 'Alpha' | 'Beta' | 'Emerald' | 'Gold';

export type PerformanceLevel = 'EE' | 'ME' | 'AE' | 'BE';

export interface PerformanceLevelDetail {
  code: PerformanceLevel;
  label: string;
  scoreRange: string;
  description: string;
  color: string;
}

export interface Student {
  id: string;
  admissionNo: string;
  upiNo: string; // NEMIS Unique Personal Identifier
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female';
  grade: GradeLevel;
  stream: Stream;
  dob: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  residence: string;
  boardingStatus: 'Day' | 'Boarder';
  dormitoryId?: string;
  bedNo?: string;
  feeBalance: number;
  totalBilled: number;
  attendanceRate: number; // percentage
  nemisStatus: 'Verified' | 'Pending Validation' | 'Missing Certificate';
  allergies?: string;
  photoUrl?: string;
  enrollmentDate: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  grade: GradeLevel;
  stream: Stream;
  status: AttendanceStatus;
  notes?: string;
}

export interface FeeTransaction {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  amount: number;
  paymentMethod: 'M-Pesa' | 'Bank Slip' | 'Cash' | 'Cheque';
  reference: string;
  date: string;
  term: string;
  academicYear: string;
  recordedBy: string;
  description: string;
}

export interface FeeItem {
  id: string;
  grade: GradeLevel;
  term: string;
  tuition: number;
  boarding: number;
  lunch: number;
  activity: number;
  examination: number;
  medicalInsurance: number;
  total: number;
}

export interface CBCSubjectAssessment {
  subject: string;
  strand: string;
  subStrand: string;
  rating: PerformanceLevel;
  score: number; // e.g. 78
  teacherRemarks: string;
}

export interface CoreCompetencyRating {
  competency: string; // e.g. 'Communication and Collaboration', 'Critical Thinking'
  rating: PerformanceLevel;
  evidence: string;
}

export interface StudentReportCard {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  upiNo: string;
  grade: GradeLevel;
  stream: Stream;
  term: string;
  academicYear: string;
  assessments: CBCSubjectAssessment[];
  coreCompetencies: CoreCompetencyRating[];
  valuesDemonstrated: { value: string; rating: PerformanceLevel }[];
  classTeacherRemarks: string;
  headTeacherRemarks: string;
  openingDateNextTerm: string;
  daysPresent: number;
  totalDays: number;
  coCurricularActivities: string[];
}

export interface SchemeOfWorkItem {
  id: string;
  grade: GradeLevel;
  subject: string;
  term: string;
  week: number;
  lesson: number;
  strand: string;
  subStrand: string;
  specificLearningOutcomes: string;
  keyInquiryQuestions: string;
  learningExperiences: string;
  learningResources: string;
  assessmentMethods: string;
  reflection: string;
}

export interface TimetableSlot {
  id: string;
  grade: GradeLevel;
  stream: Stream;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  period: number; // 1 to 8
  time: string; // "08:20 - 09:00"
  subject: string;
  teacherName: string;
  room: string;
}

export interface ParentMessage {
  id: string;
  title: string;
  messageType: 'Fee Reminder' | 'Academic Report' | 'AGM / Event' | 'Emergency' | 'General Notice';
  recipientGroup: 'All Parents' | 'Boarders Only' | 'JSS Parents' | 'Fee Defaulters' | 'Specific Stream';
  targetCount: number;
  messageBody: string;
  sentAt: string;
  status: 'Delivered' | 'Pending' | 'Queued';
  sender: string;
}

export interface Dormitory {
  id: string;
  name: string;
  wing: 'North Wing' | 'South Wing' | 'East Wing' | 'West Wing';
  gender: 'Boys' | 'Girls';
  capacity: number;
  occupied: number;
  houseMaster: string;
  matronPhone: string;
  prefectName: string;
}

export interface Exeat {
  id: string;
  passNo: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  dormitory: string;
  grade: GradeLevel;
  reason: 'Medical' | 'Family Emergency' | 'School Competition' | 'Mid-Term Break';
  departureDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  guardianName: string;
  guardianPhone: string;
  approvedBy: string;
  status: 'Active' | 'Returned' | 'Overdue';
}

export interface ClinicVisit {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  grade: GradeLevel;
  date: string;
  time: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  medicationDispensed: string;
  nurseInCharge: string;
  temperature: string;
  bloodPressure: string;
  referralRequired: boolean;
  referralFacility?: string;
  status: 'Admitted' | 'Discharged' | 'Referred';
}

export interface StaffMember {
  id: string;
  staffId: string;
  tscNumber: string;
  fullName: string;
  role: 'Principal' | 'Deputy Principal' | 'Senior Teacher' | 'Class Teacher' | 'Subject Teacher' | 'Bursar' | 'School Nurse' | 'Hostel Warden';
  department: 'Languages' | 'STEM & Sciences' | 'Humanities & Social Studies' | 'Creative Arts & Technical' | 'Administration' | 'Student Welfare';
  subjects: string[];
  assignedGrades: GradeLevel[];
  weeklyPeriods: number;
  phone: string;
  email: string;
  status: 'Active' | 'On Leave';
  dateJoined: string;
}
