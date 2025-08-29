"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Application extends sequelize_1.Model {
    toJSON() {
        return {
            id: this.id,
            createdAt: this.createdAt,
            ipAddress: this.ipAddress,
            city: this.city,
            fullName: this.fullName,
            passportNumber: this.passportNumber,
            phone: this.phone,
            deliveryMethod: this.deliveryMethod,
            deliveryAddress: this.deliveryAddress,
            signaturePath: this.signaturePath,
            personalPhotoPath: this.personalPhotoPath,
            medCertificatePath: this.medCertificatePath,
            categories: {
                A: this.categoryA,
                B: this.categoryB,
                C: this.categoryC,
                D: this.categoryD,
            },
            hasMedical: this.hasMedical,
            hasSchool: this.hasSchool,
            totalAmount: this.totalAmount,
            paymentStatus: this.paymentStatus,
            paymentConfirmed: this.paymentConfirmed,
            paymentType: this.paymentType,
            paidAmount: this.paidAmount,
            remainingAmount: this.remainingAmount,
        };
    }
}
exports.Application = Application;
Application.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
    ipAddress: {
        type: sequelize_1.DataTypes.STRING(45),
        allowNull: false,
        field: 'ip_address',
    },
    city: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    fullName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        field: 'full_name',
    },
    passportNumber: {
        type: sequelize_1.DataTypes.STRING(11),
        allowNull: false,
        field: 'passport_number',
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(18),
        allowNull: false,
    },
    deliveryMethod: {
        type: sequelize_1.DataTypes.ENUM('courier', 'post'),
        allowNull: true,
        field: 'delivery_method',
    },
    deliveryAddress: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        field: 'delivery_address',
    },
    signaturePath: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        field: 'signature_path',
    },
    personalPhotoPath: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        field: 'personal_photo_path',
    },
    medCertificatePath: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        field: 'med_certificate_path',
    },
    categoryA: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'category_a',
    },
    categoryB: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'category_b',
    },
    categoryC: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'category_c',
    },
    categoryD: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'category_d',
    },
    hasMedical: {
        type: sequelize_1.DataTypes.ENUM('yes', 'no', 'order'),
        allowNull: false,
        field: 'has_medical',
    },
    hasSchool: {
        type: sequelize_1.DataTypes.ENUM('yes', 'no'),
        allowNull: false,
        field: 'has_school',
    },
    totalAmount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'total_amount',
    },
    paymentStatus: {
        type: sequelize_1.DataTypes.ENUM('pending', 'processing', 'completed'),
        allowNull: false,
        defaultValue: 'pending',
        field: 'payment_status',
    },
    paymentConfirmed: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'payment_confirmed',
    },
    paymentType: {
        type: sequelize_1.DataTypes.ENUM('full', 'partial'),
        allowNull: false,
        defaultValue: 'full',
        field: 'payment_type',
    },
    paidAmount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        field: 'paid_amount',
    },
    remainingAmount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        field: 'remaining_amount',
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'applications',
    indexes: [
        {
            fields: ['ip_address'],
        },
        {
            fields: ['created_at'],
        },
        {
            fields: ['payment_confirmed'],
        },
    ],
});
//# sourceMappingURL=Application.js.map