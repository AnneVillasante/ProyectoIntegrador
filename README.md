````markdown
# 🌙 Lunaria Threads - Sistema de Gestión Comercial

![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)
![Express](https://img.shields.io/badge/Express-v4.21-blue.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)
![Build Status](https://img.shields.io/badge/GitLab%20CI-Passing-brightgreen)

**Lunaria Threads** es un Sistema Integrado de Gestión Comercial diseñado para tiendas de ropa, calzado y accesorios. Esta solución web automatiza el control de inventarios, la gestión de ventas, promociones y reportes, centralizando la operación del negocio en una plataforma robusta y escalable.

---

## 🚀 Características Principales

### 🛒 Módulo de Tienda (Cliente)
* **Catálogo Interactivo:** Filtrado dinámico por categorías, precio y tallas.
* **Carrito de Compras:** Gestión de estado persistente y validación de stock en tiempo real.
* **Pasarela de Pagos:** Integración segura con **Stripe** para procesar tarjetas.
* **Perfil de Usuario:** Historial de pedidos y gestión de datos personales.

### 🛠 Panel Administrativo
* **Gestión de Inventario:** CRUD completo de productos con subida de imágenes (**Cloudinary**).
* **Marketing:** Creación de campañas, cupones de descuento y reglas de promoción.
* **Gestión de Pedidos:** Flujo de estados (Procesando, Enviado, Entregado, Devoluciones).
* **Reportes Inteligentes:** Generación de PDFs (**JsReport/Puppeteer**) para ventas e inventarios.
* **Dashboard:** Métricas clave (KPIs) e ingresos en tiempo real.

### 🛡️ Seguridad y Monitoreo
* **Autenticación:** JWT (JSON Web Tokens) y Hash de contraseñas con Bcrypt.
* **Protección:** Uso de `Helmet` para cabeceras HTTP seguras.
* **Auditoría:** Sistema de Logs (`logActividad`) que registra acciones críticas de usuarios.
* **Health Checks:** Endpoint `/health` para monitoreo de disponibilidad.

---

## 🛠️ Stack Tecnológico

* **Backend:** Node.js, Express.js.
* **Base de Datos:** MySQL (con `mysql2`).
* **Frontend:** HTML5, CSS3, JavaScript (Vanilla ES6+).
* **Servicios Externos:**
    * **Stripe:** Procesamiento de pagos.
    * **Cloudinary:** Almacenamiento de imágenes en la nube.
* **Testing:** Jest, Supertest, Fuzzing.
* **DevOps:** GitLab CI/CD (Pipelines de prueba y seguridad).

---

## 📋 Pre-requisitos

Asegúrate de tener instalado lo siguiente:
* [Node.js](https://nodejs.org/) (v20 o superior recomendado)
* [MySQL](https://www.mysql.com/) (v8.0)
* Git

---

## 🔧 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <url-de-tu-repo>
cd proyectointegrador-lunaria-threads
````

### 2\. Configurar Base de Datos

1.  Ingresa a tu cliente MySQL (Workbench o terminal).
2.  Crea la base de datos:
    ```sql
    CREATE DATABASE lunariathreadsdb;
    ```
3.  Ejecuta los scripts ubicados en la carpeta `database/`:
      * Primero: `database/schema.sql` (Crea las tablas).
      * Segundo: `database/seed.sql` (Inserta datos de prueba).

### 3\. Configurar Backend

Ve a la carpeta del servidor e instala las dependencias:

```bash
cd backend
npm install --legacy-peer-deps
```

### 4\. Variables de Entorno

Crea un archivo `.env` en la carpeta `backend/` con las siguientes variables:

```env
# Configuración del Servidor
PORT=4000
NODE_ENV=development

# Base de Datos
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_password_mysql
DB_NAME=lunariathreadsdb

# Seguridad
JWT_SECRET=tu_secreto_super_seguro
JWT_EXPIRES_IN=1d

# Servicios Externos
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

STRIPE_SECRET_KEY=sk_test_...
```

-----

## ▶️ Ejecución

Para iniciar el servidor en modo desarrollo (con recarga automática):

```bash
# Desde la carpeta /backend
npm run dev
```

El servidor iniciará en: `http://localhost:4000`

  * **Frontend:** Accesible en la ruta raíz `/`
  * **API:** Accesible en `/api/...`

-----

## 🧪 Pruebas (Testing)

El proyecto cuenta con una suite de pruebas automatizadas (Unitarias, Integración y Seguridad).

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas unitarias
npm run test:unit

# Ejecutar pruebas de seguridad (Fuzzing)
npm run test:security
```

-----

## 📂 Estructura del Proyecto

```
/
├── backend/            # Lógica del servidor (Node/Express)
│   ├── config/         # Configuración de DB y servicios
│   ├── controllers/    # Lógica de negocio
│   ├── dao/            # Acceso a datos (SQL queries)
│   ├── models/         # Definiciones de tipos/modelos
│   ├── routes/         # Definición de endpoints API
│   ├── server/         # Configuración de Express
│   ├── services/       # Lógica compleja y servicios externos
│   └── tests/          # Tests con Jest
├── database/           # Scripts SQL (Schema y Seeds)
└── frontend/           # Interfaz de usuario
    ├── assets/         # CSS, JS, Imágenes
    ├── components/     # Fragmentos HTML reutilizables (Navbar, Footer)
    └── pages/          # Vistas principales (HTML)
```

-----

## 👥 Autores

  * **Anne Villasante** - *Desarrollo Full Stack & Gestión del Proyecto* - [GitLab/GitHub Profile]

-----

*Proyecto desarrollado para el Curso Integrador I - Sistemas Software, UTP 2025.*

```
