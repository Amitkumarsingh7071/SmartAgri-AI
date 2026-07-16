const QRCode = require('qrcode');

/**
 * Generates a Base64 Data URL for a QR Code representation of the user
 * @param {string} text - Content to encode
 * @returns {Promise<string>} Base64 Data URL
 */
const generateQR = async (text) => {
  try {
    return await QRCode.toDataURL(text);
  } catch (err) {
    console.error('QR Generation Error:', err);
    return '';
  }
};

module.exports = { generateQR };
