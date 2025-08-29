"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockedIP = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class BlockedIP extends sequelize_1.Model {
    toJSON() {
        return {
            id: this.id,
            ipAddress: this.ipAddress,
            blockedAt: this.blockedAt,
            blockedBy: this.blockedBy,
            reason: this.reason,
            isActive: this.isActive,
        };
    }
}
exports.BlockedIP = BlockedIP;
BlockedIP.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    ipAddress: {
        type: sequelize_1.DataTypes.STRING(45),
        allowNull: false,
        unique: true,
        field: 'ip_address',
    },
    blockedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: 'blocked_at',
    },
    blockedBy: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
        field: 'blocked_by',
    },
    reason: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'blocked_ips',
    indexes: [
        {
            fields: ['ip_address'],
            unique: true,
        },
        {
            fields: ['is_active'],
        },
    ],
});
//# sourceMappingURL=BlockedIP.js.map