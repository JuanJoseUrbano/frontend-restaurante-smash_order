import api from "./api";

export async function registerUser(user) {
  const res = await api.post("/auth/register", user);
  return res.data;
}

export async function getUsers() {
  const res = await api.get("/users");
  return res.data;
}

export async function getUserById(id) {
  const res = await api.get(`/users/${id}`);
  return res.data;
}

export async function searchUsers(name) {
  const res = await api.get(`/users/search`, {
    params: { name }
  });
  return res.data;
}

export async function updateUser(user) {
  return await api.put(`/users/${user.id}`, user);
}

export async function deleteUser(id) {
  return await api.delete(`/users/${id}`);
}

export async function getUserByEmail(email) {
  const res = await api.get(`/users/email/${email}`);
  return res.data;
}

export async function countAllUsers() {
  const response = await api.get("/users/count");
  return response.data;
}

export async function updateProfile(user) {
  const res = await api.put(`/users/me`, user);
  return res.data;
}

export async function getProfile() {
  const res = await api.get("/users/me");
  return res.data;
}