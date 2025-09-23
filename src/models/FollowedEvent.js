import { DataTypes } from 'sequelize';
import sequelize from '../core/database.js';

const FollowedEvent = sequelize.define('FollowedEvent', {
  EventID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Events',
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
  tableName: 'FollowedEvents',
  timestamps: false
});

export default FollowedEvent;