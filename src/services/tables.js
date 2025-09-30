// src/services/tables.js
import api from "./api";

export async function getTables() {
  const res = await api.get("/tables");
  return res.data;
}

export async function getTableByNumber(number) {
  const res = await api.get(`/tables/number/${number}`);
  return res.data;
}

export async function getTablesByStatus(status) {
  const res = await api.get(`/tables/status/${status}`);
  return res.data;
}

export async function getTableById(id) {
  const res = await api.get(`/tables/${id}`);
  return res.data;
}

export async function createTable(table) {
  return await api.post("/tables", table);
}

export async function updateTable(table) {
  return await api.put(`/tables/${table.id}`, table);
}

export async function deleteTable(id) {
  return await api.delete(`/tables/${id}`);
}
