const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/authmiddleware');
const { getKPIs, getSalesHistory } = require('../controllers/dashboardController');

// All dashboard routes require admin authentication
router.get('/kpis', requireAuth, requireRole('ADMIN'), getKPIs);
router.get('/history', requireAuth, requireRole('ADMIN'), getSalesHistory);

module.exports = router;

