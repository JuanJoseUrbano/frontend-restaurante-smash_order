import api from "./api";

// Obtener todas las facturas
export async function getInvoices() {
  const res = await api.get("/invoices");
  return res.data;
}

// Obtener una factura por ID
export async function getInvoiceById(id) {
  const res = await api.get(`/invoices/${id}`);
  return res.data;
}

// Obtener facturas por cliente
export async function getInvoicesByCustomer(customerId) {
  const res = await api.get(`/invoices/customer/${customerId}`);
  return res.data;
}

// Obtener facturas por estado
export async function getInvoicesByStatus(status) {
  const res = await api.get(`/invoices/status/${status}`);
  return res.data;
}

// Obtener facturas en un rango de fechas
export async function getInvoicesByDateRange(start, end) {
  const res = await api.get(`/invoices/date-range`, {
    params: { start, end }
  });
  return res.data;
}

// Obtener facturas por método de pago
export async function getInvoicesByPaymentMethod(paymentMethodId) {
  const res = await api.get(`/invoices/payment-method/${paymentMethodId}`);
  return res.data;
}

// Obtener factura por número de recibo
export async function getInvoiceByReceipt(receiptNumber) {
  const res = await api.get(`/invoices/receipt/${receiptNumber}`);
  return res.data;
}

// Crear nueva factura
export async function createInvoice(invoice) {
  const res = await api.post("/invoices", invoice);
  return res.data;
}

// Actualizar una factura existente
export async function updateInvoice(id, invoice) {
  const res = await api.put(`/invoices/${id}`, invoice);
  return res.data;
}

// Eliminar una factura
export async function deleteInvoice(id) {
  await api.delete(`/invoices/${id}`);
}
