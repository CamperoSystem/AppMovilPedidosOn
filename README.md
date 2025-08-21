🛒 Tienda App - Dashboard Admin & App de Pedidos

📌 Descripción

Sistema de gestión de pedidos para una tienda, que incluye:

Dashboard Admin: Gestión de usuarios, productos y pedidos.

Aplicación Cliente: Visualización de productos, carrito y realización de pedidos.

Backend con Node.js y MySQL: CRUD completo, autenticación y historial de pedidos.

🎨 Capturas de pantalla

Dashboard Admin – Usuarios

<img width="268" height="584" alt="image" src="https://github.com/user-attachments/assets/c38f4c5c-d7a0-4048-8139-f573f688f2b7" />

Dashboard Admin – Productos

<img width="267" height="584" alt="image" src="https://github.com/user-attachments/assets/2eb7a830-629e-47f2-8d89-d4ba92501277" />

Dashboard Admin – Pedidos

<img width="270" height="590" alt="image" src="https://github.com/user-attachments/assets/e8b77bbd-bfca-4961-8d1a-b06a02ba14aa" />

App Cliente – Catálogo de Productos

<img width="272" height="589" alt="image" src="https://github.com/user-attachments/assets/e133b9f9-733d-4c29-b5f9-98a241821d3a" />

App Cliente – Carrito y Pedido

<img width="273" height="591" alt="image" src="https://github.com/user-attachments/assets/1f1c7ec0-0cb1-4f33-8ab5-84d2623f7b41" />

App Cliente – Historial de Pedidos


<img width="267" height="585" alt="image" src="https://github.com/user-attachments/assets/ec794695-7a11-48b9-93af-449405711c63" />




🛠 Tecnologías utilizadas

Frontend: React Native + Expo + TypeScript

Backend: Node.js + Express

Base de datos: MySQL 8+

Almacenamiento local: AsyncStorage

Control de versiones: Git / GitHub

⚙️ Instalación

Clonar el repositorio:

git clone https://github.com/CamperoSystem/AppMovilPedidosOn.git
cd tienda-app


Instalar dependencias:

npm install


Instalar Expo CLI (si no lo tienes):

npm install -g expo-cli


Ejecutar la app:

expo start


Se puede abrir en emulador Android/iOS o dispositivo físico con Expo Go.

🗄 Base de datos MySQL
CREATE DATABASE tienda_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE tienda_app;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE administradores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  estado ENUM('PENDIENTE','CONFIRMADO','PREPARANDO','ENVIADO','ENTREGADO','CANCELADO') NOT NULL DEFAULT 'PENDIENTE',
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE pedido_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL CHECK (cantidad > 0),
  precio_unit DECIMAL(10,2) NOT NULL CHECK (precio_unit >= 0),
  subtotal DECIMAL(10,2) AS (cantidad * precio_unit) STORED,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

🚀 Backend - Rutas principales
Usuarios

POST /login → Iniciar sesión de usuario

GET /usuarios → Listar usuarios (admin)

POST /usuarios → Crear usuario (admin)

PUT /usuarios/:id → Editar usuario (admin)

DELETE /usuarios/:id → Eliminar usuario (admin)

Productos

GET /productos → Listar productos activos

POST /productos → Crear producto

PUT /productos/:id → Editar producto

DELETE /productos/:id → Eliminar producto

Pedidos

POST /pedidos → Crear pedido desde app cliente

GET /pedidos/:usuarioId → Historial de pedidos por usuario

GET /admin/pedidos → Listar todos los pedidos (admin)

PUT /admin/pedidos/:id → Cambiar estado del pedido

DELETE /admin/pedidos/:id → Eliminar pedido

📝 Notas importantes

Contraseñas actualmente en texto plano, se recomienda bcrypt para seguridad.

El proyecto está configurado para IP local (192.168.x.x). Cambiar según tu red.

Admin puede gestionar usuarios, productos y pedidos directamente desde el dashboard.

AsyncStorage mantiene la sesión de usuario en la app móvil.

📂 Estructura del proyecto
AppMovilPedidosOn/
│
├─ app/
│   ├─ dashboardAdmin.tsx
│   ├─ admin/
│   │   ├─ usuarios.tsx
│   │   ├─ productos.tsx
│   │   └─ pedidos.tsx
│   └─ loginUsuario.tsx
│
├─ backend/
│   └─ index.js
│
├─ package.json
├─ tsconfig.json
└─ README.md
