import { DataTypes } from 'sequelize';
import sequelize from '../core/database.js';

const NotificationType = sequelize.define('NotificationType', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Name: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'NotificationTypes',
  timestamps: false
});

export default NotificationType;