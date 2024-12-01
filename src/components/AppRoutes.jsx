import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Login from './auth/Login';
import Signup from './auth/Signup';
import TeacherDashboard from './teacher/TeacherDashboard';
import StudentRegistration from './student/StudentRegistration';
import StudentAttendance from './student/StudentAttendance';
import { useAuth } from '../hooks/useAuth';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
    },
  },
};

const PageWrapper = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    {children}
  </motion.div>
);

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          !user ? (
            <PageWrapper>
              <Login />
            </PageWrapper>
          ) : (
            <Navigate to="/dashboard" replace />
          )
        } 
      />
      <Route 
        path="/signup" 
        element={
          !user ? (
            <PageWrapper>
              <Signup />
            </PageWrapper>
          ) : (
            <Navigate to="/dashboard" replace />
          )
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          user?.role === 'teacher' ? (
            <PageWrapper>
              <TeacherDashboard />
            </PageWrapper>
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route 
        path="/register/:token" 
        element={
          <PageWrapper>
            <StudentRegistration />
          </PageWrapper>
        } 
      />
      <Route 
        path="/attendance/:classId" 
        element={
          <PageWrapper>
            <StudentAttendance />
          </PageWrapper>
        } 
      />
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}