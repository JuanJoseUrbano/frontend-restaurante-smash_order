# 🍔 Restaurante Smash Order

Este repositorio contiene el **frontend** del sistema **Smash Order**, una aplicación para la gestión de pedidos en un restaurante de comidas rápidas.  
Está construido con **Vue JS**, utiliza **Bootstrap** y **CSS puro** para los estilos, y se conecta a los distintos **microservicios del backend** mediante **APIs REST**.

## 🚀 Tecnologías

* **Framework:** Vue.js 2  
* **Estilos:** Bootstrap + CSS puro  
* **Consumo de API:** Axios  
* **Ruteo:** Vue Router  

## ⚙️ Instalación

Clona el repositorio:

```bash
git clone https://github.com/JuanJoseUrbano/frontend-restaurante-smash_order.git
cd smash_order_web
```

Instala las dependencias:

```bash
npm install
```

## ⚡ Uso

Para levantar el proyecto en modo desarrollo:

```bash
npm run serve
```

Accede a la aplicación en tu navegador:

```
Por defecto: http://localhost:8080
```

## 📂 Estructura de carpetas

```
src/
├─ assets/         # Imágenes, iconos, fuentes
├─ components/     # Componentes Vue reutilizables
├─ views/          # Vistas principales de la app
├─ router/         # Configuración de rutas con Vue Router
├─ services/       # Configuración de Axios y consumo de APIs
├─ config/         # Variables de entorno y endpoints de microservicios
├─ App.vue
└─ main.js

```

## 🔗 Conexión con microservicios

El frontend se comunica con los **microservicios del backend** a través de **APIs REST**.  
Este enfoque permite **desacoplar la lógica de negocio** de la interfaz de usuario, facilitando la escalabilidad y el mantenimiento del sistema.  

Actualmente, el frontend consume los siguientes servicios:

- **Auth Service** → manejo de autenticación, inicio de sesión y control de roles (cliente, empleado, administrador).  
- **Product Service** → gestión de productos, precios y disponibilidad en el menú.  
- **Table Service** → administración de mesas, estados y disponibilidad.  
- **Reservation Service** → gestión de reservas realizadas por los clientes.  
- **Order Service** → gestión de pedidos, su estado y seguimiento en tiempo real.  

⚙️ **Configuración de endpoints**  
Las URLs de los microservicios deben definirse en el archivo `src/config` o mediante **variables de entorno** en un archivo `.env`.  
Esto permite manejar diferentes entornos (desarrollo, pruebas, producción) sin modificar el código fuente.  