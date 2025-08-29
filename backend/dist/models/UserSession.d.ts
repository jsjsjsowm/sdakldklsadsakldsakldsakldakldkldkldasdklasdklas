import { Model, Optional } from 'sequelize';
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
export interface UserSessionCreationAttributes extends Optional<UserSessionAttributes, 'id' | 'createdAt' | 'updatedAt' | 'lastActivity' | 'isActive'> {
}
export declare class UserSession extends Model<UserSessionAttributes, UserSessionCreationAttributes> implements UserSessionAttributes {
    id: number;
    ipAddress: string;
    userAgent?: string;
    sessionId: string;
    createdAt: Date;
    lastActivity: Date;
    isActive: boolean;
    updatedAt: Date;
    toJSON(): object;
}
//# sourceMappingURL=UserSession.d.ts.map