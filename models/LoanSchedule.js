const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LoanSchedule = sequelize.define('LoanSchedule', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  loanId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  emiNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  principalAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  interestAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  emiAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  balanceAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  paidDate: DataTypes.DATE,
  daysOverdue: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'loan_schedules',
});

module.exports = LoanSchedule;
