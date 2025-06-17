import React from 'react';
import { Users, UserCheck, Trophy, BookOpen } from 'lucide-react';
import { Student, AttendanceRecord, Grade, StudentStats } from '../types/student';
import { calculateAttendancePercentage, calculateStudentGPA } from '../utils/calculations';

interface DashboardProps {
  students: Student[];
  attendance: AttendanceRecord[];
  grades: Grade[];
}

const Dashboard: React.FC<DashboardProps> = ({ students, attendance, grades }) => {
  const today = new Date().toISOString().split('T')[0];
  
  const stats: StudentStats = {
    totalStudents: students.length,
    presentToday: attendance.filter(a => a.date === today && a.present).length,
    averageGrade: students.length > 0 
      ? students.reduce((sum, student) => {
          const { gpa } = calculateStudentGPA(student.id, grades);
          return sum + gpa;
        }, 0) / students.length
      : 0,
    courseDistribution: students.reduce((acc, student) => {
      acc[student.course] = (acc[student.course] || 0) + 1;
      return acc;
    }, {} as { [course: string]: number })
  };

  const StatCard: React.FC<{
    icon: React.ElementType;
    title: string;
    value: string | number;
    color: string;
  }> = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );

  const topStudents = students
    .map(student => ({
      ...student,
      gpa: calculateStudentGPA(student.id, grades).gpa,
      attendance: calculateAttendancePercentage(student.id, attendance)
    }))
    .sort((a, b) => b.gpa - a.gpa)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Students"
          value={stats.totalStudents}
          color="bg-blue-500"
        />
        <StatCard
          icon={UserCheck}
          title="Present Today"
          value={stats.presentToday}
          color="bg-green-500"
        />
        <StatCard
          icon={Trophy}
          title="Average GPA"
          value={stats.averageGrade.toFixed(1)}
          color="bg-purple-500"
        />
        <StatCard
          icon={BookOpen}
          title="Active Courses"
          value={Object.keys(stats.courseDistribution).length}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Course Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.courseDistribution).map(([course, count]) => (
              <div key={course} className="flex items-center justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">{course}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div 
                      className="h-2 bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${(count / stats.totalStudents) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Students */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Performing Students
          </h3>
          <div className="space-y-3">
            {topStudents.map((student, index) => (
              <div key={student.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white
                    ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'}
                  `}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{student.course}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">{student.gpa.toFixed(1)} GPA</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{student.attendance}% Attendance</p>
                </div>
              </div>
            ))}
            {topStudents.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No student data available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;