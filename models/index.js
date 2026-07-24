const sequelize = require('../config/database');
const User = require('./User');
const Loan = require('./Loan');
const Payment = require('./Payment');
const LoanSchedule = require('./LoanSchedule');

// Relationships
User.hasMany(Loan, { foreignKey: 'borrowerId', as: 'loans' });
Loan.belongsTo(User, { foreignKey: 'borrowerId', as: 'borrower' });

Loan.hasMany(Payment, { foreignKey: 'loanId', as: 'payments' });
Payment.belongsTo(Loan, { foreignKey: 'loanId', as: 'loan' });

Loan.hasMany(LoanSchedule, { foreignKey: 'loanId', as: 'schedule' });
LoanSchedule.belongsTo(Loan, { foreignKey: 'loanId', as: 'loan' });

Payment.belongsTo(User, { foreignKey: 'borrowerId', as: 'borrower' });
User.hasMany(Payment, { foreignKey: 'borrowerId', as: 'payments' });

module.exports = { sequelize, User, Loan, Payment, LoanSchedule };
