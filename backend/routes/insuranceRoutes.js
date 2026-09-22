const express = require('express');
const router = express.Router();
const {
  createInsuranceClaim,
  getInsuranceClaims,
  downloadClaimPdf
} = require('../controllers/insuranceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/claim', createInsuranceClaim);
router.get('/claims', getInsuranceClaims);
router.get('/claim-pdf/:id', downloadClaimPdf);

module.exports = router;
