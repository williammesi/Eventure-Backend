import { DataTypes } from 'sequelize';
import sequelize from '../core/database.js';

const CertificationRequest = sequelize.define('CertificationRequest', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  TargetType: {
    type: DataTypes.ENUM('event', 'user'),
    allowNull: false
  },
  TargetID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Declined'),
    allowNull: false,
    defaultValue: 'Pending'
  }
}, {
  tableName: 'CertificationRequest',
  timestamps: false
});

export default CertificationRequest;
