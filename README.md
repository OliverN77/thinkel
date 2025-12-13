# Thinkel

Plataforma de blog completa con sistema de autenticación, perfiles de usuario, y funcionalidades sociales.

## 🚀 Características

- ✅ Autenticación de usuarios (registro/login con JWT)
- ✅ Creación y edición de publicaciones con editor Markdown
- ✅ Sistema de likes y guardados (favoritos)
- ✅ Perfiles de usuario con estadísticas
- ✅ Sistema de comentarios con respuestas
- ✅ Dashboard personalizado
- ✅ Tema claro/oscuro
- ✅ Diseño responsive con Tailwind CSS

## 🛠️ Tecnologías

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router v6
- Axios
- Framer Motion
- React Markdown

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcrypt
- Multer (subida de imágenes)

## 📦 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/OliverN77/thinkel.git
cd thinkel
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env` en la carpeta `backend`:
```env
PORT=5000
MONGODB_URI=tu_mongodb_uri
JWT_SECRET=tu_jwt_secret
```

### 3. Configurar Frontend

```bash
cd ../frontend
npm install
```

Crear archivo `.env` en la carpeta `frontend`:
```env
VITE_API_URL=http://localhost:5000
```

## 🚀 Ejecución

### Desarrollo

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Producción

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 🔑 Variables de Entorno

### Backend (.env)
- `PORT` - Puerto del servidor (default: 5000)
- `MONGODB_URI` - URI de conexión a MongoDB
- `JWT_SECRET` - Secreto para firmar tokens JWT

### Frontend (.env)
- `VITE_API_URL` - URL del backend API

## 📝 Licencia

Este proyecto es de código abierto.

## 👤 Autor

Oliver
