"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSession = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class UserSession extends sequelize_1.Model {
    toJSON() {
        return {
            id: this.id,
            ipAddress: this.ipAddress,
            userAgent: this.userAgent,
            sessionId: this.sessionId,
            createdAt: this.createdAt,
            lastActivity: this.lastActivity,
            isActive: this.isActive,
        };
    }
}
exports.UserSession = UserSession;
UserSession.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    ipAddress: {
        type: sequelize_1.DataTypes.STRING(45),
        allowNull: false,
        field: 'ip_address',
    },
    userAgent: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
        field: 'user_agent',
    },
    sessionId: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        field: 'session_id',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    lastActivity: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: 'last_activity',
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'user_sessions',
    indexes: [
        {
            fields: ['ip_address'],
        },
        {
            fields: ['session_id'],
            unique: true,
        },
        {
            fields: ['last_activity'],
        },
        {
            fields: ['is_active'],
        },
    ],
});
//# sourceMappingURL=UserSession.js.map