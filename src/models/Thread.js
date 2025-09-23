import { DataTypes } from 'sequelize';
import sequelize from '../core/database.js';

const Thread = sequelize.define('Thread', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  EventID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Events',
      key: 'ID'
    }
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'ID'
    }
  },
  Title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  CreationDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Content: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'Thread',
  timestamps: false
});

export default Thread;