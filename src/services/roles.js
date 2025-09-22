import api from "./api";

export async function getRoles() {
  const res = await api.get("/roles");
  return res.data;
}