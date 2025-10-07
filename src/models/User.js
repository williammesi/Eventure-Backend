import { DataTypes } from 'sequelize';
import sequelize from '../core/database.js';

const User = sequelize.define('User', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  RoleID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Roles',
      key: 'ID'
    }
  },
  Username: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false
  },
  Password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  Email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false
  },
  ProfilePictureHref: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  SecretQuestionID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'SecretQuestions',
      key: 'ID'
    }
  },
  SecretQuestionAnswer: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  BannedUntil: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: "1970-01-01 00:00:00"
  }
}, {
  tableName: 'Users',
  timestamps: false
});

export default User;