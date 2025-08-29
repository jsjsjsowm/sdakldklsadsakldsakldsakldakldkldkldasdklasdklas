import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ApplicationAttributes {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  ipAddress: string;
  city?: string;
  
  // Personal information
  fullName: string;
  passportNumber: string;
  phone: string;
  
  // Delivery information
  deliveryMethod?: 'courier' | 'post';
  deliveryAddress?: string;
  
  // File paths
  signaturePath: string;
  personalPhotoPath: string;
  medCertificatePath?: string;
  
  // Categories
  categoryA: boolean;
  categoryB: boolean;
  categoryC: boolean;
  categoryD: boolean;
  
  // Documents
  hasMedical: 'yes' | 'no' | 'order';
  hasSchool: 'yes' | 'no';
  
  // Payment
  totalAmount: number;
  paymentStatus: 'pending' | 'processing' | 'completed';
  paymentConfirmed: boolean;
  paymentType: 'full' | 'partial';
  paidAmount?: number;
  remainingAmount?: number;
}

export interface ApplicationCreationAttributes 
  extends Optional<ApplicationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Application extends Model<ApplicationAttributes, ApplicationCreationAttributes>
  implements ApplicationAttributes {
  public id!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public ipAddress!: string;
  public city?: string;
  
  public fullName!: string;
  public passportNumber!: string;
  public phone!: string;
  
  public deliveryMethod?: 'courier' | 'post';
  public deliveryAddress?: string;
  
  public signaturePath!: string;
  public personalPhotoPath!: string;
  public medCertificatePath?: string;
  
  public categoryA!: boolean;
  public categoryB!: boolean;
  public categoryC!: boolean;
  public categoryD!: boolean;
  
  public hasMedical!: 'yes' | 'no' | 'order';
  public hasSchool!: 'yes' | 'no';
  
  public totalAmount!: number;
  public paymentStatus!: 'pending' | 'processing' | 'completed';
  public paymentConfirmed!: boolean;
  public paymentType!: 'full' | 'partial';
  public paidAmount?: number;
  public remainingAmount?: number;

  public toJSON(): object {
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

Application.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: 'ip_address',
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    fullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'full_name',
    },
    passportNumber: {
      type: DataTypes.STRING(11),
      allowNull: false,
      field: 'passport_number',
    },
    phone: {
      type: DataTypes.STRING(18),
      allowNull: false,
    },
    deliveryMethod: {
      type: DataTypes.ENUM('courier', 'post'),
      allowNull: true,
      field: 'delivery_method',
    },
    deliveryAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'delivery_address',
    },
    signaturePath: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'signature_path',
    },
    personalPhotoPath: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'personal_photo_path',
    },
    medCertificatePath: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'med_certificate_path',
    },
    categoryA: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'category_a',
    },
    categoryB: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'category_b',
    },
    categoryC: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'category_c',
    },
    categoryD: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'category_d',
    },
    hasMedical: {
      type: DataTypes.ENUM('yes', 'no', 'order'),
      allowNull: false,
      field: 'has_medical',
    },
    hasSchool: {
      type: DataTypes.ENUM('yes', 'no'),
      allowNull: false,
      field: 'has_school',
    },
    totalAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'total_amount',
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'processing', 'completed'),
      allowNull: false,
      defaultValue: 'pending',
      field: 'payment_status',
    },
    paymentConfirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'payment_confirmed',
    },
    paymentType: {
      type: DataTypes.ENUM('full', 'partial'),
      allowNull: false,
      defaultValue: 'full',
      field: 'payment_type',
    },
    paidAmount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'paid_amount',
    },
    remainingAmount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'remaining_amount',
    },
  },
  {
    sequelize,
    tableName: 'applications',
    indexes: [
      {
        fields: ['ip_address'],
      },
      {
        fields: ['createdAt'],
      },
      {
        fields: ['payment_confirmed'],
      },
    ],
  }
);
