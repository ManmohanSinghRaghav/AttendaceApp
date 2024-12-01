import React from 'react';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

export default function Card({ children, className = '', onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={onClick ? { scale: 1.02 } : undefined}
      className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
      layout
    >
      {children}
    </motion.div>
  );
}