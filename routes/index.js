const express = require('express');
const authRoutes = require('./authRoutes');
const loanRoutes = require('./loanRoutes');
const paymentRoutes = require('./paymentRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/loans', loanRoutes);
router.use('/payments', paymentRoutes);

module.exports = router;
