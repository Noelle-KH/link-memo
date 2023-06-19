const errorHandler = (error, req, res, next) => {
  const status = error.status || 500
  const errors = {
    status,
    message: error.message
  }

  res.status(status).json({ errors })

  next(error)
}

module.exports = errorHandler
