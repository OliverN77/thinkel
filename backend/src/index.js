require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorMiddleware = require('./middlewares/error.middleware');
const authRoutes = require('./routes/auth.routes');
const contactRoutes = require('./routes/contact.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const fs = require('fs');

const app = express();
connectDB();

// Crear directorio de uploads si no existe
const uploadsDir = path.join(__dirname, '../uploads/avatars');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// CORS configurado para producción
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://thinkel.onrender.com',
    process.env.FRONTEND_URL || '*'
  ],
  credentials: true
}));

app.use(express.json());

// Servir archivos estáticos (avatars)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Ruta raíz para verificar que el servidor está corriendo
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: '✅ Thinkel API está corriendo correctamente',
    version: '1.0.0',
    status: 'OK',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile'
      },
      posts: {
        getAll: 'GET /api/posts',
        getOne: 'GET /api/posts/:id',
        create: 'POST /api/posts',
        update: 'PUT /api/posts/:id',
        delete: 'DELETE /api/posts/:id'
      },
      comments: 'GET/POST /api/comments',
      contact: 'POST /api/contact'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// Ruta 404 para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.originalUrl} no encontrada`,
    availableEndpoints: '/api/auth, /api/posts, /api/comments, /api/contact'
  });
});

// Middleware de error al final
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL: ${process.env.NODE_ENV === 'production' ? 'https://thinkel.onrender.com' : `http://localhost:${PORT}`}`);
});
