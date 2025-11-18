import api from "./api";

// 🔹 Solicitar enlace de recuperación de contraseña
export async function forgotPassword(email) {
  const formData = new URLSearchParams();
  formData.append("email", email);

  const response = await api.post("/password/forgot", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return response.data;
}

// 🔹 Restablecer la contraseña con el token recibido
export async function resetPassword(token, newPassword) {
  const formData = new URLSearchParams();
  formData.append("token", token);
  formData.append("newPassword", newPassword);

  const response = await api.post("/password/reset", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return response.data;
}
