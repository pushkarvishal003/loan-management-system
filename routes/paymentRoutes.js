const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const {
  makePayment,
  getPaymentHistory,
  getUpcomingEMIs,
  getPaymentStats,
} = require('../controllers/paymentController');

const router = express.Router();

router.post('/make-payment', authMiddleware, makePayment);
router.get('/:loanId/history', authMiddleware, getPaymentHistory);
router.get('/:loanId/upcoming', authMiddleware, getUpcomingEMIs);
router.get('/:loanId/stats', authMiddleware, getPaymentStats);

module.exports = router;
