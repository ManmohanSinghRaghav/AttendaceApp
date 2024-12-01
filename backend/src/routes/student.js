import express from 'express';
import { isStudent } from '../middleware/auth.js';

const router = express.Router();

// Get student's classes
router.get('/classes', isStudent, (req, res) => {
  try {
    const students = JSON.parse(process.env.STUDENTS || '[]');
    const classes = JSON.parse(process.env.CLASSES || '[]');
    
    const student = students.find((s) => s.id === req.user?.id);
    const studentClasses = classes.filter((c) => 
      student?.classIds.includes(c.id)
    );
    
    res.json(studentClasses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classes' });
  }
});

// Register for a class
router.post('/register/:token', isStudent, (req, res) => {
  try {
    const { token } = req.params;
    const classes = JSON.parse(process.env.CLASSES || '[]');
    const students = JSON.parse(process.env.STUDENTS || '[]');

    const targetClass = classes.find((c) => 
      c.registrationLink.includes(token)
    );

    if (!targetClass) {
      return res.status(404).json({ message: 'Invalid registration link' });
    }

    let student = students.find((s) => s.id === req.user?.id);
    if (student) {
      if (!student.classIds.includes(targetClass.id)) {
        student.classIds.push(targetClass.id);
      }
    } else {
      student = {
        id: req.user?.id,
        name: req.user?.name,
        email: req.user?.email,
        classIds: [targetClass.id]
      };
      students.push(student);
    }

    process.env.STUDENTS = JSON.stringify(students);
    res.json({ message: 'Successfully registered', class: targetClass });
  } catch (error) {
    res.status(500).json({ message: 'Error registering for class' });
  }
});

export default router;