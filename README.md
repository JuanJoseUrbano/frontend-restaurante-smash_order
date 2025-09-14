# Restaurante Smash Order

Este repositorio contiene el **frontend** del sistema **Smash Order**, construido con **Vue 2** y **CSS puro**. Este frontend interactúa con los distintos microservicios del sistema para ofrecer una experiencia unificada a los usuarios.

## Tecnologías

* **Framework:** Vue.js
* **Estilos:** CSS
* **Ruteo:** Vue Router

## Instalación

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

Para generar la versión de producción:

```bash
npm run build
```

## 📂 Estructura de carpetas

```
src/
├─ assets/         # Imágenes, iconos, fuentes
├─ components/     # Componentes Vue reutilizables
├─ views/          # Vistas principales
├─ router/         # Configuración de rutas
├─ App.vue
└─ main.js
```

## Conexión con microservicios

El frontend se conecta con los microservicios de backend (Auth, Product, Order, etc.) mediante **APIs REST**. Asegúrate de configurar correctamente las URLs en `src/config` o variables de entorno.
---
