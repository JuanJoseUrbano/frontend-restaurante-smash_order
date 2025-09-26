<template>
  <div class="select-role-page">
    <div class="role-card">
      <h2>Selecciona tu rol</h2>
      <p class="subtitle">
        Tienes más de un rol asignado. Elige con cuál deseas ingresar:
      </p>
      <div class="roles-list">
        <button
          v-for="role in roles"
          :key="role"
          class="btn-role"
          @click="chooseRole(role)"
        >
          {{ formatRole(role) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SelectRolePage",
  data() {
    return {
      roles: JSON.parse(localStorage.getItem("roles")) || [],
    };
  },
  methods: {
    chooseRole(role) {
      localStorage.setItem("activeRole", role);
      this.redirectByRole(role);
    },
    redirectByRole(role) {
      if (role === "ROLE_ADMIN") {
        this.$router.push("/dashboard");
      } else if (role === "ROLE_EMPLOYEE") {
        this.$router.push("/employee");
      } else if (role === "ROLE_CUSTOMER") {
        this.$router.push("/menu");
      } else {
        this.$router.push("/");
      }
    },
    formatRole(role) {
      switch (role) {
        case "ROLE_ADMIN":
          return "Administrador";
        case "ROLE_EMPLOYEE":
          return "Empleado";
        case "ROLE_CUSTOMER":
          return "Cliente";
        default:
          return role;
      }
    },
  },
};
</script>

<style scoped>
.select-role-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f5f5, #eaeaea);
  padding: 20px;
}

.role-card {
  background: #ffffff;
  padding: 30px 40px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.role-card h2 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 25px;
}

.roles-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.btn-role {
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  background: #580e00;
  color: white;
  transition: all 0.3s ease;
}

.btn-role:hover {
  background: #7a1500;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.btn-role:active {
  transform: scale(0.98);
}
</style>
