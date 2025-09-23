import { DataTypes } from 'sequelize';
import sequelize from '../core/database.js';

const Location = sequelize.define('Location', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Adress: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  City: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  Province: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  Country: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'Location',
  timestamps: false
});

export default Location;