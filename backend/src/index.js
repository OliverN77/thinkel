require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const connectDB = require('./config/db');
const errorMiddleware = require('./middlewares/error.middleware');

const authRoutes = require('./routes/auth.routes');
const contactRoutes = require('./routes/contact.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');

const app = express();

// 🔹 Conectar a la DB
connectDB();

// 🔹 Crear directorio uploads si no existe (Render lo permite)
const uploadsDir = path.join(__dirname, 'uploads/avatars');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 🔹 CORS configurado para Vercel
app.use(cors({
  origin: [
    'http://localhost:5173',          // desarrollo
    'https://thinkelweb.vercel.app/'  // producción
  ],
  credentials: true
}));

// 🔹 Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Servir archivos estáticos (avatars)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🔹 Rutas
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// 🔹 Middleware de errores (siempre al final)
app.use(errorMiddleware);

// 🔹 Puerto dinámico (OBLIGATORIO en Render)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
