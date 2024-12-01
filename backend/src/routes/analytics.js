import express from 'express';
import { isTeacher } from '../middleware/auth.js';

const router = express.Router();

// Get attendance statistics for a class
router.get('/class/:classId', isTeacher, (req, res) => {
  try {
    const { classId } = req.params;
    const attendance = JSON.parse(process.env.ATTENDANCE || '[]');
    const students = JSON.parse(process.env.STUDENTS || '[]');

    const classAttendance = attendance.filter((r) => r.classId === classId);
    const classStudents = students.filter((s) => 
      s.classIds.includes(classId)
    );

    const stats = {
      totalStudents: classStudents.length,
      averageAttendance: 0,
      attendanceByDate: {},
      studentStats: {}
    };

    // Calculate statistics
    classAttendance.forEach((record) => {
      // By date
      if (!stats.attendanceByDate[record.date]) {
        stats.attendanceByDate[record.date] = 0;
      }
      if (record.present) {
        stats.attendanceByDate[record.date]++;
      }

      // By student
      if (!stats.studentStats[record.studentId]) {
        stats.studentStats[record.studentId] = { present: 0, total: 0 };
      }
      stats.studentStats[record.studentId].total++;
      if (record.present) {
        stats.studentStats[record.studentId].present++;
      }
    });

    // Calculate average attendance
    const totalDays = Object.keys(stats.attendanceByDate).length;
    if (totalDays > 0) {
      const totalPresent = Object.values(stats.attendanceByDate)
        .reduce((sum, count) => sum + count, 0);
      stats.averageAttendance = totalPresent / (totalDays * stats.totalStudents);
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics' });
  }
});

export default router;