import api from "./api";

export async function getReservations() {
  const res = await api.get("/reservations");
  return res.data;
}

export async function getReservationsPaginated(page = 0, size = 5) {
  const res = await api.get(`/reservations/paginated?page=${page}&size=${size}`);
  return res.data;
}

export async function getActiveReservations() {
  const res = await api.get("/reservations/active");
  return res.data;
}

export async function getReservationById(id) {
  const res = await api.get(`/reservations/${id}`);
  return res.data;
}

export async function getReservationsByDatePaginated(date, page = 0, size = 5) {
  const res = await api.get(`/reservations/date/${date}`, {
    params: { page, size }
  });

  return res.data;
}


export async function getReservationsByStatusPaginated(status, page = 0, size = 5) {
  const res = await api.get(`/reservations/status/paginated?status=${status}&page=${page}&size=${size}`);
  return res.data;
}

export async function getReservationsByDate(date) {
  const res = await api.get(`/reservations/date/${encodeURIComponent(date)}`);
  return res.data;
}

export async function createReservation(reserva) {
  return await api.post("/reservations", reserva);
}

export async function updateReservation(reserva) {
  return await api.put(`/reservations/${reserva.id}`, reserva);
}

export async function deleteReservation(id) {
  return await api.delete(`/reservations/${id}`);
}

export async function countActiveReservationsByCustomer(id) {
  const response = await api.get(`/reservations/active/count/customer/${id}`);
  return response.data;
}

export async function getReservationHistoryByCustomer(customerId) {
  const res = await api.get(`/reservations/history/customer/${customerId}`);
  return res.data;
}
