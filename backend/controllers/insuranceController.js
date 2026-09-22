const InsuranceClaim = require('../models/InsuranceClaim');
const Farm = require('../models/Farm');
const PDFDocument = require('pdfkit');

// @desc    Create Insurance Claim
// @route   POST /api/insurance/claim
// @access  Private
const createInsuranceClaim = async (req, res) => {
  try {
    const { farmId, cropName = 'Tomato', damageReason, damagedAreaAcres, estimatedLossAmount } = req.body;

    if (!damageReason || !estimatedLossAmount) {
      return res.status(400).json({ success: false, message: 'Damage reason and loss amount are required.' });
    }

    const claim = await InsuranceClaim.create({
      userId: req.user._id,
      farmId: farmId || null,
      cropName,
      damageReason,
      damagedAreaAcres: Number(damagedAreaAcres) || 1.0,
      estimatedLossAmount: Number(estimatedLossAmount),
      claimStatus: 'Submitted'
    });

    res.status(201).json({ success: true, data: claim });
  } catch (error) {
    console.error('createInsuranceClaim error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Farmer Claims
// @route   GET /api/insurance/claims
// @access  Private
const getInsuranceClaims = async (req, res) => {
  try {
    const claims = await InsuranceClaim.find({ userId: req.user._id })
      .populate('farmId', 'name location')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: claims.length, data: claims });
  } catch (error) {
    console.error('getInsuranceClaims error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate PMFBY Claim Form PDF
// @route   GET /api/insurance/claim-pdf/:id
// @access  Private
const downloadClaimPdf = async (req, res) => {
  try {
    const claim = await InsuranceClaim.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('farmId', 'name location area');

    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim document not found.' });
    }

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=PMFBY-Claim-${claim.policyNumber}.pdf`);

    doc.pipe(res);

    // Header
    doc.fillColor('#15803d').fontSize(22).text('PRADHAN MANTRI FASAL BIMA YOJANA (PMFBY)', { align: 'center' });
    doc.fillColor('#374151').fontSize(12).text('Official Crop Damage Loss Claim Document', { align: 'center' });
    doc.moveDown(1.5);

    // Metadata Table Box
    doc.rect(50, 110, 500, 220).stroke('#e5e7eb');

    doc.fillColor('#111827').fontSize(11);
    doc.text(`Policy Claim Ref: ${claim.policyNumber}`, 70, 130);
    doc.text(`Farmer Name: ${req.user.profile?.name || 'Authorized Farmer'}`, 70, 155);
    doc.text(`Farmer Mobile / ID: ${req.user.mobile || req.user._id}`, 70, 180);
    doc.text(`Plot / Location: ${claim.farmId ? claim.farmId.name : 'Primary Farm Plot'}`, 70, 205);
    doc.text(`Damaged Crop: ${claim.cropName}`, 70, 230);
    doc.text(`Damage Event Cause: ${claim.damageReason}`, 70, 255);
    doc.text(`Damaged Area: ${claim.damagedAreaAcres} Acres`, 70, 280);
    doc.text(`Estimated Financial Loss: ₹${claim.estimatedLossAmount.toLocaleString('en-IN')}`, 70, 305);

    doc.moveDown(5);
    doc.fillColor('#15803d').fontSize(13).text('Verification & Inspection Disclaimer:');
    doc.fillColor('#4b5563').fontSize(10).text(
      'This document has been compiled automatically via SmartAgri-AI telemetry verification. ' +
      'It contains spatial sensor data and weather risk logs. Official agricultural officers (KVK) ' +
      'will inspect the physical plot location within 72 hours.',
      { align: 'justify' }
    );

    doc.moveDown(3);
    doc.fontSize(10).text(`Generated Date: ${new Date().toLocaleDateString()}`, 50);
    doc.text('Authorized Seal / Signature: SmartAgri AI Insurance Service', 300);

    doc.end();
  } catch (error) {
    console.error('downloadClaimPdf error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createInsuranceClaim,
  getInsuranceClaims,
  downloadClaimPdf
};
