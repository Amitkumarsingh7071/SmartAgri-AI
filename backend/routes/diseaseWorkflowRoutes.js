const express = require('express');
const router = express.Router();
const {
  createDiseaseReport,
  getDiseaseReports,
  getDiseaseReportById,
  updateTreatmentStep,
  addFollowUpComparison
} = require('../controllers/diseaseWorkflowController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/report', createDiseaseReport);
router.get('/reports', getDiseaseReports);
router.get('/reports/:id', getDiseaseReportById);
router.put('/reports/:id/step', updateTreatmentStep);
router.post('/compare', addFollowUpComparison);

module.exports = router;
