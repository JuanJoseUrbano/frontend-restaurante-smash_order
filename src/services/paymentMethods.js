import api from "./api";

// Obtener todos los métodos de pago
export async function getPayments() {
  const res = await api.get("/payment-methods");
  return res.data;
}

// Obtener método de pago por ID
export async function getPaymentById(id) {
  const res = await api.get(`/payment-methods/${id}`);
  return res.data;
}

// Buscar métodos por nombre
export async function searchPaymentsByName(name) {
  const res = await api.get(`/payment-methods/name/${name}`);
  return res.data;
}

// Crear nuevo método
export async function createPaymentMethod(paymentMethod) {
  const res = await api.post("/payment-methods", paymentMethod);
  return res.data;
}

// Actualizar método
export async function updatePaymentMethod(id, paymentMethod) {
  const res = await api.put(`/payment-methods/${id}`, paymentMethod);
  return res.data;
}

// Eliminar método
export async function deletePaymentMethod(id) {
  const res = await api.delete(`/payment-methods/${id}`);
  return res.data;
}
