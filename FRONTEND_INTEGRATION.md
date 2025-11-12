# Integración Frontend con Microservicios

## 📡 Arquitectura de Comunicación

```
Frontend (React/Vue/Angular)
    ↓
Kong API Gateway (http://localhost)
    ↓
    ├─→ Order Service (8081)
    ├─→ Invoice Service (8082)
    └─→ Notification Service (8083)
```

---

## 🔧 Configuración de Kong

Kong actúa como API Gateway centralizando todas las solicitudes del frontend.

### URLs de Kong

- **Local**: `http://localhost`
- **Admin API**: `http://localhost:8001`
- **Manager**: `http://localhost:8002`

### Rutas Configuradas

```
GET/POST  /api/orders          → Order Service
GET/POST  /api/invoices        → Invoice Service
GET/POST  /api/notifications   → Notification Service
```

---

## 🌐 Configuración del Frontend

### 1. Variables de Entorno

Crea un archivo `.env` en tu proyecto frontend:

```env
# .env
REACT_APP_API_URL=http://localhost
REACT_APP_API_TIMEOUT=30000
```

O para producción:

```env
# .env.production
REACT_APP_API_URL=https://api.tudominio.com
REACT_APP_API_TIMEOUT=30000
```

### 2. Servicio API Base (Axios)

Crea un archivo `src/services/api.js`:

```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost';
const API_TIMEOUT = process.env.REACT_APP_API_TIMEOUT || 30000;

const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado, redirigir a login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 3. Servicios para Cada Microservicio

#### Order Service (`src/services/orderService.js`)

```javascript
import api from './api';

const ORDER_API = '/api/orders';

export const orderService = {
  // Crear orden
  createOrder: (orderData) => 
    api.post(ORDER_API, orderData),

  // Obtener todas las órdenes
  getAllOrders: () => 
    api.get(ORDER_API),

  // Obtener orden por ID
  getOrderById: (id) => 
    api.get(`${ORDER_API}/${id}`),

  // Obtener órdenes por usuario
  getOrdersByUserId: (userId) => 
    api.get(`${ORDER_API}/user/${userId}`),

  // Obtener órdenes por mesa
  getOrdersByTableId: (tableId) => 
    api.get(`${ORDER_API}/table/${tableId}`),

  // Obtener órdenes por estado
  getOrdersByStatus: (status) => 
    api.get(`${ORDER_API}/status/${status}`),

  // Actualizar orden
  updateOrder: (id, orderData) => 
    api.put(`${ORDER_API}/${id}`, orderData),

  // Eliminar orden
  deleteOrder: (id) => 
    api.delete(`${ORDER_API}/${id}`),

  // Health check
  healthCheck: () => 
    api.get(`${ORDER_API}/health`),
};
```

#### Invoice Service (`src/services/invoiceService.js`)

```javascript
import api from './api';

const INVOICE_API = '/api/invoices';

export const invoiceService = {
  // Crear factura
  createInvoice: (invoiceData) => 
    api.post(INVOICE_API, invoiceData),

  // Obtener todas las facturas
  getAllInvoices: () => 
    api.get(INVOICE_API),

  // Obtener factura por ID
  getInvoiceById: (id) => 
    api.get(`${INVOICE_API}/${id}`),

  // Obtener factura por número
  getInvoiceByNumber: (invoiceNumber) => 
    api.get(`${INVOICE_API}/number/${invoiceNumber}`),

  // Obtener facturas por orden
  getInvoicesByOrderId: (orderId) => 
    api.get(`${INVOICE_API}/order/${orderId}`),

  // Obtener facturas por usuario
  getInvoicesByUserId: (userId) => 
    api.get(`${INVOICE_API}/user/${userId}`),

  // Obtener facturas por estado
  getInvoicesByStatus: (status) => 
    api.get(`${INVOICE_API}/status/${status}`),

  // Actualizar factura
  updateInvoice: (id, invoiceData) => 
    api.put(`${INVOICE_API}/${id}`, invoiceData),

  // Eliminar factura
  deleteInvoice: (id) => 
    api.delete(`${INVOICE_API}/${id}`),

  // Health check
  healthCheck: () => 
    api.get(`${INVOICE_API}/health`),
};
```

#### Notification Service (`src/services/notificationService.js`)

```javascript
import api from './api';

const NOTIFICATION_API = '/api/notifications';

export const notificationService = {
  // Crear notificación
  createNotification: (notificationData) => 
    api.post(NOTIFICATION_API, notificationData),

  // Obtener todas las notificaciones
  getAllNotifications: () => 
    api.get(NOTIFICATION_API),

  // Obtener notificación por ID
  getNotificationById: (id) => 
    api.get(`${NOTIFICATION_API}/${id}`),

  // Obtener notificaciones por usuario
  getNotificationsByUserId: (userId) => 
    api.get(`${NOTIFICATION_API}/user/${userId}`),

  // Obtener notificaciones no leídas
  getUnreadNotifications: (userId) => 
    api.get(`${NOTIFICATION_API}/user/${userId}/unread`),

  // Obtener notificaciones por orden
  getNotificationsByOrderId: (orderId) => 
    api.get(`${NOTIFICATION_API}/order/${orderId}`),

  // Obtener notificaciones por estado
  getNotificationsByStatus: (status) => 
    api.get(`${NOTIFICATION_API}/status/${status}`),

  // Obtener notificaciones por tipo
  getNotificationsByType: (type) => 
    api.get(`${NOTIFICATION_API}/type/${type}`),

  // Marcar como leída
  markAsRead: (id) => 
    api.put(`${NOTIFICATION_API}/${id}/read`),

  // Actualizar notificación
  updateNotification: (id, notificationData) => 
    api.put(`${NOTIFICATION_API}/${id}`, notificationData),

  // Eliminar notificación
  deleteNotification: (id) => 
    api.delete(`${NOTIFICATION_API}/${id}`),

  // Health check
  healthCheck: () => 
    api.get(`${NOTIFICATION_API}/health`),
};
```

---

## 💻 Ejemplos de Uso en Componentes

### React - Crear Orden

```javascript
import { useState } from 'react';
import { orderService } from '../services/orderService';

function CreateOrderForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateOrder = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.createOrder({
        userId: formData.userId,
        tableId: formData.tableId,
        totalAmount: formData.totalAmount,
        notes: formData.notes,
      });
      console.log('Orden creada:', response.data);
      // Redirigir o actualizar UI
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la orden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleCreateOrder({
        userId: 1,
        tableId: 5,
        totalAmount: 45.50,
        notes: 'Sin cebolla',
      });
    }}>
      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Orden'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default CreateOrderForm;
```

### React - Listar Órdenes

```javascript
import { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';

function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getAllOrders();
        setOrders(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Órdenes</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Mesa</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.userId}</td>
              <td>{order.tableId}</td>
              <td>${order.totalAmount}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersList;
```

### Vue 3 - Composable para Órdenes

```javascript
// composables/useOrders.js
import { ref } from 'vue';
import { orderService } from '@/services/orderService';

export function useOrders() {
  const orders = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchOrders = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await orderService.getAllOrders();
      orders.value = response.data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const createOrder = async (orderData) => {
    try {
      const response = await orderService.createOrder(orderData);
      orders.value.push(response.data);
      return response.data;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const updateOrder = async (id, orderData) => {
    try {
      const response = await orderService.updateOrder(id, orderData);
      const index = orders.value.findIndex(o => o.id === id);
      if (index !== -1) {
        orders.value[index] = response.data;
      }
      return response.data;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const deleteOrder = async (id) => {
    try {
      await orderService.deleteOrder(id);
      orders.value = orders.value.filter(o => o.id !== id);
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder,
  };
}
```

---

## 🔐 Autenticación y Autorización

### Agregar Token JWT

Si tu backend requiere autenticación JWT:

```javascript
// src/services/authService.js
import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
  },

  getToken: () => localStorage.getItem('authToken'),

  isAuthenticated: () => !!localStorage.getItem('authToken'),
};
```

### Proteger Rutas

```javascript
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

function ProtectedRoute({ children }) {
  return authService.isAuthenticated() ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
```

---

## 🚀 Manejo de Errores

### Interceptor Global de Errores

```javascript
// src/services/errorHandler.js
export const handleApiError = (error) => {
  if (error.response) {
    // Error del servidor
    const status = error.response.status;
    const message = error.response.data?.message || 'Error del servidor';

    switch (status) {
      case 400:
        return { type: 'validation', message };
      case 401:
        return { type: 'unauthorized', message: 'No autorizado' };
      case 403:
        return { type: 'forbidden', message: 'Acceso denegado' };
      case 404:
        return { type: 'notfound', message: 'Recurso no encontrado' };
      case 500:
        return { type: 'server', message: 'Error del servidor' };
      default:
        return { type: 'unknown', message };
    }
  } else if (error.request) {
    // No hay respuesta del servidor
    return { type: 'network', message: 'Error de conexión' };
  } else {
    // Error en la solicitud
    return { type: 'client', message: error.message };
  }
};
```

---

## 📊 WebSockets para Notificaciones en Tiempo Real

Para notificaciones en tiempo real, puedes usar WebSockets:

```javascript
// src/services/notificationSocket.js
export class NotificationSocket {
  constructor(url = 'ws://localhost:8083') {
    this.url = url;
    this.ws = null;
    this.listeners = {};
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket conectado');
          resolve();
        };

        this.ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.emit('notification', data);
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket desconectado');
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}
```

---

## 🧪 Testing de Integración

### Pruebas con Jest y React Testing Library

```javascript
// src/services/__tests__/orderService.test.js
import { orderService } from '../orderService';
import api from '../api';

jest.mock('../api');

describe('orderService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createOrder debe hacer POST a /api/orders', async () => {
    const orderData = {
      userId: 1,
      tableId: 5,
      totalAmount: 45.50,
    };

    api.post.mockResolvedValue({ data: { id: 1, ...orderData } });

    const result = await orderService.createOrder(orderData);

    expect(api.post).toHaveBeenCalledWith('/api/orders', orderData);
    expect(result.data.id).toBe(1);
  });

  test('getAllOrders debe hacer GET a /api/orders', async () => {
    const mockOrders = [
      { id: 1, userId: 1, tableId: 5, totalAmount: 45.50 },
    ];

    api.get.mockResolvedValue({ data: mockOrders });

    const result = await orderService.getAllOrders();

    expect(api.get).toHaveBeenCalledWith('/api/orders');
    expect(result.data).toEqual(mockOrders);
  });
});
```

---

## 📋 Checklist de Integración

- [ ] Kong está corriendo y accesible en `http://localhost`
- [ ] Microservicios están registrados en Kong
- [ ] Frontend tiene archivo `.env` configurado
- [ ] Servicio API base (axios) está creado
- [ ] Servicios para cada microservicio están implementados
- [ ] Componentes usan los servicios correctamente
- [ ] Manejo de errores está implementado
- [ ] Autenticación JWT está configurada (si aplica)
- [ ] Tests están escritos
- [ ] CORS está habilitado en Kong

---

## 🔗 URLs de Referencia

- **Kong Admin API**: http://localhost:8001
- **Kong Manager**: http://localhost:8002
- **Order Service**: http://localhost:8081/api/orders
- **Invoice Service**: http://localhost:8082/api/invoices
- **Notification Service**: http://localhost:8083/api/notifications

---

## 🆘 Troubleshooting

### Error: CORS Policy

**Problema**: `Access to XMLHttpRequest blocked by CORS policy`

**Solución**: Kong ya tiene CORS habilitado en `kong.yml`. Verifica que esté correctamente configurado:

```yaml
plugins:
  - name: cors
    config:
      origins: ["*"]
      methods: [GET, POST, PUT, DELETE, PATCH]
      headers: [Accept, Authorization, Content-Type]
      credentials: true
```

### Error: 404 Not Found

**Problema**: `GET http://localhost/api/orders 404`

**Solución**: Verifica que:
1. Kong está corriendo: `docker-compose ps`
2. Los microservicios están corriendo
3. Las rutas están configuradas en Kong

### Error: Connection Refused

**Problema**: `Error: connect ECONNREFUSED 127.0.0.1:80`

**Solución**: Kong no está corriendo. Ejecuta:
```bash
docker-compose up -d kong
```

---

## 📚 Recursos Adicionales

- [Kong Documentation](https://docs.konghq.com/)
- [Axios Documentation](https://axios-http.com/)
- [React Query](https://tanstack.com/query/latest) - Para manejo avanzado de estado
- [SWR](https://swr.vercel.app/) - Alternativa a React Query
