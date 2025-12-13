const Post = require('../models/post.model');

// Crear nuevo post
const createPost = async (req, res, next) => {
  try {
    const { title, content, description, thumbnail, tags } = req.body;
    
    console.log('Creating post - User:', req.user);
    console.log('Post data:', { title, content, description });
    
    // Validaciones
    if (!title || !content || !description) {
      return res.status(400).json({ 
        success: false, 
        message: 'Título, contenido y descripción son obligatorios' 
      });
    }

    // Verificar que el usuario esté autenticado
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false, 
        message: 'Debes estar autenticado para crear un post' 
      });
    }

    // Obtener información del autor desde el token JWT
    const author = {
      userId: req.user._id,
      name: req.user.name,
      username: req.user.username || req.user.email.split('@')[0],
      avatar: req.user.avatar || null,
      bio: req.user.bio || ''
    };

    const post = await Post.create({
      title,
      content,
      description,
      thumbnail: thumbnail || null,
      author,
      tags: tags || []
    });

    res.status(201).json({
      success: true,
      message: 'Post creado exitosamente',
      data: post
    });
  } catch (error) {
    console.error('Error in createPost:', error);
    next(error);
  }
};

// Obtener todos los posts (con paginación y filtros)
const getAllPosts = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      tag, 
      author, 
      search,
      sort = '-createdAt' 
    } = req.query;

    const query = { published: true };

    if (tag) {
      query.tags = tag;
    }

    if (author) {
      query['author.userId'] = author;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const posts = await Post.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtener un post por slug
const getPostBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const post = await Post.findOne({ slug, published: true });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }

    post.views += 1;
    await post.save();

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// Obtener un post por ID
const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar post
const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, description, thumbnail, tags, published } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }

    if (post.author.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para editar este post'
      });
    }

    if (title) post.title = title;
    if (content) post.content = content;
    if (description) post.description = description;
    if (thumbnail !== undefined) post.thumbnail = thumbnail;
    if (tags) post.tags = tags;
    if (published !== undefined) post.published = published;

    if (title && title !== post.title) {
      post.slug = undefined;
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: 'Post actualizado exitosamente',
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar post
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }

    if (post.author.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar este post'
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// Like/Unlike post
const toggleLike = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }

    const hasLiked = post.likedBy.includes(userId);

    if (hasLiked) {
      post.likedBy = post.likedBy.filter(id => id.toString() !== userId.toString());
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(userId);
      post.likes += 1;
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: hasLiked ? 'Like removido' : 'Like agregado',
      data: {
        likes: post.likes,
        liked: !hasLiked
      }
    });
  } catch (error) {
    next(error);
  }
};

// Bookmark/Unbookmark post
const toggleBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }

    const hasBookmarked = post.bookmarkedBy.includes(userId);

    if (hasBookmarked) {
      post.bookmarkedBy = post.bookmarkedBy.filter(id => id.toString() !== userId.toString());
    } else {
      post.bookmarkedBy.push(userId);
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: hasBookmarked ? 'Bookmark removido' : 'Bookmark agregado',
      data: {
        bookmarked: !hasBookmarked
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtener estadísticas del usuario
const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const totalPosts = await Post.countDocuments({ 'author.userId': userId });

    const postsWithLikes = await Post.find({ 'author.userId': userId }).select('likes');
    const totalLikes = postsWithLikes.reduce((sum, post) => sum + post.likes, 0);

    const postsWithComments = await Post.find({ 'author.userId': userId }).select('comments');
    const totalComments = postsWithComments.reduce((sum, post) => sum + post.comments, 0);

    const savedPosts = await Post.countDocuments({ bookmarkedBy: userId });

    res.status(200).json({
      success: true,
      data: {
        totalPosts,
        totalLikes,
        totalComments,
        savedPosts
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtener posts del usuario autenticado
const getMyPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ 'author.userId': req.user._id })
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Post.countDocuments({ 'author.userId': req.user._id });

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtener posts guardados (bookmarked)
const getBookmarkedPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ 
      bookmarkedBy: req.user._id,
      published: true 
    })
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Post.countDocuments({ 
      bookmarkedBy: req.user._id,
      published: true 
    });

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostBySlug,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  toggleBookmark,
  getUserStats,
  getMyPosts,
  getBookmarkedPosts
};
