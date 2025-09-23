import { DataTypes } from 'sequelize';
import sequelize from '../core/database.js';

const Client = sequelize.define('Client', {
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Users',
      key: 'ID'
    }
  },
  FirstName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  LastName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  DateOfBirth: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'Client',
  timestamps: false
});

export default Client;