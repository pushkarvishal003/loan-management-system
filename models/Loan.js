const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Decimal = require('decimal.js');

const Loan = sequelize.define('Loan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  borrowerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  loanAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  principalAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  interestRate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 8.5,
  },
  loanTenureMonths: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  monthlyEMI: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  totalInterest: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  disbursedAmount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  paidAmount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  remainingBalance: {
    type: DataTypes.DECIMAL(12, 2),
  },
  status: {
    type: DataTypes.ENUM('applied', 'approved', 'rejected', 'disbursed', 'active', 'closed', 'defaulted'),
    defaultValue: 'applied',
  },
  loanPurpose: DataTypes.STRING,
  applicationDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  approvalDate: DataTypes.DATE,
  disbursementDate: DataTypes.DATE,
  dueDate: DataTypes.DATE,
  closureDate: DataTypes.DATE,
  approvedBy: DataTypes.UUID,
  documents: DataTypes.JSONB,
  remarks: DataTypes.TEXT,
}, {
  tableName: 'loans',
  hooks: {
    beforeCreate: (loan) => {
      loan.remainingBalance = loan.principalAmount;
    },
  },
});

module.exports = Loan;
