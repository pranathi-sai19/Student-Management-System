import React, { useState, useMemo } from 'react';
import { Calendar, CheckCircle, XCircle, Users } from 'lucide-react';
import { Student, AttendanceRecord } from '../types/student';
import { calculateAttendancePercentage } from '../utils/calculations';

interface AttendanceTrackerProps {
  students: Student[];
  attendance: AttendanceRecord[];
  onMarkAttendance: (studentId: string, date: string, present: boolean) => void;
}

const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  students,
  attendance,
  onMarkAttendance
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const todayAttendance = useMemo(() => {
    return attendance.filter(a => a.date === selectedDate);
  }, [attendance, selectedDate]);

  const getStudentAttendance = (studentId: string) => {
    return todayAttendance.find(a => a.studentId === studentId);
  };

  const stats = useMemo(() => {
    const present = todayAttendance.filter(a => a.present).length;
    const absent = todayAttendance.filter(a => !a.present).length;
    const notMarked = students.length - todayAttendance.length;
    
    return { present, absent, notMarked };
  }, [todayAttendance, students]);

  const handleAttendanceChange = (studentId: string, present: boolean) => {
    onMarkAttendance(studentId, selectedDate, present);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Attendance Tracker</h1>
        <div className="flex items-center space-x-4">
          <Calendar className="h-5 w-5 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Present</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{stats.present}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Absent</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{stats.absent}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Users className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Not Marked</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{stats.notMarked}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{students.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Attendance for {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
        </div>

        {students.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No students found</h3>
            <p className="text-gray-600 dark:text-gray-400">Add some students first to track their attendance.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-600">
            {students.map((student) => {
              const studentAttendance = getStudentAttendance(student.id);
              const overallAttendance = calculateAttendancePercentage(student.id, attendance);
              
              return (
                <div key={student.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {student.name}
                        </h4>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Overall: {overallAttendance}%
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {student.course} • Year {student.year} • {student.email}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 ml-6">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`attendance-${student.id}`}
                          checked={studentAttendance?.present === true}
                          onChange={() => handleAttendanceChange(student.id, true)}
                          className="text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">Present</span>
                      </label>
                      
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`attendance-${student.id}`}
                          checked={studentAttendance?.present === false}
                          onChange={() => handleAttendanceChange(student.id, false)}
                          className="text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">Absent</span>
                      </label>
                      
                      {!studentAttendance && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 italic">Not marked</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceTracker;