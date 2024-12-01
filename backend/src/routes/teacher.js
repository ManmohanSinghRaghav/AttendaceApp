import express from 'express';
import { isTeacher } from '../middleware/auth.js';

const router = express.Router();

// Get all classes for a teacher
router.get('/classes', isTeacher, (req, res) => {
  try {
    const classes = JSON.parse(process.env.CLASSES || '[]');
    const teacherClasses = classes.filter((c) => c.teacherId === req.user?.id);
    res.json(teacherClasses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classes' });
  }
});

// Create a new class
router.post('/classes', isTeacher, (req, res) => {
  try {
    const { name, location, schedule } = req.body;
    const classes = JSON.parse(process.env.CLASSES || '[]');

    const newClass = {
      id: crypto.randomUUID(),
      teacherId: req.user?.id,
      name,
      location,
      schedule,
      registrationLink: `${process.env.FRONTEND_URL}/register/${crypto.randomUUID()}`
    };

    classes.push(newClass);
    process.env.CLASSES = JSON.stringify(classes);

    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: 'Error creating class' });
  }
});

// Get students in a class
router.get('/classes/:classId/students', isTeacher, (req, res) => {
  try {
    const { classId } = req.params;
    const students = JSON.parse(process.env.STUDENTS || '[]');
    const classStudents = students.filter((s) => 
      s.classIds.includes(classId)
    );
    res.json(classStudents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students' });
  }
});

export default router;