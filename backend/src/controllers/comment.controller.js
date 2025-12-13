const Comment = require('../models/comment.model');
const Post = require('../models/post.model');

// Crear comentario
const createComment = async (req, res, next) => {
  try {
    const { postId, content, parentId } = req.body;

    if (!postId || !content) {
      return res.status(400).json({
        success: false,
        message: 'El ID del post y el contenido son obligatorios'
      });
    }

    // Verificar que el post existe
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }

    // Si es una respuesta, verificar que el comentario padre existe
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: 'Comentario padre no encontrado'
        });
      }
    }

    // Crear comentario
    const comment = await Comment.create({
      postId,
      content,
      parentId: parentId || null,
      author: {
        userId: req.user._id,
        name: req.user.name,
        avatar: req.user.avatar || null
      }
    });

    // Incrementar contador de comentarios en el post
    post.comments += 1;
    await post.save();

    res.status(201).json({
      success: true,
      message: 'Comentario creado exitosamente',
      data: comment
    });
  } catch (error) {
    console.error('Error in createComment:', error);
    next(error);
  }
};

// Obtener comentarios de un post
const getCommentsByPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { sort = '-createdAt' } = req.query;

    // Verificar que el post existe
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }

    // Obtener solo comentarios principales (sin parentId)
    const comments = await Comment.find({ 
      postId, 
      parentId: null 
    }).sort(sort);

    // Obtener respuestas para cada comentario
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ 
          parentId: comment._id 
        }).sort('createdAt');

        return {
          ...comment.toObject(),
          replies
        };
      })
    );

    res.status(200).json({
      success: true,
      data: commentsWithReplies,
      total: comments.length
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar comentario
const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comentario no encontrado'
      });
    }

    // Verificar que el usuario sea el autor
    if (comment.author.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para editar este comentario'
      });
    }

    if (content) {
      comment.content = content;
      await comment.save();
    }

    res.status(200).json({
      success: true,
      message: 'Comentario actualizado',
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar comentario
const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comentario no encontrado'
      });
    }

    // Verificar que el usuario sea el autor
    if (comment.author.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar este comentario'
      });
    }

    // Eliminar respuestas asociadas
    await Comment.deleteMany({ parentId: id });

    // Decrementar contador de comentarios en el post
    const post = await Post.findById(comment.postId);
    if (post) {
      const totalDeleted = await Comment.countDocuments({ parentId: id }) + 1;
      post.comments = Math.max(0, post.comments - totalDeleted);
      await post.save();
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Comentario eliminado'
    });
  } catch (error) {
    next(error);
  }
};

// Like/Unlike comentario
const toggleLikeComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comentario no encontrado'
      });
    }

    const hasLiked = comment.likedBy.includes(userId);

    if (hasLiked) {
      comment.likedBy = comment.likedBy.filter(id => id.toString() !== userId.toString());
      comment.likes = Math.max(0, comment.likes - 1);
    } else {
      comment.likedBy.push(userId);
      comment.likes += 1;
    }

    await comment.save();

    res.status(200).json({
      success: true,
      message: hasLiked ? 'Like removido' : 'Like agregado',
      data: {
        likes: comment.likes,
        liked: !hasLiked
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
  toggleLikeComment
};
