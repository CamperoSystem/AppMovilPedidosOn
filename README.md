
# Visor de Perfiles de Usuario

Aplicación móvil desarrollada con **React Native + Expo** que permite visualizar perfiles de usuarios conectándose a un **backend Node.js** con **MySQL**.  
La app usa **tabs** para navegar entre pantallas.

---

## 🔹 Funcionalidades

- Lista de usuarios con foto, nombre y rol.
- Vista detalle de cada usuario con información completa:
  - Nombre completo
  - Rol
  - Email
  - Teléfono
  - Descripción
  - Foto de perfil
- Navegación entre lista y detalle usando **Expo Router / tabs**.
- Consumo de API segura a través de backend Node.js conectado a MySQL.

---

## 🛠 Tecnologías utilizadas

- **Frontend:** React Native + Expo + TypeScript + Axios  
- **Backend:** Node.js + Express  
- **Base de datos:** MySQL  
- **Rutas:** Expo Router (basado en archivos y tabs)

---

## 💾 Instalación y ejecución

### 1️⃣ Backend (Node.js + MySQL)

1. Clonar o descargar el repositorio backend:

```bash
git clone <url-backend>
cd backend
Instalar dependencias:
npm install
Configurar conexión MySQL en index.js:
js
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Cambia según tu configuración
  database: 'visor_perfiles'
});
Iniciar servidor:

node index.js
Servidor corriendo en: http://TU_IP_LOCAL:3000

2️⃣ Frontend (Expo React Native con tabs)
Clonar o descargar el repositorio frontend:
git clone <url-frontend>
cd VisorPerfiles
Instalar dependencias:
npm install
Iniciar Expo:
npx expo start
Escanear el QR con Expo Go en tu dispositivo móvil (misma red Wi-Fi que el backend).

Cambiar la IP del backend en index.tsx (lista de usuarios) o donde se haga la petición:
axios.get('http://TU_IP_LOCAL:3000/usuarios')
📂 Estructura del proyecto
Frontend (VisorPerfiles)

app/
├─ (tabs)/
│  ├─ index.tsx          # Lista de usuarios
│  ├─ perfil/[id].tsx    # Detalle de usuario
│  └─ _layout.tsx        # Layout de tabs
├─ +not-found.tsx
package.json
Backend (backend)
backend/
├─ index.js              # Servidor Node.js + Express
├─ package.json
Base de datos (MySQL)
Tabla usuarios con campos:

id, nombre, email, telefono, rol, foto_url, descripcion, fecha_registro
💡 Notas importantes
IP local: La app debe apuntar a la IP de tu PC en la red Wi-Fi.

Red: PC y celular deben estar en la misma red Wi-Fi.

MySQL: Asegúrate de tener la tabla usuarios creada y con datos de prueba.

