import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserPlus } from 'lucide-react';

export default function StudentRegistration() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [class_, setClass] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Find the class with matching registration token
    const classes = JSON.parse(localStorage.getItem('classes') || '[]');
    const targetClass = classes.find((c) => c.registrationLink?.includes(token));
    if (targetClass) {
      setClass(targetClass);
    } else {
      setError('Invalid registration link');
    }
  }, [token]);

  const handleRegistration = () => {
    if (!user || !class_) return;

    // Get existing students
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    let student = students.find((s) => s.id === user.id);

    if (student) {
      // Update existing student's classes
      if (!student.classIds.includes(class_.id)) {
        student.classIds.push(class_.id);
      }
    } else {
      // Create new student record
      student = {
        id: user.id,
        name: user.name,
        email: user.email,
        classIds: [class_.id]
      };
      students.push(student);
    }

    localStorage.setItem('students', JSON.stringify(students));
    setSuccess(true);

    // Redirect to attendance page after short delay
    setTimeout(() => {
      navigate(`/attendance/${class_.id}`);
    }, 2000);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!class_) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <div className="text-center">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="text-center mb-6">
          <UserPlus className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-4 text-2xl font-bold">Class Registration</h2>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{class_.name}</h3>
            <p className="text-gray-600">Location: {class_.location}</p>
            <p className="text-gray-600">Schedule: {class_.schedule}</p>
          </div>

          {success ? (
            <div className="bg-green-50 text-green-700 p-4 rounded-md">
              Successfully registered! Redirecting...
            </div>
          ) : (
            <button
              onClick={handleRegistration}
              className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition-colors"
            >
              Register for Class
            </button>
          )}
        </div>
      </div>
    </div>
  );
}