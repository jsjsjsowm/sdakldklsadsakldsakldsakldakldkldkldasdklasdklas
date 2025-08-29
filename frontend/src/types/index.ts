export interface Application {
  id: number;
  createdAt: string;
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
  categories: {
    A: boolean;
    B: boolean;
    C: boolean;
    D: boolean;
  };
  hasMedical: 'yes' | 'no' | 'order';
  hasSchool: 'yes' | 'no';
  totalAmount: number;
  paymentStatus: 'pending' | 'processing' | 'completed';
  paymentConfirmed: boolean;
  paymentType: 'full' | 'partial';
  paidAmount?: number;
  remainingAmount?: number;
}

export interface Config {
  prices: {
    categories: {
      A: number;
      B: number;
      C: number;
      D: number;
    };
    medical: {
      order: number;
    };
    school: {
      no: number;
    };
  };
  walletAddress: string;
  cryptoWallets: {
    btc: string;
    ton: string;
    usdt: string;
  };
}

export interface ExchangeRate {
  success: boolean;
  rate: number;
  source: string;
  timestamp: number;
}

export interface CryptoRates {
  success: boolean;
  rates: {
    btc: number;
    ton: number;
    usdt: number;
  };
}

export interface UserData {
  hasApplication: boolean;
  data: Application | null;
  message?: string;
}

export interface FormData {
  fullName: string;
  passportNumber: string;
  phone: string;
  categories: string[];
  medical: 'yes' | 'no' | 'order' | '';
  school: 'yes' | 'no' | '';
  deliveryMethod: 'courier' | 'post' | '';
  deliveryAddress: string;
  city: string;
  signature: File | null;
  personalPhoto: File | null;
  medCertificate: File | null;
}

export interface PaymentData {
  type: 'full' | 'partial';
  method: 'crypto' | 'card';
  amount: number;
  amountUsd: number;
}

export interface AdminStats {
  total: number;
  paid: number;
  pending: number;
  revenue: number;
  online_users: number;
}

export interface BlockedIP {
  id: number;
  ipAddress: string;
  blockedAt: string;
  blockedBy?: string;
  reason?: string;
  isActive: boolean;
}

export interface ApplicationFile {
  filename: string;
  size: number;
  created: string;
  modified: string;
}
