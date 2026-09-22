const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const {
  createDiseaseReport,
  getDiseaseReports,
  getDiseaseReportById,
  updateTreatmentStep,
  addFollowUpComparison,
  detectDiseaseProxy
} = require('../controllers/diseaseWorkflowController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/detect-disease', upload.single('image'), detectDiseaseProxy);
router.post('/report', createDiseaseReport);
router.get('/reports', getDiseaseReports);
router.get('/reports/:id', getDiseaseReportById);
router.put('/reports/:id/step', updateTreatmentStep);
router.post('/compare', addFollowUpComparison);

module.exports = router;
