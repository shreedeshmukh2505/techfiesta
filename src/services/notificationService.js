// src/services/notificationService.js
class NotificationService {
    constructor() {
      this.listeners = new Set();
    }
  
    // Add notification listener
    subscribe(callback) {
      this.listeners.add(callback);
      return () => this.listeners.delete(callback);
    }
  
    // Send notification to all listeners
    notify(notification) {
      this.listeners.forEach(callback => callback(notification));
    }
  
    // Schedule change notification
    async notifyScheduleChange(scheduleId, changeType, details) {
      const notification = {
        type: 'SCHEDULE_CHANGE',
        scheduleId,
        changeType,
        details,
        timestamp: new Date().toISOString()
      };
  
      // Store in database and notify listeners
      await this.storeNotification(notification);
      this.notify(notification);
    }
  
    // Conflict notification
    async notifyConflict(scheduleId, conflicts) {
      const notification = {
        type: 'CONFLICT_DETECTED',
        scheduleId,
        conflicts,
        timestamp: new Date().toISOString()
      };
  
      await this.storeNotification(notification);
      this.notify(notification);
    }
  
    // Resource availability notification
    async notifyResourceAvailability(resourceType, resourceId, status) {
      const notification = {
        type: 'RESOURCE_AVAILABILITY',
        resourceType,
        resourceId,
        status,
        timestamp: new Date().toISOString()
      };
  
      await this.storeNotification(notification);
      this.notify(notification);
    }
  
    // Store notification in database
    async storeNotification(notification) {
      try {
        const response = await fetch('/api/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notification),
        });
        return await response.json();
      } catch (error) {
        console.error('Error storing notification:', error);
      }
    }
  
    // Get notifications for a user
    async getUserNotifications(userId) {
      try {
        const response = await fetch(`/api/notifications/user/${userId}`);
        return await response.json();
      } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }
    }
  }
  
  export const notificationService = new NotificationService();