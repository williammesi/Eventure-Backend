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
    allowNull: true,
    defaultValue: "https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.SAcV4rjQCseubnk32USHigHaHx%3Fcb%3D12%26pid%3DApi&sp=1759868184T9d883262b35acaf0e56ed52fb69e6299f00d8eb03c7d7f1dcc4258b15580deb3"
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