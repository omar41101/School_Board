import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Bell, Calendar, AlertTriangle, MessageSquare, CreditCard, Loader2, AlertCircle as AlertCircleIcon } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { eventApi, paymentApi, messageApi, assignmentApi, normalizeArrayResponse } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

interface Notification {
  id: string;
  type: 'exam' | 'payment' | 'announcement' | 'message' | 'alert' | 'assignment';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

export function NotificationsPanel() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user?._id) {
      fetchNotifications();
    }
  }, [user?._id]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const [eventsResponse, paymentsResponse, messagesResponse, assignmentsResponse] = await Promise.all([
        eventApi.getAll(),
        paymentApi.getAll(),
        messageApi.getAll(),
        assignmentApi.getAll()
      ]);

      const events = normalizeArrayResponse(eventsResponse);
      const payments = normalizeArrayResponse(paymentsResponse);
      const messages = normalizeArrayResponse(messagesResponse);
      const assignments = normalizeArrayResponse(assignmentsResponse);

      const notificationsList: Notification[] = [];

      // Add upcoming events
      events
        .filter((event: any) => new Date(event.date) >= new Date())
        .slice(0, 2)
        .forEach((event: any) => {
          notificationsList.push({
            id: `event-${event._id}`,
            type: event.type === 'exam' ? 'exam' : 'announcement',
            title: event.type === 'exam' ? 'Upcoming Exam' : event.title,
            message: `${event.title} - ${new Date(event.date).toLocaleDateString()}`,
            time: getTimeAgo(event.createdAt || event.date),
            isRead: false
          });
        });

      // Add pending payments
      payments
        .filter((payment: any) => payment.status === 'pending' || payment.status === 'overdue')
        .slice(0, 2)
        .forEach((payment: any) => {
          notificationsList.push({
            id: `payment-${payment._id}`,
            type: 'payment',
            title: payment.status === 'overdue' ? 'Payment Overdue' : 'Payment Due',
            message: `${payment.description || 'Payment'} - Amount: $${payment.amount}`,
            time: getTimeAgo(payment.dueDate),
            isRead: false
          });
        });

      // Add unread messages
      messages
        .filter((msg: any) => !msg.read && msg.receiver?._id === user?._id)
        .slice(0, 2)
        .forEach((msg: any) => {
          notificationsList.push({
            id: `message-${msg._id}`,
            type: 'message',
            title: 'New Message',
            message: msg.content?.substring(0, 50) + '...' || 'You have a new message',
            time: getTimeAgo(msg.createdAt),
            isRead: false
          });
        });

      // Add upcoming assignments
      assignments
        .filter((assignment: any) => new Date(assignment.dueDate) >= new Date())
        .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 2)
        .forEach((assignment: any) => {
          notificationsList.push({
            id: `assignment-${assignment._id}`,
            type: 'assignment',
            title: 'Assignment Due Soon',
            message: `${assignment.title} - Due: ${new Date(assignment.dueDate).toLocaleDateString()}`,
            time: getTimeAgo(assignment.createdAt),
            isRead: false
          });
        });

      // Sort by most recent
      notificationsList.sort((a, b) => {
        const timeA = parseTimeAgo(a.time);
        const timeB = parseTimeAgo(b.time);
        return timeA - timeB;
      });

      setNotifications(notificationsList.slice(0, 8));
    } catch (err: any) {
      console.error('Failed to fetch notifications:', err);
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date: string | Date) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  };

  const parseTimeAgo = (timeStr: string): number => {
    const match = timeStr.match(/(\d+)\s+(minute|hour|day)/);
    if (!match) return 0;
    const value = parseInt(match[1]);
    const unit = match[2];
    if (unit === 'minute') return value;
    if (unit === 'hour') return value * 60;
    return value * 1440;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'exam':
        return <Calendar className="h-4 w-4 text-[#3E92CC]" />;
      case 'payment':
        return <CreditCard className="h-4 w-4 text-[#EF4444]" />;
      case 'announcement':
        return <Bell className="h-4 w-4 text-[#0D1B2A]" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 text-[#3E92CC]" />;
      case 'assignment':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-[#EF4444]" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    const colors = {
      exam: 'bg-[#3E92CC] text-white',
      payment: 'bg-[#EF4444] text-white',
      announcement: 'bg-[#0D1B2A] text-white',
      message: 'bg-[#3E92CC] text-white',
      assignment: 'bg-orange-500 text-white',
      alert: 'bg-[#EF4444] text-white'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Notifications & Announcements</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-80">
          <Loader2 className="h-8 w-8 animate-spin text-[#3E92CC]" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Notifications & Announcements</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-80 space-y-4">
          <AlertCircleIcon className="h-12 w-12 text-red-500" />
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchNotifications} variant="outline">Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Notifications & Announcements</CardTitle>
        <Button variant="outline" size="sm" onClick={fetchNotifications}>
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors hover:bg-gray-50 ${
                    !notification.isRead ? 'bg-blue-50 border-[#3E92CC]/20' : 'bg-white'
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getNotificationBadge(notification.type)}`}
                      >
                        {notification.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-[#3E92CC] rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No notifications at this time
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}