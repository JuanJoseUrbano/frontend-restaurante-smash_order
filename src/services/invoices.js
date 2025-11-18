import api from "./api";

export async function getInvoices() {
  const res = await api.get("/invoices");
  return res.data;
}

export async function getInvoicesPaginated(page = 0, size = 5) {
  const res = await api.get("/invoices/paginated", {
    params: { page, size }
  });
  return res.data;
}

export async function getInvoiceById(id) {
  const res = await api.get(`/invoices/${id}`);
  return res.data;
}

export async function getInvoicesByCustomerPaginated(customerId, page = 0, size = 5) {
  const res = await api.get(`/invoices/customer/${customerId}/paginated`, {
    params: { page, size }
  });
  return res.data;
}

export async function getInvoicesByStatusPaginated(status, page = 0, size = 10) {
  const res = await api.get(`/invoices/status/${status}/paginated`, {
    params: { page, size }
  });
  return res.data;
}

export async function getInvoicesByDateRangePaginated(start, end, page = 0, size = 10) {
  const res = await api.get(`/invoices/date-range/paginated`, {
    params: { start, end, page, size }
  });
  return res.data;
}

export async function getInvoicesByPaymentMethodPaginated(paymentMethodId, page = 0, size = 10) {
  const res = await api.get(`/invoices/payment-method/${paymentMethodId}/paginated`, {
    params: { page, size }
  });
  return res.data;
}

export async function getInvoiceByReceipt(receiptNumber) {
  const res = await api.get(`/invoices/receipt/${receiptNumber}`);
  return res.data;
}

export async function createInvoice(invoice) {
  const res = await api.post("/invoices", invoice);
  return res.data;
}

export async function updateInvoice(id, invoice) {
  const res = await api.put(`/invoices/${id}`, invoice);
  return res.data;
}

export async function deleteInvoice(id) {
  await api.delete(`/invoices/${id}`);
}
