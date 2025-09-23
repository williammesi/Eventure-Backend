import { DataTypes } from 'sequelize';
import sequelize from '../core/database.js';

const SurveyChoice = sequelize.define('SurveyChoice', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  SurveyID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Survey',
      key: 'ID'
    }
  },
  Content: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'SurveyChoice',
  timestamps: false
});

export default SurveyChoice;