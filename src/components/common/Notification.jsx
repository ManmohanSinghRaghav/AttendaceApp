import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, AlertTriangle, CheckCircle } from 'lucide-react';

function Notification({ notification, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(notification.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification.id, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    error: <AlertTriangle className="w-5 h-5 text-red-500" />
  };

  const colors = {
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`rounded-lg shadow-lg border p-4 ${colors[notification.type]}`}
    >
      <div className="flex gap-3">
        {icons[notification.type]}
        <p className="flex-1 text-gray-700">{notification.message}</p>
        <button
          onClick={() => onClose(notification.id)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('notifications');
    if (stored) {
      setNotifications(JSON.parse(stored));
    }

    const checkNewNotifications = setInterval(() => {
      const stored = localStorage.getItem('notifications');
      if (stored) {
        const parsed = JSON.parse(stored);
        setNotifications(parsed);
      }
    }, 1000);

    return () => clearInterval(checkNewNotifications);
  }, []);

  const removeNotification = (id) => {
    setNotifications(current => {
      const updated = current.filter(n => n.id !== id);
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            notification={notification}
            onClose={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export function addNotification(message, type = 'success') {
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  const newNotification = {
    id: crypto.randomUUID(),
    message,
    type,
    timestamp: Date.now()
  };
  
  const updated = [...notifications, newNotification].slice(-5); // Keep last 5 notifications
  localStorage.setItem('notifications', JSON.stringify(updated));
}