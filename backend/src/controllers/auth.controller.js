const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Registrar usuario
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    console.log('📝 Intento de registro:', { name, email });

    // Validaciones
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y contraseña son obligatorios'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email inválido'
      });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    // Generar token JWT
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );

    console.log('✅ Usuario registrado exitosamente:', user.email);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Error en register:', error);
    next(error);
  }
};

// Login de usuario
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Intento de login:', email);

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son obligatorios'
      });
    }

    // Buscar usuario
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );

    console.log('✅ Login exitoso:', user.email);

    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    next(error);
  }
};

// Obtener perfil del usuario autenticado
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Error en getProfile:', error);
    next(error);
  }
};

// Actualizar perfil
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Actualizar campos
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;

    // Si se subió un avatar
    if (req.file) {
      user.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    await user.save();

    console.log('✅ Perfil actualizado:', user.email);

    res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Error en updateProfile:', error);
    next(error);
  }
};

// ✅ Exportar todas las funciones
module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
