module.exports = function (err, req, res, next) {
  const status = err.statusCode || 500;
  const message = err.message || 'Error del servidor';
  res.status(status).json({ message });
};