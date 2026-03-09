"use client";
import { useState, useEffect } from 'react';


interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'health' | 'appointment' | 'emergency' | 'system';
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
  isRead: boolean;
  actionRequired?: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState({
    type: 'all',
    priority: 'all',
    status: 'all'
  });

  // Mock notification data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Vaccination Reminder',
        message: 'Your annual flu vaccination is due in 3 days. Please schedule an appointment at your nearest healthcare facility.',
        type: 'health',
        priority: 'medium',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: false,
        actionRequired: true
      },
      {
        id: '2',
        title: 'Appointment Confirmation',
        message: 'Your appointment with Dr. Smith on February 6, 2026 at 10:30 AM has been confirmed.',
        type: 'appointment',
        priority: 'medium',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        isRead: false
      },
      {
        id: '3',
        title: 'Health Emergency Alert',
        message: 'COVID-19 outbreak reported in your area. Please follow safety protocols and get tested if you experience symptoms.',
        type: 'emergency',
        priority: 'high',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        isRead: true,
        actionRequired: true
      },
      {
        id: '4',
        title: 'Test Results Available',
        message: 'Your blood test results from January 30, 2026 are now available in your health profile.',
        type: 'health',
        priority: 'medium',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        isRead: false
      },
      {
        id: '5',
        title: 'System Maintenance',
        message: 'Scheduled maintenance on February 8, 2026 from 2:00 AM to 4:00 AM. Some services may be temporarily unavailable.',
        type: 'system',
        priority: 'low',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        isRead: true
      },
      {
        id: '6',
        title: 'Appointment Reminder',
        message: 'Reminder: You have an appointment tomorrow at 2:00 PM with Dr. Johnson at City General Hospital.',
        type: 'appointment',
        priority: 'high',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        isRead: false,
        actionRequired: true
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    if (filter.type !== 'all' && notification.type !== filter.type) return false;
    if (filter.priority !== 'all' && notification.priority !== filter.priority) return false;
    if (filter.status === 'unread' && notification.isRead) return false;
    if (filter.status === 'read' && !notification.isRead) return false;
    return true;
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'health':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
          </svg>
        );
      case 'appointment':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z"/>
          </svg>
        );
      case 'emergency':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M1 21H4L8 14L4 7H1L5 14L1 21ZM23 21H20L16 14L20 7H23L19 14L23 21ZM8.5 12.5L11 7H13L15.5 12.5L13 18H11L8.5 12.5Z"/>
          </svg>
        );
      case 'system':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5C14.8 4.1 13.6 3 12 3S9.2 4.1 9 5.5L3 7V9L9 7.5V16.5C9 17.6 9.4 18.6 10.2 19.4L11.2 20.4L12 21.2L12.8 20.4L13.8 19.4C14.6 18.6 15 17.6 15 16.5V7.5L21 9Z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        {/* Header Section */}
        <div className="notifications-header">
          <div className="header-content">
            <h1 className="page-title">Notifications</h1>
            <p className="page-subtitle">
              Stay updated with your health alerts, appointments, and important announcements
              {unreadCount > 0 && ` • ${unreadCount} unread`}
            </p>
          </div>
          <div className="notifications-illustration">
            <div className="illustration-circle">
              <svg className="notification-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.89 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5S10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="filter-section">
          <div className="filter-header">
            <h3 className="filter-title">Filter Notifications</h3>
            {unreadCount > 0 && (
              <button className="mark-all-read" onClick={handleMarkAllAsRead}>
                Mark All as Read
              </button>
            )}
          </div>
          <div className="filter-controls">
            <div className="filter-group">
              <label className="filter-label">Type</label>
              <select 
                className="filter-select" 
                value={filter.type} 
                onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="all">All Types</option>
                <option value="health">Health Alerts</option>
                <option value="appointment">Appointments</option>
                <option value="emergency">Emergency</option>
                <option value="system">System</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Priority</label>
              <select 
                className="filter-select" 
                value={filter.priority} 
                onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value }))}
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select 
                className="filter-select" 
                value={filter.status} 
                onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="notifications-list">
            {filteredNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-card ${!notification.isRead ? 'unread' : ''} ${notification.type}`}
                onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
              >
                <div className="notification-header">
                  <div className="notification-meta">
                    <div className={`notification-type-icon ${notification.type}`}>
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="notification-details">
                      <h3 className="notification-title">{notification.title}</h3>
                      <span className="notification-type">{notification.type.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="notification-actions">
                    <span className="notification-time">{formatTimeAgo(notification.timestamp)}</span>
                    <span className={`notification-priority ${notification.priority}`}>
                      {notification.priority}
                    </span>
                  </div>
                </div>
                <p className="notification-message">{notification.message}</p>
                <div className="notification-footer">
                  <div></div>
                  <div className="notification-buttons">
                    {notification.actionRequired && (
                      <button className="notification-btn primary">
                        Take Action
                      </button>
                    )}
                    {!notification.isRead && (
                      <button 
                        className="notification-btn secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                      >
                        Mark as Read
                      </button>
                    )}
                    <button 
                      className="notification-btn danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <svg className="empty-state-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5C14.8 4.1 13.6 3 12 3S9.2 4.1 9 5.5L3 7V9L9 7.5V16.5C9 17.6 9.4 18.6 10.2 19.4L11.2 20.4L12 21.2L12.8 20.4L13.8 19.4C14.6 18.6 15 17.6 15 16.5V7.5L21 9Z"/>
            </svg>
            <h3 className="empty-state-title">No notifications found</h3>
            <p className="empty-state-message">
              {filter.type !== 'all' || filter.priority !== 'all' || filter.status !== 'all' 
                ? 'No notifications match your current filters. Try adjusting your filter settings.' 
                : 'You\'re all caught up! No new notifications at the moment.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
