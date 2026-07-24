const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  loanId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  borrowerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  emiNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  principalPaid: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  interestPaid: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  penaltyPaid: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  totalPayment: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  paymentDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.ENUM('bank_transfer', 'cheque', 'online', 'cash'),
    defaultValue: 'online',
  },
  transactionId: {
    type: DataTypes.STRING,
    unique: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'overdue', 'partial'),
    defaultValue: 'pending',
  },
  remarks: DataTypes.TEXT,
}, {
  tableName: 'payments',
});

module.exports = Payment;
