import { DataTypes } from 'sequelize';
import sequelize from '../core/database.js';

const Category = sequelize.define('Category', {
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
  tableName: 'Category',
  timestamps: false
});

export default Category;