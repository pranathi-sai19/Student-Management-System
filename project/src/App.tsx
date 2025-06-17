import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import AttendanceTracker from './components/AttendanceTracker';
import GradeEntry from './components/GradeEntry';
import { Student, AttendanceRecord, Grade } from './types/student';
import { storage } from './utils/storage';
import { exportToCSV } from './utils/calculations';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>(undefined);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load data on component mount
  useEffect(() => {
    setStudents(storage.getStudents());
    setAttendance(storage.getAttendance());
    setGrades(storage.getGrades());

    const savedDarkMode = storage.getDarkMode();
    setDarkMode(savedDarkMode);

    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Apply/remove dark mode dynamically
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    storage.setDarkMode(darkMode);
  }, [darkMode]);

  const handleSaveStudent = (student: Student) => {
    if (editingStudent) {
      storage.updateStudent(student);
    } else {
      storage.addStudent(student);
    }
    setStudents(storage.getStudents());
    setEditingStudent(undefined);
    setCurrentView('students');
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setCurrentView('add-student');
  };

  const handleDeleteStudent = (studentId: string) => {
    storage.deleteStudent(studentId);
    setStudents(storage.getStudents());
    setAttendance(storage.getAttendance());
    setGrades(storage.getGrades());
  };

  const handleMarkAttendance = (studentId: string, date: string, present: boolean) => {
    storage.markAttendance(studentId, date, present);
    setAttendance(storage.getAttendance());
  };

  const handleAddGrade = (grade: Grade) => {
    storage.addGrade(grade);
    setGrades(storage.getGrades());
  };

  const handleExportCSV = () => {
    exportToCSV(students, attendance, grades);
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    if (view !== 'add-student') {
      setEditingStudent(undefined);
    }
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard students={students} attendance={attendance} grades={grades} />;
      case 'students':
        return (
          <StudentList
            students={students}
            attendance={attendance}
            grades={grades}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
          />
        );
      case 'add-student':
        return (
          <StudentForm
            student={editingStudent}
            onSave={handleSaveStudent}
            onCancel={() => {
              setEditingStudent(undefined);
              setCurrentView('students');
            }}
          />
        );
      case 'attendance':
        return (
          <AttendanceTracker
            students={students}
            attendance={attendance}
            onMarkAttendance={handleMarkAttendance}
          />
        );
      case 'grades':
        return (
          <GradeEntry
            students={students}
            grades={grades}
            onAddGrade={handleAddGrade}
          />
        );
      default:
        return <Dashboard students={students} attendance={attendance} grades={grades} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors w-full">
      <div className="flex w-full">
        <Sidebar
          currentView={currentView}
          onViewChange={handleViewChange}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onExportCSV={handleExportCSV}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
        />

        <div className="flex-1 w-full min-h-screen lg:ml-64">
          {/* Mobile header */}
          <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Student Management System
              </h1>
              <div className="w-10" />
            </div>
          </div>

          {/* Main content */}
          <main className="p-6">{renderCurrentView()}</main>
        </div>
      </div>
    </div>
  );
}

export default App;
