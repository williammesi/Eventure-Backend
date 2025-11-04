import { DataTypes } from 'sequelize';
import sequelize from '../core/database.js';

const Token = sequelize.define('Token', {
    Token: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true,
        primaryKey: true // Le token devient la clé primaire
    }
}, {
    tableName: 'Tokens',
    timestamps: false // Pas de createdAt/updatedAt
});

export default Token;