import { DataTypes } from 'sequelize';
import sequelize from '../core/database.js';

const Image = sequelize.define('Image', {
  EventID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Events',
      key: 'ID'
    }
  },
  Href: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  isThumbnail: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  tableName: 'Image',
  timestamps: false
});

export default Image;