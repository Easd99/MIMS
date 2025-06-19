# 🧱 MIMS

Este proyecto está basado en **NestJS** y utiliza **Prisma ORM** con una base de datos **PostgreSQL**. La arquitectura se compone de dos microservicios independientes:

- 🧑 **Users Service** – Disponible en [http://localhost:5000](http://localhost:5000)
- 📦 **Orders Service** – Disponible en [http://localhost:5001](http://localhost:5001)

Además, se ha configurado un servidor **NGINX** para servir como reverse proxy. Esto permite que las peticiones a los microservicios se canalicen a través del puerto estándar **:80**:

Ejemplo:
- `http://localhost/api/v1/users` → Users Service
- `http://localhost/api/v1/orders` → Orders Service

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

Este proyecto está preparado para ejecutarse fácilmente con **Docker Compose**.

### 🔧 Pasos de ejecución

1. Clona el repositorio:

```bash
git clone https://github.com/Easd99/MIMS.git
```

2. Ingresa a la carpeta del proyecto:

```bash
cd MIMS
```

3. Levanta los servicios:

```bash
docker-compose up --build
```

Esto se encargará de:

- Construir los microservicios
- Crear la base de datos PostgreSQL
- Aplicar migraciones
- Ejecutar la seed inicial de productos
- Levantar el servidor NGINX como gateway en el puerto :80

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
NATS_URL=               # URL de conexión al servidor NATS
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

## 🧪 Pruebas End-to-End (E2E)

El proyecto incluye pruebas end-to-end utilizando [Jest](https://jestjs.io/) y [Supertest](https://github.com/visionmedia/supertest) para verificar el comportamiento completo de los endpoints.

Para ejecutar las pruebas E2E, asegurate de ir a la carpeta del microservicio correspondiente (`orders-back` o `users-back`) y luego ejecuta:
### Ejecutar pruebas E2E
```bash
npm run test:e2e
```
