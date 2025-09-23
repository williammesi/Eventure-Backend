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
    allowNull: false
  },
  Password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  Email: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  ProfilePictureHref: {
    type: DataTypes.STRING(255),
    allowNull: false
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
    allowNull: false
  }
}, {
  tableName: 'Users',
  timestamps: false
});

export default User;