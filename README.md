# 🧱 MIMS

Este proyecto está basado en **NestJS** y utiliza **Prisma ORM** con una base de datos **PostgreSQL**. La arquitectura se compone de dos microservicios independientes:

- 🧑 **Users Service**
- 📦 **Orders Service**

## 🚀 Características

- ⚙️ Backend en NestJS
- 🧬 ORM Prisma
- 🐘 Base de datos PostgreSQL
- 🧩 Comunicación entre microservicios vía NATS
- 🛠 Seed automática para productos (2 productos por defecto)
- 🧪 Documentación de endpoints en Postman

📄 **Documentación API completa:**  
[https://documenter.getpostman.com/view/24702282/2sB2x9kAzm](https://documenter.getpostman.com/view/24702282/2sB2x9kAzm)

---

## 🐳 Instalación con Docker

Este proyecto está preparado para ejecutarse fácilmente con **Docker Compose**. Solo necesitas:

```bash
docker-compose up --build
```

Esto se encargará de:

- Construir los microservicios
- Crear la base de datos PostgreSQL
- Aplicar migraciones
- Ejecutar la seed inicial de productos

---

## 🌱 Seed de productos

El servicio de órdenes incluye una **seed automática** que crea 2 productos iniciales:

1. **Camiseta Roja** – Talla M – $50.000
2. **Camiseta Verde** – Talla S – $30.000

Esta seed se ejecuta automáticamente cuando se despliegan los contenedores por primera vez.

---

## 🔐 Variables de entorno

Estas variables deben configurarse en un archivo `.env` o dentro del `docker-compose.yml`:

```env
DATABASE_URL=           # URL de conexión a la base de datos PostgreSQL
PORT=                   # Puerto en el que se ejecuta cada microservicio
JWT_SECRET=             # Secreto para firmar tokens JWT
NATS_URL=               # URL de conexión al servidor NATS (si aplica)
```

---

## 📁 Estructura del proyecto

```
.
├── orders-back/              # Microservicio de usuarios (NestJS)
├── users-back/             # Microservicio de órdenes y productos (NestJS)
├── docker-compose.yml  # Entorno de desarrollo completo
└── README.md
```

---

## 🛠 Requisitos

- Docker y Docker Compose
- Node.js (si deseas ejecutar localmente sin Docker)