const { Parser } = require('json2csv');

/**
 * Parses JSON data and outputs a CSV download.
 * @param {Object} res - Express response stream
 * @param {Array<string>} fields - Field headers for the CSV
 * @param {Array<Object>} data - Array of data objects to parse
 * @param {string} filename - Download file name
 */
const exportCSV = (res, fields, data, filename) => {
  try {
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    return res.status(200).send(csv);
  } catch (error) {
    console.error('CSV Generation Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate CSV report' });
  }
};

module.exports = { exportCSV };
