const createError = require('http-errors')
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')

const cloudinary = require('../config/cloudinary')

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'avatars'
  }
})

const fileFilter = (req, file, cb) => {
  const fileType = file.mimetype.split('/')
  if (!(fileType[0] === 'image' && fileType[1] !== 'svg+xml')) {
    return cb(
      createError.BadRequest('Invalid image(accept .jpg, .jpeg or .png)')
    )
  }

  cb(null, true)
}

const fileSize = 20 * 1024 * 1024

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize }
})

module.exports = upload
