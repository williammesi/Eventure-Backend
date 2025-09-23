import { DataTypes } from 'sequelize';
import sequelize from '../core/database.js';

const SecretQuestion = sequelize.define('SecretQuestion', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Question: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'SecretQuestion',
  timestamps: false
});

export default SecretQuestion;