import api from './api';
import router from "@/router";


export const loginUser = async (user) => {
  try {
    const response = await api.post("/auth/login", user);
    const data = response.data;

    if (data.accessToken && data.tokenType && data.user) {
      const fullToken = `${data.tokenType.trim()} ${data.accessToken}`;

      localStorage.setItem("token", fullToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      const roles = (data.user.roles ?? []).map((r) => r.name);
      localStorage.setItem("roles", JSON.stringify(roles));

      localStorage.setItem("isAuthenticated", "true");

      console.info("✅ Login exitoso:", data.user.username);
      return data;
    } else {
      throw new Error("Respuesta del servidor incompleta.");
    }

  } catch (error) {
    console.error("Error en loginUser:", error);
    throw error; 
  }
};


export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('roles');
  localStorage.removeItem('activeRole');
  localStorage.removeItem('role');
  localStorage.removeItem('isAuthenticated');

  console.log("🚪 Sesión cerrada y datos eliminados de localStorage.");
  router.push("/login");
};

export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null;
  } catch {
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem('token') || null;
};

export const getRoles = () => {
  try {
    return JSON.parse(localStorage.getItem('roles')) || [];
  } catch {
    return [];
  }
};