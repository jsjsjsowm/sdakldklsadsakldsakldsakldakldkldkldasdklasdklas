import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  secretKey: string;
  jwtSecret: string;
  frontendUrl: string;
  database: {
    url: string;
    dialect: 'sqlite' | 'postgres';
  };
  telegram: {
    botToken?: string;
    adminChatId?: string;
  };
  cryptoWallets: {
    btc: string;
    ton: string;
    usdt: string;
  };
  upload: {
    maxFileSize: number;
    uploadDir: string;
  };
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
}

export const config: Config = {
  port: parseInt(process.env.PORT || '5000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  secretKey: process.env.SECRET_KEY || 'your-secret-key-here',
  jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret-here',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  database: {
    url: process.env.DATABASE_URL || 'sqlite:./database.db',
    dialect: process.env.DATABASE_URL?.includes('postgres') ? 'postgres' : 'sqlite',
  },
  
  telegram: {
    botToken: process.env.BOT_TOKEN,
    adminChatId: process.env.ADMIN_CHAT_ID,
  },
  
  cryptoWallets: {
    btc: process.env.BTC_WALLET || 'bc1qr97ln0ayjp4gv0thj6ml3d3ygwx62lq3eryfcw',
    ton: process.env.TON_WALLET || 'UQDO-WTSRTo9vZJc1pjEpbaM5o-Q3PF9WyA-5MaZzsW3nNnF',
    usdt: process.env.USDT_WALLET || 'TWGYmrA4Q4M4qjHyNZBcgTpEh8ggKfniXx',
  },
  
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
  },
  
  prices: {
    categories: {
      A: 25000,
      B: 30000,
      C: 35000,
      D: 40000,
    },
    medical: {
      order: 5000,
    },
    school: {
      no: 15000,
    },
  },
};

// Validate required configuration
if (!config.secretKey || config.secretKey === 'your-secret-key-here') {
  console.warn('⚠️  Warning: Using default secret key. Please set SECRET_KEY in environment variables.');
}

if (!config.jwtSecret || config.jwtSecret === 'your-jwt-secret-here') {
  console.warn('⚠️  Warning: Using default JWT secret. Please set JWT_SECRET in environment variables.');
}
