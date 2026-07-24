const express = require('express');
const { authMiddleware, authorize } = require('../middleware/auth');
const {
  applyForLoan,
  approveLoan,
  disburseLoan,
  getLoanDetails,
  getUserLoans,
  getAllLoans,
} = require('../controllers/loanController');

const router = express.Router();

// Borrower routes
router.post('/apply', authMiddleware, authorize('borrower'), applyForLoan);
router.get('/my-loans', authMiddleware, authorize('borrower'), getUserLoans);

// Admin routes
router.get('/', authMiddleware, authorize('admin'), getAllLoans);
router.post('/:loanId/approve', authMiddleware, authorize('admin'), approveLoan);
router.post('/:loanId/disburse', authMiddleware, authorize('admin'), disburseLoan);

// Common routes
router.get('/:loanId', authMiddleware, getLoanDetails);

module.exports = router;
