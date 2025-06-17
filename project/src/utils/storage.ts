import { Student, AttendanceRecord, Grade } from '../types/student';

const STORAGE_KEYS = {
  STUDENTS: 'sms_students',
  ATTENDANCE: 'sms_attendance',
  GRADES: 'sms_grades',
  DARK_MODE: 'sms_dark_mode'
};

export const storage = {
  // Students
  getStudents: (): Student[] => {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return data ? JSON.parse(data) : [];
  },

  saveStudents: (students: Student[]) => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  addStudent: (student: Student) => {
    const students = storage.getStudents();
    students.push(student);
    storage.saveStudents(students);
  },

  updateStudent: (updatedStudent: Student) => {
    const students = storage.getStudents();
    const index = students.findIndex(s => s.id === updatedStudent.id);
    if (index !== -1) {
      students[index] = updatedStudent;
      storage.saveStudents(students);
    }
  },

  deleteStudent: (studentId: string) => {
    const students = storage.getStudents().filter(s => s.id !== studentId);
    storage.saveStudents(students);
    
    // Also delete related attendance and grades
    const attendance = storage.getAttendance().filter(a => a.studentId !== studentId);
    storage.saveAttendance(attendance);
    
    const grades = storage.getGrades().filter(g => g.studentId !== studentId);
    storage.saveGrades(grades);
  },

  // Attendance
  getAttendance: (): AttendanceRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return data ? JSON.parse(data) : [];
  },

  saveAttendance: (attendance: AttendanceRecord[]) => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  },

  markAttendance: (studentId: string, date: string, present: boolean) => {
    const attendance = storage.getAttendance();
    const existingIndex = attendance.findIndex(
      a => a.studentId === studentId && a.date === date
    );
    
    if (existingIndex !== -1) {
      attendance[existingIndex].present = present;
    } else {
      attendance.push({ studentId, date, present });
    }
    
    storage.saveAttendance(attendance);
  },

  // Grades
  getGrades: (): Grade[] => {
    const data = localStorage.getItem(STORAGE_KEYS.GRADES);
    return data ? JSON.parse(data) : [];
  },

  saveGrades: (grades: Grade[]) => {
    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
  },

  addGrade: (grade: Grade) => {
    const grades = storage.getGrades();
    const existingIndex = grades.findIndex(
      g => g.studentId === grade.studentId && g.subject === grade.subject
    );
    
    if (existingIndex !== -1) {
      grades[existingIndex] = grade;
    } else {
      grades.push(grade);
    }
    
    storage.saveGrades(grades);
  },

  // Dark Mode
  getDarkMode: (): boolean => {
    const data = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    if (data === null) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return JSON.parse(data);
  },

  setDarkMode: (darkMode: boolean) => {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(darkMode));
  }
};