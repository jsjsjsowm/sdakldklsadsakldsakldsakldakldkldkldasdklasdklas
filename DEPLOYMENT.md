# 🚀 Deployment Guide - Driver License App React Version

## Quick Start

### Automated Installation
```bash
cd react-project
node install.js
```

### Manual Installation
```bash
# Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install

# Setup environment
cd backend
cp env.example .env

# Build backend
npm run build

# Start development
cd ..
npm run dev
```

## 🔧 Configuration

### Environment Variables (backend/.env)
```env
# Database
DATABASE_URL=sqlite:./database.db

# Security
SECRET_KEY=your-secure-secret-key-here
JWT_SECRET=your-jwt-secret-here

# Crypto Wallets
BTC_WALLET=your-btc-wallet-address
TON_WALLET=your-ton-wallet-address
USDT_WALLET=your-usdt-trc20-wallet-address

# Telegram Bot (optional)
BOT_TOKEN=your-telegram-bot-token
ADMIN_CHAT_ID=your-telegram-chat-id

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 🌐 Production Deployment

### Option 1: Docker Deployment
```bash
# Create Dockerfile for backend
# Create Dockerfile for frontend
# Use docker-compose for full stack deployment
```

### Option 2: Manual Production Deployment

#### Backend (Node.js/Express)
```bash
cd backend

# Install dependencies
npm ci --production

# Build TypeScript
npm run build

# Start with PM2
npm install -g pm2
pm2 start dist/server.js --name "driver-license-api"
```

#### Frontend (React)
```bash
cd frontend

# Build for production
npm run build

# Serve with nginx
sudo cp -r build/* /var/www/html/
```

### Option 3: VPS/Cloud Deployment

#### DigitalOcean/AWS/GCP
1. Create server instance (Ubuntu 20.04+)
2. Install Node.js 16+
3. Clone repository
4. Run installation script
5. Configure reverse proxy (nginx)
6. Setup SSL certificate (Let's Encrypt)

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📊 Database Setup

### SQLite (Default - Development)
No additional setup required. Database file will be created automatically.

### PostgreSQL (Production Recommended)
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE driver_license_db;
CREATE USER app_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE driver_license_db TO app_user;
\q

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://app_user:secure_password@localhost:5432/driver_license_db
```

## 🔐 Security Configuration

### SSL Certificate (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Firewall Setup
```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### Environment Security
- Use strong, unique SECRET_KEY and JWT_SECRET
- Restrict database access
- Use environment variables for sensitive data
- Enable rate limiting in production

## 📱 Telegram Bot Setup

### Create Telegram Bot
1. Message [@BotFather](https://t.me/BotFather)
2. Send `/newbot`
3. Follow instructions to create bot
4. Save the bot token

### Get Chat ID
1. Message [@userinfobot](https://t.me/userinfobot)
2. Send `/start`
3. Copy your Chat ID

### Configure Bot
Add to backend/.env:
```env
BOT_TOKEN=1234567890:ABC123DEF456GHI789JKL012MNO345PQR678
ADMIN_CHAT_ID=123456789
```

## 💳 Payment Configuration

### Crypto Wallets
Update wallet addresses in backend/.env:
```env
BTC_WALLET=bc1qr97ln0ayjp4gv0thj6ml3d3ygwx62lq3eryfcw
TON_WALLET=UQDO-WTSRTo9vZJc1pjEpbaM5o-Q3PF9WyA-5MaZzsW3nNnF
USDT_WALLET=TWGYmrA4Q4M4qjHyNZBcgTpEh8ggKfniXx
```

### Exchange Rates
The app automatically fetches exchange rates from:
- Central Bank of Russia (primary)
- Exchange Rates API (fallback)
- CoinGecko (crypto rates)

## 🔧 Monitoring & Maintenance

### Process Management (PM2)
```bash
# Start application
pm2 start ecosystem.config.js

# Monitor
pm2 status
pm2 logs

# Restart
pm2 restart all

# Auto-restart on server reboot
pm2 startup
pm2 save
```

### Database Backups
```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/driver-license"

mkdir -p $BACKUP_DIR

# SQLite backup
cp /path/to/database.db $BACKUP_DIR/database_$DATE.db

# PostgreSQL backup
pg_dump driver_license_db > $BACKUP_DIR/database_$DATE.sql

# Keep only last 30 days
find $BACKUP_DIR -name "database_*" -mtime +30 -delete
```

### Log Rotation
```bash
# Configure logrotate
sudo nano /etc/logrotate.d/driver-license

/var/log/driver-license/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reload all
    endscript
}
```

## 🧪 Testing Production Setup

### Health Checks
```bash
# Backend API
curl http://localhost:5000/api/health

# Frontend
curl http://localhost:3000

# Database connection
curl http://localhost:5000/api/admin/db-status
```

### Load Testing
```bash
# Install artillery
npm install -g artillery

# Create test script
artillery quick --count 10 --num 5 http://localhost:5000/api/health
```

## 📈 Performance Optimization

### Frontend Optimization
- Enable gzip compression
- Use CDN for static assets
- Implement service worker for caching
- Optimize images and fonts

### Backend Optimization
- Enable response compression
- Implement Redis for session storage
- Use connection pooling for database
- Add response caching headers

### Database Optimization
- Add proper indexes
- Regular VACUUM for SQLite
- Connection pooling
- Query optimization

## 🚨 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port
lsof -i :5000
sudo kill -9 <PID>
```

#### Permission Denied
```bash
# Fix file permissions
sudo chown -R $USER:$USER /path/to/app
chmod -R 755 /path/to/app
```

#### Database Connection Error
- Check DATABASE_URL format
- Verify database server is running
- Check user permissions

#### File Upload Issues
- Check upload directory permissions
- Verify file size limits
- Check available disk space

### Logs Location
- Backend logs: `/var/log/driver-license/`
- Nginx logs: `/var/log/nginx/`
- PM2 logs: `~/.pm2/logs/`

## 🆘 Support

For deployment issues:
1. Check this deployment guide
2. Review application logs
3. Verify environment configuration
4. Test individual components

## 📋 Deployment Checklist

- [ ] Server setup (Node.js 16+, database)
- [ ] Repository cloned and dependencies installed
- [ ] Environment variables configured
- [ ] Database setup and migrations run
- [ ] SSL certificate installed
- [ ] Nginx/reverse proxy configured
- [ ] Firewall rules applied
- [ ] Process manager (PM2) configured
- [ ] Backup system implemented
- [ ] Monitoring setup
- [ ] Health checks passing
- [ ] Load testing completed

## 🔄 Updates & Maintenance

### Application Updates
```bash
# Pull latest changes
git pull origin main

# Update dependencies
npm install
cd frontend && npm install
cd ../backend && npm install

# Rebuild
cd backend && npm run build

# Restart services
pm2 restart all
```

### Security Updates
- Regular system updates: `sudo apt update && sudo apt upgrade`
- Node.js updates: Use nvm for version management
- Dependency updates: `npm audit fix`
- SSL certificate renewal: Automated with Let's Encrypt
