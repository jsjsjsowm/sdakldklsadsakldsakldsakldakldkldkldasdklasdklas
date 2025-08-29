import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface BlockedIPAttributes {
  id: number;
  ipAddress: string;
  blockedAt: Date;
  blockedBy?: string;
  reason?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlockedIPCreationAttributes 
  extends Optional<BlockedIPAttributes, 'id' | 'createdAt' | 'updatedAt' | 'blockedAt' | 'isActive'> {}

export class BlockedIP extends Model<BlockedIPAttributes, BlockedIPCreationAttributes>
  implements BlockedIPAttributes {
  public id!: number;
  public ipAddress!: string;
  public blockedAt!: Date;
  public blockedBy?: string;
  public reason?: string;
  public isActive!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;

  public toJSON(): object {
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

BlockedIP.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
      field: 'ip_address',
    },
    blockedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'blocked_at',
    },
    blockedBy: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'blocked_by',
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
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
  }
);
