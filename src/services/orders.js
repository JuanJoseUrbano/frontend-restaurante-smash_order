import api from "./api";

export async function createOrder(order) {
  const response = await api.post("/orders", order);
  return response.data;
}

export async function getOrders() {
  const response = await api.get("/orders");
  return response.data;
}

export async function getOrdersPaginated(page = 0, size = 3) {
  const res = await api.get("/orders/paginated", {
    params: { page, size },
  });
  return res.data;
}

export async function getOrdersWithoutInvoice() {
  const response = await api.get("orders/without-invoice");
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

export async function getOrdersByCustomer(customerId) {
  const response = await api.get(`/orders/customer/${customerId}`);
  return response.data;
}

export async function getOrdersByCustomerName (name) {
  const response = await api.get('/orders/search-by-customer', { params: { name } });
  return response.data;
}

export async function getOrdersByStatus(status) {
  const response = await api.get(`/orders/status/${status}`);
  return response.data;
}

export async function getOrdersByDate(date) {
  const response = await api.get('/orders/date', { params: { date } });
  return response.data;
}

export async function getOrdersBetweenDates(start, end) {
  const response = await api.get(`/orders/between`, {
    params: { start, end },
  });
  return response.data;
}

export async function countAllOrders() {
  const response = await api.get("/orders/count");
  return response.data;
}

export async function countOrdersByCustomer(customerId) {
  const response = await api.get(`/orders/customer/${customerId}/count`);
  return response.data;
}

