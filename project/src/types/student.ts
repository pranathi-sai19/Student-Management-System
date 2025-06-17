export interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  year: number;
  registrationDate: string;
}

export interface AttendanceRecord {
  studentId: string;
  date: string;
  present: boolean;
}

export interface Grade {
  studentId: string;
  subject: string;
  marks: number;
  maxMarks: number;
}

export interface StudentStats {
  totalStudents: number;
  presentToday: number;
  averageGrade: number;
  courseDistribution: { [course: string]: number };
}