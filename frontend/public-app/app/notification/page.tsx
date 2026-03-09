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
    <div className="min-h-screen bg-slate-50 py-6 md:py-10 px-3 sm:px-6 lg:px-8 font-sans pb-24 md:pb-10">
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-teal-50 rounded-full blur-3xl -mx-10 -my-10 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight mb-1.5 md:mb-2">Notifications</h1>
            <p className="text-sm md:text-base text-slate-500 font-medium leading-snug">
              Stay updated with your health alerts, appointments, and important announcements
              {unreadCount > 0 && <span className="mt-1.5 md:mt-0 md:ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold bg-rose-100/80 text-rose-600 border border-rose-200/50">{unreadCount} unread</span>}
            </p>
          </div>
          
          <div className="relative z-10 hidden sm:flex w-14 md:w-16 h-14 md:h-16 rounded-full bg-teal-50 items-center justify-center text-teal-600 border border-teal-100 shadow-sm flex-shrink-0">
            <svg className="w-7 md:w-8 h-7 md:h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.89 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5S10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z"/>
            </svg>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <h3 className="font-bold text-slate-800 text-sm md:text-base">Filter Notifications</h3>
            {unreadCount > 0 && (
              <button 
                className="text-xs md:text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors bg-teal-50/50 px-3 py-1.5 md:px-4 md:py-2 rounded-full active:scale-95 border border-teal-100/50 w-fit" 
                onClick={handleMarkAllAsRead}
              >
                Mark All as Read
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Type</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 md:px-4 md:py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium appearance-none" 
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
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Priority</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 md:px-4 md:py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium appearance-none" 
                value={filter.priority} 
                onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value }))}
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 md:px-4 md:py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium appearance-none" 
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
          <div className="space-y-3 md:space-y-4">
            {filteredNotifications.map(notification => {
              // Priority styling
              let priorityColor = "bg-slate-100 text-slate-600 border border-slate-200/50";
              if (notification.priority === 'high') priorityColor = "bg-rose-50 text-rose-600 border border-rose-200/60";
              if (notification.priority === 'medium') priorityColor = "bg-amber-50 text-amber-600 border border-amber-200/60";
              if (notification.priority === 'low') priorityColor = "bg-blue-50 text-blue-600 border border-blue-200/60";

              // Icon styling (smaller for mobile)
              let iconTheme = "bg-slate-50 text-slate-500 border border-slate-100";
              if (notification.type === 'health') iconTheme = "bg-teal-50 text-teal-500 border border-teal-100/50";
              if (notification.type === 'appointment') iconTheme = "bg-blue-50 text-blue-500 border border-blue-100/50";
              if (notification.type === 'emergency') iconTheme = "bg-rose-50 text-rose-500 border border-rose-100/50";
              if (notification.type === 'system') iconTheme = "bg-amber-50 text-amber-500 border border-amber-100/50";

              return (
                <div 
                  key={notification.id} 
                  className={`relative p-4 md:p-6 bg-white rounded-2xl md:rounded-3xl border transition-all duration-300 ${!notification.isRead ? 'border-teal-100 shadow-md shadow-teal-500/5' : 'border-slate-100 shadow-sm opacity-[0.85]'} hover:shadow-lg hover:-translate-y-0.5 cursor-pointer overflow-hidden`}
                  onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                >
                  {!notification.isRead && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 md:w-1.5 bg-teal-400"></div>
                  )}

                  <div className="flex gap-3 md:gap-5">
                    {/* Icon - Always side by side natively */}
                    <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 md:mt-0 ${iconTheme}`}>
                      {getTypeIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      
                      {/* Top Header Row of the Notification */}
                      <div className="flex items-start justify-between gap-2 mb-1md:mb-1.5">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 md:gap-3 flex-wrap">
                          <h3 className={`text-base md:text-lg transition-colors leading-tight ${!notification.isRead ? 'font-[900] text-slate-800' : 'font-bold text-slate-700'}`}>
                            {notification.title}
                          </h3>
                          <span className={`w-fit ${priorityColor} px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest leading-none shadow-sm`}>
                            {notification.priority}
                          </span>
                        </div>
                        <span className="text-[10px] md:text-xs font-bold tracking-wider text-slate-400 uppercase pt-0.5 flex-shrink-0">
                          {formatTimeAgo(notification.timestamp)}
                        </span>
                      </div>
                      
                      <p className={`text-[13px] md:text-sm leading-relaxed mt-2 ${!notification.isRead ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>
                        {notification.message}
                      </p>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 mt-3.5 md:mt-4">
                        {notification.actionRequired && (
                          <button className="px-3 py-1.5 md:px-5 md:py-2 bg-slate-900 hover:bg-teal-600 text-white text-[10px] md:text-xs font-bold rounded-full transition-colors active:scale-95 shadow-sm">
                            Take Action
                          </button>
                        )}
                        {!notification.isRead && (
                          <button 
                            className="px-3 py-1.5 md:px-5 md:py-2 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 text-[10px] md:text-xs font-bold rounded-full transition-colors active:scale-95 shadow-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                          >
                            Mark Read
                          </button>
                        )}
                        <button 
                          className="px-3 py-1.5 md:px-5 md:py-2 bg-rose-50/50 border border-rose-100 hover:bg-rose-100 text-rose-600 text-[10px] md:text-xs font-bold rounded-full transition-colors active:scale-95 shadow-sm ml-auto sm:ml-0"
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
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 px-6 md:p-12 bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-3 md:mb-4 border border-slate-100 shadow-inner">
              <svg className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5C14.8 4.1 13.6 3 12 3S9.2 4.1 9 5.5L3 7V9L9 7.5V16.5C9 17.6 9.4 18.6 10.2 19.4L11.2 20.4L12 21.2L12.8 20.4L13.8 19.4C14.6 18.6 15 17.6 15 16.5V7.5L21 9Z"/>
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-1.5 md:mb-2">No notifications found</h3>
            <p className="text-[13px] md:text-base text-slate-500 max-w-sm">
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
