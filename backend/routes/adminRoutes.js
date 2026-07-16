const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getFarmersList,
  broadcastNotification,
  createScheme,
  updateMandiPrice,
  exportFarmersCSV,
  exportFarmsCSV,
  exportSoilCSV
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('admin')); // Restrict all these endpoints to Admins

router.route('/dashboard-stats')
  .get(getDashboardStats);

router.route('/farmers')
  .get(getFarmersList);

router.route('/notifications')
  .post(broadcastNotification);

router.route('/schemes')
  .post(createScheme);

router.route('/prices')
  .post(updateMandiPrice);

// Report Exports (CSV downloads)
router.route('/reports/farmers')
  .get(exportFarmersCSV);

router.route('/reports/farms')
  .get(exportFarmsCSV);

router.route('/reports/soil')
  .get(exportSoilCSV);

module.exports = router;
