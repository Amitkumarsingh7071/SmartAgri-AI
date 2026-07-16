const express = require('express');
const router = express.Router();
const {
  getSoilRecords,
  getSoilRecordById,
  createSoilRecord,
  deleteSoilRecord,
  downloadSoilCardPDF
} = require('../controllers/soilController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Secure all routes

router.route('/')
  .get(getSoilRecords)
  .post(createSoilRecord);

router.route('/:id')
  .get(getSoilRecordById)
  .delete(deleteSoilRecord);

router.route('/:id/card')
  .get(downloadSoilCardPDF);

module.exports = router;
