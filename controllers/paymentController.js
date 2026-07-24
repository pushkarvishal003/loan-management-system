const { Payment, Loan, LoanSchedule } = require('../models');
const Decimal = require('decimal.js');
const moment = require('moment');

const makePayment = async (req, res, next) => {
  try {
    const { loanId, emiNumber, amount, transactionId, paymentMethod } = req.body;

    const loan = await Loan.findByPk(loanId);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    const schedule = await LoanSchedule.findOne({
      where: { loanId, emiNumber },
    });

    if (!schedule) {
      return res.status(404).json({ error: 'EMI schedule not found' });
    }

    const daysLate = moment().diff(moment(schedule.dueDate), 'days');
    let penaltyAmount = 0;

    if (daysLate > 0) {
      const penaltyRate = parseFloat(process.env.PENALTY_RATE) || 2.5;
      penaltyAmount = (schedule.emiAmount * penaltyRate) / 100;
    }

    const totalDue = schedule.emiAmount + penaltyAmount;

    if (parseFloat(amount) < totalDue) {
      return res.status(400).json({
        error: 'Insufficient payment amount',
        requiredAmount: totalDue,
        penaltyAmount,
      });
    }

    // Calculate principal and interest breakdown
    const principalPaid = schedule.principalAmount;
    const interestPaid = schedule.interestAmount;
    const totalPayment = principalPaid + interestPaid + penaltyAmount;

    const payment = await Payment.create({
      loanId,
      borrowerId: loan.borrowerId,
      emiNumber,
      principalPaid,
      interestPaid,
      penaltyPaid: penaltyAmount,
      totalPayment,
      paymentDate: new Date(),
      dueDate: schedule.dueDate,
      paymentMethod: paymentMethod || 'online',
      transactionId,
      status: 'paid',
    });

    // Update loan schedule
    await schedule.update({
      isPaid: true,
      paidDate: new Date(),
    });

    // Update loan balance
    const newBalance = new Decimal(loan.remainingBalance).minus(principalPaid);
    const paidAmount = new Decimal(loan.paidAmount).plus(totalPayment);

    await loan.update({
      remainingBalance: newBalance.toNumber(),
      paidAmount: paidAmount.toNumber(),
    });

    // Check if all EMIs are paid
    const unpaidSchedules = await LoanSchedule.count({
      where: { loanId, isPaid: false },
    });

    if (unpaidSchedules === 0) {
      await loan.update({
        status: 'closed',
        closureDate: new Date(),
      });
    }

    res.status(201).json({
      message: 'Payment recorded successfully',
      payment,
      loanStatus: unpaidSchedules === 0 ? 'closed' : 'active',
    });
  } catch (error) {
    next(error);
  }
};

const getPaymentHistory = async (req, res, next) => {
  try {
    const { loanId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Payment.findAndCountAll({
      where: { loanId },
      offset,
      limit: parseInt(limit),
      order: [['paymentDate', 'DESC']],
    });

    res.json({
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
      payments: rows,
    });
  } catch (error) {
    next(error);
  }
};

const getUpcomingEMIs = async (req, res, next) => {
  try {
    const { loanId } = req.params;

    const schedules = await LoanSchedule.findAll({
      where: { loanId, isPaid: false },
      order: [['emiNumber', 'ASC']],
    });

    const upcomingEMIs = schedules.map(schedule => ({
      ...schedule.dataValues,
      daysUntilDue: moment(schedule.dueDate).diff(moment(), 'days'),
      isOverdue: moment().isAfter(moment(schedule.dueDate)),
    }));

    res.json({ upcomingEMIs });
  } catch (error) {
    next(error);
  }
};

const getPaymentStats = async (req, res, next) => {
  try {
    const { loanId } = req.params;

    const loan = await Loan.findByPk(loanId, {
      include: [{ association: 'payments' }],
    });

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    const totalPayments = loan.payments.length;
    const paidEMIs = await LoanSchedule.count({
      where: { loanId, isPaid: true },
    });
    const totalEMIs = loan.loanTenureMonths;

    res.json({
      totalEMIs,
      paidEMIs,
      pendingEMIs: totalEMIs - paidEMIs,
      totalLoanAmount: loan.loanAmount,
      paidAmount: loan.paidAmount,
      remainingBalance: loan.remainingBalance,
      completionPercentage: ((paidEMIs / totalEMIs) * 100).toFixed(2),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  makePayment,
  getPaymentHistory,
  getUpcomingEMIs,
  getPaymentStats,
};
