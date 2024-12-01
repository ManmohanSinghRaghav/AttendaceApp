import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Plus, Users, Calendar, MapPin, Copy } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [showNewClassForm, setShowNewClassForm] = useState(false);
  const [newClass, setNewClass] = useState({
    name: '',
    location: '',
    schedule: ''
  });

  useEffect(() => {
    const storedClasses = JSON.parse(localStorage.getItem('classes') || '[]');
    setClasses(storedClasses.filter((c) => c.teacherId === user?.id));
  }, [user]);

  const handleCreateClass = () => {
    const classData = {
      id: crypto.randomUUID(),
      teacherId: user?.id || '',
      name: newClass.name,
      location: newClass.location,
      schedule: newClass.schedule,
      registrationLink: `${window.location.origin}/register/${crypto.randomUUID()}`
    };

    const updatedClasses = [...classes, classData];
    localStorage.setItem('classes', JSON.stringify(updatedClasses));
    setClasses(updatedClasses);
    setShowNewClassForm(false);
    setNewClass({ name: '', location: '', schedule: '' });
    toast.success('Class created successfully!');
  };

  const copyRegistrationLink = (link) => {
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Your Classes</h1>
        <Button
          onClick={() => setShowNewClassForm(true)}
          icon={<Plus size={20} />}
        >
          Add Class
        </Button>
      </div>

      <AnimatePresence>
        {showNewClassForm && (
          <Card className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Create New Class</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Class Name</label>
                <input
                  type="text"
                  value={newClass.name}
                  onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={newClass.location}
                  onChange={(e) => setNewClass({...newClass, location: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Schedule</label>
                <input
                  type="text"
                  value={newClass.schedule}
                  onChange={(e) => setNewClass({...newClass, schedule: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateClass}>
                  Create Class
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowNewClassForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <Card key={cls.id}>
            <h3 className="text-xl font-semibold mb-4">{cls.name}</h3>
            <div className="space-y-2 text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>{cls.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{cls.schedule}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>0 Students</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500 mb-2">Registration Link:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cls.registrationLink}
                  readOnly
                  className="flex-1 text-sm bg-gray-50 p-2 rounded border"
                />
                <Button
                  variant="secondary"
                  onClick={() => copyRegistrationLink(cls.registrationLink || '')}
                  icon={<Copy size={16} />}
                >
                  Copy
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}