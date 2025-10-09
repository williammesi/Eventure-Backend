import { DataTypes } from 'sequelize';
import sequelize from '../core/database.js';

const Token = sequelize.define('Token', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    token: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'Tokens',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});

export default Token;