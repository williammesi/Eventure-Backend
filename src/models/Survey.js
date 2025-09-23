import { DataTypes } from 'sequelize';
import sequelize from '../core/database.js';

const Survey = sequelize.define('Survey', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  CategoryID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Category',
      key: 'ID'
    }
  }
}, {
  tableName: 'Survey',
  timestamps: false
});

export default Survey;