import { DataTypes } from 'sequelize';
import sequelize from '../core/database.js';

const FollowedOrganisation = sequelize.define('FollowedOrganisation', {
  OrganisationID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'ID'
    }
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'ID'
    }
  }
}, {
  tableName: 'FollowedOrganisation',
  timestamps: false
});

export default FollowedOrganisation;