const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  role: {
    type: DataTypes.ENUM('admin', 'lender', 'borrower'),
    defaultValue: 'borrower',
  },
  address: DataTypes.TEXT,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  zipCode: DataTypes.STRING,
  panNumber: {
    type: DataTypes.STRING,
    unique: true,
  },
  aadharNumber: {
    type: DataTypes.STRING,
    unique: true,
  },
  creditScore: {
    type: DataTypes.INTEGER,
    defaultValue: 600,
  },
  kycVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  accountStatus: {
    type: DataTypes.ENUM('active', 'suspended', 'closed'),
    defaultValue: 'active',
  },
  lastLogin: DataTypes.DATE,
}, {
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    },
  },
});

User.prototype.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
