import api from "./api";

export async function createNotification(notification) {
  const response = await api.post("/notifications", notification);
  return response.data;
}

export async function getNotifications() {
  const response = await api.get("/notifications");
  return response.data;
}

export async function getNotificationById(id) {
  const response = await api.get(`/notifications/${id}`);
  return response.data;
}

export async function getNotificationsByCustomer(customerId) {
  const response = await api.get(`/notifications/customer/${customerId}`);
  return response.data;
}

export async function getNotificationsUnreadByCustomer(customerId) {
  const response = await api.get(`/notifications/customer/${customerId}/unread`);
  return response.data;
}

export async function updateNotification(id, notification) {
  const response = await api.put(`/notifications/${id}`, notification);
  return response.data;
}

export async function markNotificationAsRead(id) {
  const response = await api.patch(`/notifications/customer/${id}/read`);
  return response.data;
}

export async function deleteNotification(id) {
  const response = await api.delete(`/notifications/${id}`);
  return response.data;
}