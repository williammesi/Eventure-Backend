import { DataTypes } from 'sequelize';
import sequelize from '../core/database.js';

const SurveyAnswer = sequelize.define('SurveyAnswer', {
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'ID'
    }
  },
  SurveyID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Survey',
      key: 'ID'
    }
  },
  SurveyChoiceID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'SurveyChoice',
      key: 'ID'
    }
  }
}, {
  tableName: 'SurveyAnswer',
  timestamps: false
});

export default SurveyAnswer;