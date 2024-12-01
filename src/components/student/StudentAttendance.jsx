import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Check, X, MapPin, Calendar, Loader } from 'lucide-react';
import Button from '../common/Button';
import { getCurrentLocation, isWithinRadius, parseLocationString } from '../../utils/location';
import { addNotification } from '../common/Notification';

const ATTENDANCE_RADIUS = 100; // meters

export default function StudentAttendance() {
  const { classId } = useParams();
  const { user } = useAuth();
  const [class_, setClass] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [todayRecord, setTodayRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [classId, user]);

  const loadData = () => {
    // Load class details
    const classes = JSON.parse(localStorage.getItem('classes') || '[]');
    const targetClass = classes.find((c) => c.id === classId);
    if (targetClass) {
      setClass(targetClass);
    } else {
      setError('Class not found');
    }

    // Load attendance records
    const records = JSON.parse(localStorage.getItem('attendance') || '[]');
    const classRecords = records.filter((r) => 
      r.classId === classId && r.studentId === user?.id
    );
    setAttendance(classRecords);

    // Check today's record
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = classRecords.find((r) => r.date === today);
    setTodayRecord(todayRecord || null);
  };

  const handleAttendance = async (present) => {
    if (!user || !classId || !class_) return;
    setIsLoading(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      const classLocation = parseLocationString(class_.location);

      if (present) {
        const currentLocation = await getCurrentLocation();
        
        if (!classLocation) {
          throw new Error('Invalid class location');
        }

        const withinRange = isWithinRadius(currentLocation, classLocation, ATTENDANCE_RADIUS);
        
        if (!withinRange) {
          addNotification('You are not within range of the class location', 'error');
          return;
        }

        addNotification('Attendance marked successfully!', 'success');
      }

      const newRecord = {
        id: crypto.randomUUID(),
        classId,
        studentId: user.id,
        date: today,
        present,
        location: present ? JSON.stringify(await getCurrentLocation()) : undefined
      };

      // Update localStorage
      const records = JSON.parse(localStorage.getItem('attendance') || '[]');
      const updatedRecords = [
        ...records.filter((r) => 
          !(r.classId === classId && r.studentId === user.id && r.date === today)
        ),
        newRecord
      ];

      localStorage.setItem('attendance', JSON.stringify(updatedRecords));
      setTodayRecord(newRecord);
      setAttendance(updatedRecords.filter(r => r.classId === classId && r.studentId === user.id));

    } catch (err) {
      addNotification(err instanceof Error ? err.message : 'Failed to mark attendance', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!class_) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">{class_.name}</h1>
        
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={16} />
            <span>{class_.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={16} />
            <span>{class_.schedule}</span>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Today's Attendance</h2>
          
          {todayRecord ? (
            <div className={`p-4 rounded-md ${
              todayRecord.present ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {todayRecord.present ? 'Present' : 'Absent'} - Marked at {new Date(todayRecord.date).toLocaleDateString()}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">Mark your attendance for today:</p>
              <div className="flex gap-4">
                <Button
                  onClick={() => handleAttendance(true)}
                  disabled={isLoading}
                  className="flex-1"
                  icon={<Check size={20} />}
                >
                  Present
                </Button>
                <Button
                  onClick={() => handleAttendance(false)}
                  disabled={isLoading}
                  variant="danger"
                  className="flex-1"
                  icon={<X size={20} />}
                >
                  Absent
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Attendance History</h2>
          <div className="space-y-2">
            {attendance
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((record) => (
                <div
                  key={record.id}
                  className={`p-3 rounded-md ${
                    record.present ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{new Date(record.date).toLocaleDateString()}</span>
                    <span>{record.present ? 'Present' : 'Absent'}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}