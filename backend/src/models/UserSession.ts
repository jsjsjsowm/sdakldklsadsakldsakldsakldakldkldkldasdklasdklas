import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface UserSessionAttributes {
  id: number;
  ipAddress: string;
  userAgent?: string;
  sessionId: string;
  createdAt: Date;
  lastActivity: Date;
  isActive: boolean;
  updatedAt: Date;
}

export interface UserSessionCreationAttributes 
  extends Optional<UserSessionAttributes, 'id' | 'createdAt' | 'updatedAt' | 'lastActivity' | 'isActive'> {}

export class UserSession extends Model<UserSessionAttributes, UserSessionCreationAttributes>
  implements UserSessionAttributes {
  public id!: number;
  public ipAddress!: string;
  public userAgent?: string;
  public sessionId!: string;
  public createdAt!: Date;
  public lastActivity!: Date;
  public isActive!: boolean;
  public updatedAt!: Date;

  public toJSON(): object {
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

UserSession.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: 'ip_address',
    },
    userAgent: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'user_agent',
    },
    sessionId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'session_id',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    lastActivity: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'last_activity',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
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
  }
);
