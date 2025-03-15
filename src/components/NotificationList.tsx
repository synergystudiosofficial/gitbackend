import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import '../styles/notifications.css';

export function NotificationList() {
  const { 
    notifications, 
    loading, 
    error, 
    markAsRead, 
    deleteNotification 
  } = useNotifications();

  if (loading) {
    return <div className="notification-list loading">Loading notifications...</div>;
  }

  if (error) {
    return <div className="notification-list error">{error}</div>;
  }

  return (
    <div className="notification-list">
      {notifications.length === 0 ? (
        <div className="notification info">No notifications yet</div>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification._id}
            className={`notification ${notification.type} ${notification.read ? 'read' : 'unread'}`}
          >
            <div className="notification-content" onClick={() => !notification.read && markAsRead(notification._id)}>
              <h4 className="notification-title">{notification.title}</h4>
              <p className="notification-message">{notification.message}</p>
              {notification.link && (
                <a href={notification.link} className="notification-link">View details</a>
              )}
              <span className="notification-timestamp">
                {new Date(notification.timestamp).toLocaleString()}
              </span>
              {notification.category && (
                <span className="notification-category">{notification.category}</span>
              )}
            </div>
            <button
              className="notification-delete"
              onClick={() => deleteNotification(notification._id)}
              aria-label="Delete notification"
            >
              ×
            </button>
          </div>
        ))
      )}
    </div>
  );
}