import { Student, AttendanceRecord, Grade } from '../types/student';

export const calculateAttendancePercentage = (
  studentId: string,
  attendance: AttendanceRecord[]
): number => {
  const studentAttendance = attendance.filter(a => a.studentId === studentId);
  if (studentAttendance.length === 0) return 0;
  
  const presentDays = studentAttendance.filter(a => a.present).length;
  return Math.round((presentDays / studentAttendance.length) * 100);
};

export const calculateGrade = (percentage: number): string => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
};

export const calculateStudentGPA = (
  studentId: string,
  grades: Grade[]
): { percentage: number; grade: string; gpa: number } => {
  const studentGrades = grades.filter(g => g.studentId === studentId);
  if (studentGrades.length === 0) return { percentage: 0, grade: 'N/A', gpa: 0 };
  
  const totalMarks = studentGrades.reduce((sum, g) => sum + g.marks, 0);
  const totalMaxMarks = studentGrades.reduce((sum, g) => sum + g.maxMarks, 0);
  
  const percentage = Math.round((totalMarks / totalMaxMarks) * 100);
  const grade = calculateGrade(percentage);
  const gpa = percentage / 25; // Convert to 4.0 scale
  
  return { percentage, grade, gpa: Math.round(gpa * 100) / 100 };
};

export const exportToCSV = (students: Student[], attendance: AttendanceRecord[], grades: Grade[]) => {
  const headers = ['ID', 'Name', 'Email', 'Course', 'Year', 'Attendance %', 'Grade', 'GPA'];
  const rows = students.map(student => {
    const attendancePercentage = calculateAttendancePercentage(student.id, attendance);
    const { grade, gpa } = calculateStudentGPA(student.id, grades);
    
    return [
      student.id,
      student.name,
      student.email,
      student.course,
      student.year,
      `${attendancePercentage}%`,
      grade,
      gpa
    ];
  });
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
};