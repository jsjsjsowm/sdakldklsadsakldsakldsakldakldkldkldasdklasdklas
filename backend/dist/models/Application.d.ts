import { Model, Optional } from 'sequelize';
export interface ApplicationAttributes {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    ipAddress: string;
    city?: string;
    fullName: string;
    passportNumber: string;
    phone: string;
    deliveryMethod?: 'courier' | 'post';
    deliveryAddress?: string;
    signaturePath: string;
    personalPhotoPath: string;
    medCertificatePath?: string;
    categoryA: boolean;
    categoryB: boolean;
    categoryC: boolean;
    categoryD: boolean;
    hasMedical: 'yes' | 'no' | 'order';
    hasSchool: 'yes' | 'no';
    totalAmount: number;
    paymentStatus: 'pending' | 'processing' | 'completed';
    paymentConfirmed: boolean;
    paymentType: 'full' | 'partial';
    paidAmount?: number;
    remainingAmount?: number;
}
export interface ApplicationCreationAttributes extends Optional<ApplicationAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
export declare class Application extends Model<ApplicationAttributes, ApplicationCreationAttributes> implements ApplicationAttributes {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    ipAddress: string;
    city?: string;
    fullName: string;
    passportNumber: string;
    phone: string;
    deliveryMethod?: 'courier' | 'post';
    deliveryAddress?: string;
    signaturePath: string;
    personalPhotoPath: string;
    medCertificatePath?: string;
    categoryA: boolean;
    categoryB: boolean;
    categoryC: boolean;
    categoryD: boolean;
    hasMedical: 'yes' | 'no' | 'order';
    hasSchool: 'yes' | 'no';
    totalAmount: number;
    paymentStatus: 'pending' | 'processing' | 'completed';
    paymentConfirmed: boolean;
    paymentType: 'full' | 'partial';
    paidAmount?: number;
    remainingAmount?: number;
    toJSON(): object;
}
//# sourceMappingURL=Application.d.ts.map