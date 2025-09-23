import { DataTypes } from 'sequelize';
import sequelize from '../core/database.js';

const Event = sequelize.define('Event', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'ID'
    }
  },
  LocationID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Location',
      key: 'ID'
    }
  },
  CategoryID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Category',
      key: 'ID'
    }
  },
  Title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  MinPrice: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  MaxPrice: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  StartingDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  EndDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Description: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  BookingURL: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  Approved: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  tableName: 'Events',
  timestamps: false
});

export default Event;