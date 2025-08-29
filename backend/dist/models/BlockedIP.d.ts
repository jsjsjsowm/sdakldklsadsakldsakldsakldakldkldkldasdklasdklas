import { Model, Optional } from 'sequelize';
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
export interface BlockedIPCreationAttributes extends Optional<BlockedIPAttributes, 'id' | 'createdAt' | 'updatedAt' | 'blockedAt' | 'isActive'> {
}
export declare class BlockedIP extends Model<BlockedIPAttributes, BlockedIPCreationAttributes> implements BlockedIPAttributes {
    id: number;
    ipAddress: string;
    blockedAt: Date;
    blockedBy?: string;
    reason?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    toJSON(): object;
}
//# sourceMappingURL=BlockedIP.d.ts.map