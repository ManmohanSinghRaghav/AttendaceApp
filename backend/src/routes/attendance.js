import express from 'express';
import { getDistance } from 'geolib';
import { isStudent } from '../middleware/auth.js';

const router = express.Router();

// Mark attendance
router.post('/:classId', isStudent, (req, res) => {
  try {
    const { classId } = req.params;
    const { latitude, longitude, present } = req.body;
    const classes = JSON.parse(process.env.CLASSES || '[]');
    const attendance = JSON.parse(process.env.ATTENDANCE || '[]');

    const targetClass = classes.find((c) => c.id === classId);
    if (!targetClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check if student is within range (100 meters) of class location
    if (present && targetClass.coordinates) {
      const distance = getDistance(
        { latitude, longitude },
        targetClass.coordinates
      );
      if (distance > 100) {
        return res.status(400).json({ message: 'You are not in class location' });
      }
    }

    const today = new Date().toISOString().split('T')[0];
    const newRecord = {
      id: crypto.randomUUID(),
      classId,
      studentId: req.user?.id,
      date: today,
      present,
      location: present ? `${latitude},${longitude}` : undefined
    };

    // Remove any existing record for today
    const updatedRecords = [
      ...attendance.filter((r) => 
        !(r.classId === classId && 
          r.studentId === req.user?.id && 
          r.date === today)
      ),
      newRecord
    ];

    process.env.ATTENDANCE = JSON.stringify(updatedRecords);
    res.json(newRecord);
  } catch (error) {
    res.status(500).json({ message: 'Error marking attendance' });
  }
});

// Get attendance history
router.get('/:classId', isStudent, (req, res) => {
  try {
    const { classId } = req.params;
    const attendance = JSON.parse(process.env.ATTENDANCE || '[]');
    
    const records = attendance.filter((r) => 
      r.classId === classId && r.studentId === req.user?.id
    );
    
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance records' });
  }
});

export default router;