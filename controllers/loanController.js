const { Loan, Payment, LoanSchedule, User } = require('../models');
const Decimal = require('decimal.js');
const moment = require('moment');

// Calculate EMI using formula: EMI = [P * R * (1+R)^N] / [(1+R)^N - 1]
const calculateEMI = (principal, annualRate, months) => {
  const P = new Decimal(principal);
  const monthlyRate = new Decimal(annualRate).div(100).div(12);
  const N = new Decimal(months);

  if (monthlyRate.eq(0)) {
    return P.div(N).toNumber();
  }

  const numerator = P.times(monthlyRate).times(
    Decimal.pow(monthlyRate.plus(1), N)
  );
  const denominator = Decimal.pow(monthlyRate.plus(1), N).minus(1);
  return numerator.div(denominator).toNumber();
};

// Generate complete loan schedule
const generateLoanSchedule = async (loanId, loan) => {
  const schedules = [];
  let remainingBalance = new Decimal(loan.principalAmount);
  const monthlyRate = new Decimal(loan.interestRate).div(100).div(12);
  const emi = new Decimal(loan.monthlyEMI);

  let currentDate = moment(loan.applicationDate).add(1, 'month');

  for (let i = 1; i <= loan.loanTenureMonths; i++) {
    const interestAmount = remainingBalance.times(monthlyRate);
    const principalAmount = emi.minus(interestAmount);
    const newBalance = remainingBalance.minus(principalAmount);

    schedules.push({
      loanId,
      emiNumber: i,
      dueDate: currentDate.toDate(),
      principalAmount: principalAmount.toNumber(),
      interestAmount: interestAmount.toNumber(),
      emiAmount: emi.toNumber(),
      balanceAmount: newBalance.isNegative() ? 0 : newBalance.toNumber(),
      isPaid: false,
      daysOverdue: 0,
    });

    remainingBalance = newBalance.isNegative() ? new Decimal(0) : newBalance;
    currentDate = currentDate.add(1, 'month');
  }

  await LoanSchedule.bulkCreate(schedules);
};

const applyForLoan = async (req, res, next) => {
  try {
    const { loanAmount, loanTenureMonths, loanPurpose, interestRate, documents } = req.body;

    if (!loanAmount || !loanTenureMonths) {
      return res.status(400).json({ error: 'Loan amount and tenure are required' });
    }

    const monthlyEMI = calculateEMI(loanAmount, interestRate || 8.5, loanTenureMonths);
    const monthlyRate = (interestRate || 8.5) / 100 / 12;
    const totalInterest = monthlyEMI * loanTenureMonths - loanAmount;
    const totalAmount = loanAmount + totalInterest;

    const loan = await Loan.create({
      borrowerId: req.user.id,
      loanAmount,
      principalAmount: loanAmount,
      interestRate: interestRate || 8.5,
      loanTenureMonths,
      monthlyEMI,
      totalInterest,
      totalAmount,
      remainingBalance: loanAmount,
      loanPurpose: loanPurpose || 'General',
      status: 'applied',
      documents: documents || {},
    });

    res.status(201).json({
      message: 'Loan application submitted successfully',
      loan: {
        id: loan.id,
        loanAmount,
        monthlyEMI: monthlyEMI.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        status: loan.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

const approveLoan = async (req, res, next) => {
  try {
    const { loanId } = req.params;
    const { remarks } = req.body;

    const loan = await Loan.findByPk(loanId);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    await loan.update({
      status: 'approved',
      approvalDate: new Date(),
      approvedBy: req.user.id,
      remarks: remarks || '',
    });

    res.json({
      message: 'Loan approved successfully',
      loan,
    });
  } catch (error) {
    next(error);
  }
};

const disburseLoan = async (req, res, next) => {
  try {
    const { loanId } = req.params;

    const loan = await Loan.findByPk(loanId);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    if (loan.status !== 'approved') {
      return res.status(400).json({ error: 'Loan must be approved before disbursement' });
    }

    await loan.update({
      status: 'disbursed',
      disbursedAmount: loan.principalAmount,
      disbursementDate: new Date(),
    });

    // Generate loan schedule
    await generateLoanSchedule(loan.id, loan);

    res.json({
      message: 'Loan disbursed successfully',
      loan,
    });
  } catch (error) {
    next(error);
  }
};

const getLoanDetails = async (req, res, next) => {
  try {
    const { loanId } = req.params;

    const loan = await Loan.findByPk(loanId, {
      include: [
        { association: 'borrower', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] },
        { association: 'payments', attributes: ['id', 'emiNumber', 'totalPayment', 'paymentDate', 'status'] },
        { association: 'schedule', attributes: ['emiNumber', 'dueDate', 'principalAmount', 'interestAmount', 'isPaid'] },
      ],
    });

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.json({ loan });
  } catch (error) {
    next(error);
  }
};

const getUserLoans = async (req, res, next) => {
  try {
    const loans = await Loan.findAll({
      where: { borrowerId: req.user.id },
      include: [
        { association: 'payments', attributes: ['id', 'totalPayment', 'paymentDate'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ loans });
  } catch (error) {
    next(error);
  }
};

const getAllLoans = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = status ? { status } : {};

    const { count, rows } = await Loan.findAndCountAll({
      where,
      include: [{ association: 'borrower', attributes: ['firstName', 'lastName', 'email'] }],
      offset,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
    });

    res.json({
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
      loans: rows,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForLoan,
  approveLoan,
  disburseLoan,
  getLoanDetails,
  getUserLoans,
  getAllLoans,
};
