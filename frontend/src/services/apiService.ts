import axios from 'axios';
import { 
  Application, 
  Config, 
  ExchangeRate, 
  CryptoRates, 
  UserData, 
  AdminStats, 
  BlockedIP, 
  ApplicationFile 
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use((config) => {
  console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data);
    
    if (error.response?.status === 403) {
      throw new Error('Доступ заблокирован');
    } else if (error.response?.status === 429) {
      throw new Error('Слишком много запросов, попробуйте позже');
    } else if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Сервер недоступен');
    } else {
      throw new Error('Произошла ошибка при обращении к серверу');
    }
  }
);

class ApiService {
  // User and application endpoints
  async getUserData(): Promise<UserData> {
    const response = await api.get('/applications/user-data');
    return response.data;
  }

  async updateUserActivity(): Promise<void> {
    await api.post('/applications/user-activity');
  }

  async createApplication(formData: FormData): Promise<{ success: boolean; applicationId?: number; message?: string; data?: Application }> {
    const response = await api.post('/applications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async confirmPayment(applicationId: number, paymentType: 'full' | 'partial'): Promise<{ success: boolean; message?: string; data: Application }> {
    const response = await api.post(`/applications/${applicationId}/payment`, {
      payment_type: paymentType,
    });
    return response.data;
  }

  async getApplication(id: number): Promise<Application> {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  }

  async getLatestApplication(): Promise<{ success: boolean; data: Application }> {
    const response = await api.get('/applications/latest');
    return response.data;
  }

  // Configuration endpoints
  async getConfig(): Promise<Config> {
    const response = await api.get('/config');
    return response.data;
  }

  async getExchangeRate(): Promise<ExchangeRate> {
    const response = await api.get('/config/exchange-rate');
    return response.data;
  }

  async getCryptoWallets(): Promise<{ success: boolean; wallets: { btc: string; ton: string; usdt: string } }> {
    const response = await api.get('/config/crypto-wallets');
    return response.data;
  }

  async getCryptoRates(): Promise<CryptoRates> {
    const response = await api.get('/config/crypto-rates');
    return response.data;
  }

  async testBot(): Promise<{ success?: string; error?: string }> {
    const response = await api.post('/config/test-bot');
    return response.data;
  }

  // File endpoints
  async getApplicationFiles(): Promise<{ files: ApplicationFile[]; count: number }> {
    const response = await api.get('/uploads/files');
    return response.data;
  }

  async downloadApplicationFile(filename: string): Promise<void> {
    const response = await api.get(`/uploads/files/${filename}`, {
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  // Admin endpoints
  async getAdminStats(): Promise<{ success: boolean; stats: AdminStats }> {
    const response = await api.get('/admin/stats');
    return response.data;
  }

  async getAdminApplications(): Promise<{ success: boolean; applications: Application[] }> {
    const response = await api.get('/admin/applications');
    return response.data;
  }

  async deleteApplication(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/admin/applications/${id}`);
    return response.data;
  }

  async getBlockedIPs(): Promise<{ success: boolean; blocked_ips: BlockedIP[] }> {
    const response = await api.get('/admin/blocked-ips');
    return response.data;
  }

  async blockIP(ipAddress: string, reason?: string, blockedBy?: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/admin/block-ip', {
      ip_address: ipAddress,
      reason,
      blocked_by: blockedBy,
    });
    return response.data;
  }

  async unblockIP(ipAddress: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/admin/unblock-ip', {
      ip_address: ipAddress,
    });
    return response.data;
  }

  async checkIP(ipAddress: string): Promise<{ success: boolean; ip_address: string; is_blocked: boolean }> {
    const response = await api.post('/admin/check-ip', {
      ip_address: ipAddress,
    });
    return response.data;
  }

  async deleteFile(filename: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/admin/files/${filename}`);
    return response.data;
  }

  async backupDatabase(): Promise<{ success: boolean; message: string; filename?: string }> {
    const response = await api.post('/admin/backup');
    return response.data;
  }

  async clearDatabase(): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/admin/clear-db');
    return response.data;
  }

  async clearFiles(): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/admin/clear-files');
    return response.data;
  }

  async checkDatabaseStatus(): Promise<{ success: boolean; message: string }> {
    const response = await api.get('/admin/db-status');
    return response.data;
  }

  async checkFileSystemStatus(): Promise<{ success: boolean; message: string }> {
    const response = await api.get('/admin/fs-status');
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await api.get('/health');
    return response.data;
  }
}

export const apiService = new ApiService();
