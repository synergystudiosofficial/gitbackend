import React, { createContext, useContext, useEffect, useState } from 'react';
import NotificationService from '../services/NotificationService';

interface NotificationContextType {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  addNotification: (data: Omit<Notification, '_id' | 'timestamp' | 'read'>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await NotificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      setError('Failed to load notifications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addNotification = async (data: Omit<Notification, '_id' | 'timestamp' | 'read'>) => {
    try {
      const newNotification = await NotificationService.createNotification(data);
      setNotifications(prev => [newNotification, ...prev]);
    } catch (error) {
      setError('Failed to create notification');
      console.error(error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const updatedNotification = await NotificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(notification =>
          notification._id === id ? updatedNotification : notification
        )
      );
    } catch (error) {
      setError('Failed to mark notification as read');
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      setError('Failed to mark all notifications as read');
      console.error(error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await NotificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(notification => notification._id !== id));
    } catch (error) {
      setError('Failed to delete notification');
      console.error(error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await NotificationService.clearAllNotifications();
      setNotifications([]);
    } catch (error) {
      setError('Failed to clear notifications');
      console.error(error);
    }
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        loading, 
        error, 
        addNotification, 
        markAsRead, 
        markAllAsRead, 
        deleteNotification, 
        clearAllNotifications 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}