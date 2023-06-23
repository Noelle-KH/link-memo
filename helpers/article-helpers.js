const axios = require('axios')
const crypto = require('crypto')
const qrCode = require('qrcode')
const { v4: uuid } = require('uuid')

const cloudinary = require('../config/cloudinary')

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
