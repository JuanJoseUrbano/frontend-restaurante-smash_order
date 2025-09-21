import api from "./api";

export async function loginUser(credentials) {
  const res = await api.post("/users/login", credentials);
  return res.data;
}

export async function registerUser(user) {
  const res = await api.post("/users", user);
  return res.data;
}
