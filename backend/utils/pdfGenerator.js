const PDFDocument = require('pdfkit');

/**
 * Generates a Soil Health Card PDF and pipes it to the HTTP response.
 * @param {Object} res - Express response stream
 * @param {Object} farmer - User document
 * @param {Object} farm - Farm document
 * @param {Object} record - SoilRecord document
 */
const generateSoilHealthPDF = (res, farmer, farm, record) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  // Pipe the document directly to the response
  doc.pipe(res);

  // Styling helpers
  const primaryColor = '#1e3a8a'; // Dark blue
  const secondaryColor = '#10b981'; // Green
  const darkText = '#1f2937';
  const lightText = '#6b7280';

  // --- Header ---
  doc.rect(0, 0, 595.28, 120).fill(primaryColor);
  doc.fillColor('#ffffff')
     .fontSize(22)
     .font('Helvetica-Bold')
     .text('SMART AGRICULTURE INITIATIVE', 50, 40)
     .fontSize(14)
     .text('National Soil Health & Fertilizer Database Card', 50, 68);

  // --- Card Meta Info ---
  doc.fillColor(darkText)
     .fontSize(10)
     .font('Helvetica-Bold')
     .text(`Card Reference ID: SHC-${record._id.toString().substring(0, 8).toUpperCase()}`, 380, 140, { align: 'right' })
     .text(`Date of Analysis: ${new Date(record.recordedAt).toLocaleDateString()}`, 380, 155, { align: 'right' });

  // --- Farmer and Farm Details ---
  doc.rect(50, 180, 495, 110).lineWidth(1).stroke('#e5e7eb');
  
  doc.fontSize(12).font('Helvetica-Bold').fillColor(primaryColor).text('Farmer & Farm Profile', 65, 190);
  
  // Left Column
  doc.fontSize(10).font('Helvetica').fillColor(darkText)
     .text(`Farmer Name:   ${farmer.profile.name}`, 65, 215)
     .text(`Farmer ID:          ${farmer.profile.farmerId || 'N/A'}`, 65, 230)
     .text(`Location:            ${farmer.profile.village || ''}, ${farmer.profile.district || ''}, ${farmer.profile.state || ''}`, 65, 245)
     .text(`Phone:                ${farmer.profile.phone || ''}`, 65, 260);

  // Right Column
  doc.text(`Farm Name:          ${farm.name}`, 300, 215)
     .text(`Farm Size:             ${farm.area} Acres`, 300, 230)
     .text(`Soil Classification: ${farm.soilType}`, 300, 245)
     .text(`Irrigation Source:  ${farm.waterSource}`, 300, 260);

  // --- Soil Chemistry Dashboard Title ---
  doc.fontSize(14).font('Helvetica-Bold').fillColor(primaryColor).text('Soil Chemistry Analysis Dashboard', 50, 310);
  
  // --- Soil Chemistry Table Headers ---
  const tableTop = 335;
  doc.rect(50, tableTop, 495, 25).fill(secondaryColor);
  
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(10)
     .text('Soil Parameter', 65, tableTop + 8)
     .text('Observed Value', 200, tableTop + 8)
     .text('Optimal Level', 320, tableTop + 8)
     .text('Health Status', 450, tableTop + 8);

  // --- Soil Chemistry Table Rows ---
  const rows = [
    { label: 'Nitrogen (N)', val: `${record.N} ppm`, optimal: '120 - 240 ppm', status: record.N < 120 ? 'Low' : record.N > 240 ? 'High' : 'Optimal' },
    { label: 'Phosphorus (P)', val: `${record.P} ppm`, optimal: '30 - 60 ppm', status: record.P < 30 ? 'Low' : record.P > 60 ? 'High' : 'Optimal' },
    { label: 'Potassium (K)', val: `${record.K} ppm`, optimal: '150 - 300 ppm', status: record.K < 150 ? 'Low' : record.K > 300 ? 'High' : 'Optimal' },
    { label: 'Acidity (pH)', val: `${record.pH}`, optimal: '6.0 - 7.5', status: record.pH < 6.0 ? 'Acidic' : record.pH > 7.5 ? 'Alkaline' : 'Normal' },
    { label: 'Organic Carbon', val: `${record.organicCarbon}%`, optimal: '0.5% - 1.5%', status: record.organicCarbon < 0.5 ? 'Depleted' : 'Rich' },
    { label: 'Moisture Level', val: `${record.moisture}%`, optimal: '30% - 60%', status: record.moisture < 30 ? 'Dry' : record.moisture > 60 ? 'Wet' : 'Adequate' }
  ];

  let currentTop = tableTop + 25;
  doc.font('Helvetica').fontSize(10).fillColor(darkText);

  rows.forEach((row, i) => {
    // Row background stripes
    if (i % 2 === 1) {
      doc.rect(50, currentTop, 495, 20).fill('#f9fafb');
      doc.fillColor(darkText);
    }

    doc.text(row.label, 65, currentTop + 5)
       .text(row.val, 200, currentTop + 5)
       .text(row.optimal, 320, currentTop + 5);

    // Status Color Coding
    if (row.status === 'Optimal' || row.status === 'Normal' || row.status === 'Rich' || row.status === 'Adequate') {
      doc.fillColor('#047857').font('Helvetica-Bold');
    } else if (row.status === 'Low' || row.status === 'Acidic' || row.status === 'Depleted' || row.status === 'Dry') {
      doc.fillColor('#b91c1c').font('Helvetica-Bold');
    } else {
      doc.fillColor('#d97706').font('Helvetica-Bold');
    }
    
    doc.text(row.status, 450, currentTop + 5);
    doc.font('Helvetica').fillColor(darkText); // reset
    currentTop += 20;
  });

  // --- Health Recommendation Summary ---
  doc.fontSize(12).font('Helvetica-Bold').fillColor(primaryColor).text('Agronomist & AI Treatment Recommendations', 50, 485);
  doc.rect(50, 505, 495, 110).lineWidth(1).stroke('#e5e7eb');

  // Generate recommendations based on soil NPK
  let recommendText = '';
  if (record.N < 120) {
    recommendText += '• Nitrogen deficiency detected. Apply Urea or Ammonium Nitrate fertilizer.\n';
  }
  if (record.P < 30) {
    recommendText += '• Phosphorus deficiency detected. Apply Single Super Phosphate (SSP) or DAP.\n';
  }
  if (record.K < 150) {
    recommendText += '• Potassium deficiency detected. Apply Muriate of Potash (MOP) to improve disease resistance.\n';
  }
  if (record.pH < 6.0) {
    recommendText += '• Soil is acidic. Add agricultural Lime (Calcium Carbonate) to neutralize pH levels.\n';
  } else if (record.pH > 7.5) {
    recommendText += '• Soil is alkaline. Apply agricultural Gypsum (Calcium Sulfate) to reduce alkalinity.\n';
  }
  if (record.organicCarbon < 0.5) {
    recommendText += '• Low organic carbon. Work in well-rotted farmyard manure (FYM) or green compost.\n';
  }

  if (recommendText === '') {
    recommendText = '• Soil chemistry is balanced and healthy! Maintain current organic composting schedules.\n• Recommended crops: Rice, Wheat, Sugarcane, Cotton, or Maize.';
  } else {
    recommendText += '• Crop Suitability: Legumes (Beans, Peas) are recommended to fix nitrogen naturally.\n• Soil Health Status: Action Required to optimize crop yield.';
  }

  doc.fontSize(9.5).font('Helvetica').fillColor(darkText)
     .text(recommendText, 65, 520, { lineGap: 4 });

  // --- Disclaimer & Signature ---
  doc.fontSize(8).fillColor(lightText)
     .text('This is a digitally generated Soil Health Card based on sensor telemetry. Recommendations are general agronomic advisory inputs and should be verified in local conditions.', 50, 720, { width: 495, align: 'center' });

  doc.fontSize(10).font('Helvetica-Bold').fillColor(primaryColor)
     .text('Smart Agri AI Lab Director', 380, 680, { align: 'right' })
     .fontSize(8).font('Helvetica').fillColor(lightText)
     .text('Authorized Digital Signature', 380, 695, { align: 'right' });

  // Draw signature line
  doc.moveTo(380, 675).lineTo(545, 675).stroke(primaryColor);

  // End the document
  doc.end();
};

module.exports = { generateSoilHealthPDF };
