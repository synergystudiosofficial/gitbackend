interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: Date;
  link?: string;
  category?: 'user' | 'client' | 'role' | 'team' | 'brand' | 'system';
  metadata?: Record<string, any>;
}

class NotificationService {
  private baseUrl = 'http://localhost:3001/api/notifications';
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` })
    };
  }

  async getNotifications(): Promise<Notification[]> {
    const response = await fetch(this.baseUrl, {
      headers: this.getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return response.json();
  }

  async createNotification(data: Omit<Notification, '_id' | 'timestamp' | 'read'>): Promise<Notification> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create notification');
    return response.json();
  }

  async markAsRead(id: string): Promise<Notification> {
    const response = await fetch(`${this.baseUrl}/${id}/read`, {
      method: 'PATCH',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to mark notification as read');
    return response.json();
  }

  async markAllAsRead(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/read-all`, {
      method: 'PATCH',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to mark all notifications as read');
  }

  async deleteNotification(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete notification');
  }

  async clearAllNotifications(): Promise<void> {
    const response = await fetch(this.baseUrl, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to clear notifications');
  }
}

export default new NotificationService();