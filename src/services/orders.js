import api from "./api";

export async function createOrder(order) {
  const response = await api.post("/orders", order);
  return response.data;
}

export async function getOrders() {
  const response = await api.get("/orders");
  return response.data;
}

export async function getOrderById(id) {
  const response = await api.get(`/orders/${id}`);
  return response.data;
}

export async function updateOrder(id, order) {
  const response = await api.put(`/orders/${id}`, order);
  return response.data;
}

export async function deleteOrder(id) {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
}

// 🔍 Filtros adicionales
export async function getOrdersByCustomer(customerId) {
  const response = await api.get(`/orders/customer/${customerId}`);
  return response.data;
}

export async function getOrdersByStatus(status) {
  const response = await api.get(`/orders/status/${status}`);
  return response.data;
}

export async function getOrdersByDate(date) {
  const response = await api.get(`/orders/date/${date}`);
  return response.data;
}

export async function getOrdersBetweenDates(start, end) {
  const response = await api.get(`/orders/between`, {
    params: { start, end },
  });
  return response.data;
}
