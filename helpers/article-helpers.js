const axios = require('axios')
const { v4: uuid } = require('uuid')
const crypto = require('crypto')
const { v2: cloudinary } = require('cloudinary')
const qrCode = require('qrcode')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const generateShortenUrl = () => {
  const uniqueId = uuid()
  const hash = crypto.createHash('sha256').update(uniqueId).digest('hex')
  const shortenUrl = hash.substring(0, 6)

  return shortenUrl
}

const generateQRCode = async (originUrl) => {
  try {
    const qrCodeDataUrl = await qrCode.toDataURL(originUrl)
    const uploadQrCode = await cloudinary.uploader.upload(qrCodeDataUrl, {
      folder: 'qrCodes'
    })

    return uploadQrCode.url
  } catch (error) {
    throw new Error(error.message)
  }
}

const generateSummary = async (originUrl) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://article-extractor-and-summarizer.p.rapidapi.com/summarize',
      params: {
        url: originUrl,
        length: '3'
      },
      headers: {
        'X-RapidAPI-Key': process.env.API_KEY,
        'X-RapidAPI-Host': 'article-extractor-and-summarizer.p.rapidapi.com'
      }
    }

    const response = await axios.request(options)
    return response.data.summary
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = {
  generateShortenUrl,
  generateQRCode,
  generateSummary
}
