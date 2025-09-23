import { DataTypes } from 'sequelize';
import sequelize from '../core/database.js';

const ThreadAnswer = sequelize.define('ThreadAnswer', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ThreadID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Thread',
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
  Content: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  CreationDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'ThreadAnswer',
  timestamps: false
});

export default ThreadAnswer;