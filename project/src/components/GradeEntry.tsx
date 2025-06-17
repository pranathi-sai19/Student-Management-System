import React, { useState, useMemo } from 'react';
import { Plus, Save, BookOpen, Trophy } from 'lucide-react';
import { Student, Grade } from '../types/student';
import { calculateStudentGPA, calculateGrade } from '../utils/calculations';

interface GradeEntryProps {
  students: Student[];
  grades: Grade[];
  onAddGrade: (grade: Grade) => void;
}

const GradeEntry: React.FC<GradeEntryProps> = ({ students, grades, onAddGrade }) => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [subject, setSubject] = useState('');
  const [marks, setMarks] = useState('');
  const [maxMarks, setMaxMarks] = useState('100');

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'English',
    'History',
    'Geography',
    'Economics',
    'Business Studies'
  ];

  const studentGrades = useMemo(() => {
    return students.map(student => ({
      ...student,
      grades: grades.filter(g => g.studentId === student.id),
      ...calculateStudentGPA(student.id, grades)
    }));
  }, [students, grades]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !subject || !marks || !maxMarks) {
      alert('Please fill in all fields');
      return;
    }

    const marksNum = parseFloat(marks);
    const maxMarksNum = parseFloat(maxMarks);

    if (marksNum < 0 || marksNum > maxMarksNum) {
      alert('Marks should be between 0 and maximum marks');
      return;
    }

    const grade: Grade = {
      studentId: selectedStudent,
      subject,
      marks: marksNum,
      maxMarks: maxMarksNum
    };

    onAddGrade(grade);
    
    // Reset form
    setSubject('');
    setMarks('');
    setMaxMarks('100');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Grade Entry</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grade Entry Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add Grade</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Student
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select a student</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} - {student.course}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select subject</option>
                  {subjects.map(subj => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Marks Obtained
                  </label>
                  <input
                    type="number"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    min="0"
                    step="0.5"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="85"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maximum Marks
                  </label>
                  <input
                    type="number"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(e.target.value)}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="100"
                    required
                  />
                </div>
              </div>

              {marks && maxMarks && parseFloat(marks) <= parseFloat(maxMarks) && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Percentage: {Math.round((parseFloat(marks) / parseFloat(maxMarks)) * 100)}%
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Grade: {calculateGrade(Math.round((parseFloat(marks) / parseFloat(maxMarks)) * 100))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Add Grade</span>
              </button>
            </form>
          </div>
        </div>

        {/* Student Grades List */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Student Grades</h3>
            </div>

            {studentGrades.length === 0 ? (
              <div className="p-12 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No students found</h3>
                <p className="text-gray-600 dark:text-gray-400">Add some students first to enter their grades.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-600 max-h-96 overflow-y-auto">
                {studentGrades.map((student) => (
                  <div key={student.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {student.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {student.course} • Year {student.year}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className={`px-2 py-1 text-sm font-semibold rounded-full ${
                            student.grade === 'A+' || student.grade === 'A' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                            student.grade === 'B' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                            student.grade === 'C' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                            student.grade === 'D' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' :
                            student.grade === 'F' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {student.grade}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          GPA: {student.gpa} • {student.percentage}%
                        </div>
                      </div>
                    </div>

                    {student.grades.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {student.grades.map((grade, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {grade.subject}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {grade.marks}/{grade.maxMarks}
                              </span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {Math.round((grade.marks / grade.maxMarks) * 100)}%
                              </span>
                              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                {calculateGrade(Math.round((grade.marks / grade.maxMarks) * 100))}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        No grades recorded yet
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeEntry;