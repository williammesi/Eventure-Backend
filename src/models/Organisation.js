import { DataTypes } from 'sequelize';
import sequelize from '../core/database.js';

const Organisation = sequelize.define('Organisation', {
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Users',
      key: 'ID'
    }
  },
  Name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  PhoneNumber: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  Certified: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  tableName: 'Organisation',
  timestamps: false
});

export default Organisation;