import { DataTypes } from 'sequelize';
import sequelize from '../core/database.js';

const Role = sequelize.define('Role', {
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
  tableName: 'Roles',
  timestamps: false
});

export default Role;