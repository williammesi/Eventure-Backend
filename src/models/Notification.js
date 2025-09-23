import { DataTypes } from 'sequelize';
import sequelize from '../core/database.js';

const Notification = sequelize.define('Notification', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  TypeID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'NotificationTypes',
      key: 'ID'
    }
  },
  Content: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  Date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'ID'
    }
  },
  SenderID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'ID'
    }
  }
}, {
  tableName: 'Notification',
  timestamps: false
});

export default Notification;