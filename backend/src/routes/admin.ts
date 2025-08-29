import express from 'express';
import { Op } from 'sequelize';
import { Application, BlockedIP, UserSession } from '../models';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { fileService } from '../services/fileService';
import { sequelize } from '../config/database';

const router = express.Router();

// Get admin statistics
router.get('/stats', asyncHandler(async (req, res) => {
  const allApplications = await Application.findAll();
  
  const total = allApplications.length;
  const paid = allApplications.filter(app => app.paymentConfirmed).length;
  const pending = total - paid;
  const revenue = allApplications
    .filter(app => app.paymentConfirmed)
    .reduce((sum, app) => sum + app.totalAmount, 0);
  
  // Get online users count (sessions active in last 30 minutes)
  const cutoffTime = new Date(Date.now() - 30 * 60 * 1000);
  const onlineUsers = await UserSession.count({
    where: {
      lastActivity: {
        [Op.gte]: cutoffTime,
      },
      isActive: true,
    },
  });
  
  res.json({
    success: true,
    stats: {
      total,
      paid,
      pending,
      revenue,
      online_users: onlineUsers,
    },
  });
}));

// Get all applications for admin
router.get('/applications', asyncHandler(async (req, res) => {
  const applications = await Application.findAll({
    order: [['createdAt', 'DESC']],
  });
  
  res.json({
    success: true,
    applications: applications.map(app => app.toJSON()),
  });
}));

// Delete application by admin
router.delete('/applications/:id', asyncHandler(async (req, res) => {
  const applicationId = parseInt(req.params.id);
  
  const application = await Application.findByPk(applicationId);
  if (!application) {
    throw createError('Заявка не найдена', 404);
  }
  
  await application.destroy();
  
  res.json({ 
    success: true, 
    message: 'Заявка удалена' 
  });
}));

// Get list of blocked IP addresses
router.get('/blocked-ips', asyncHandler(async (req, res) => {
  const blockedIPs = await BlockedIP.findAll({
    where: { isActive: true },
    order: [['blockedAt', 'DESC']],
  });
  
  res.json({
    success: true,
    blocked_ips: blockedIPs.map(ip => ip.toJSON()),
  });
}));

// Block an IP address
router.post('/block-ip', asyncHandler(async (req, res) => {
  const { ip_address, reason, blocked_by } = req.body;
  
  if (!ip_address) {
    throw createError('IP address is required', 400);
  }
  
  // Check if already blocked
  const existing = await BlockedIP.findOne({
    where: { ipAddress: ip_address },
  });
  
  if (existing) {
    if (existing.isActive) {
      throw createError(`IP ${ip_address} уже заблокирован`, 400);
    } else {
      // Reactivate existing block
      await existing.update({
        isActive: true,
        reason: reason || existing.reason,
        blockedBy: blocked_by || existing.blockedBy,
        blockedAt: new Date(),
      });
      
      res.json({
        success: true,
        message: `IP ${ip_address} заблокирован`,
      });
      return;
    }
  }
  
  // Create new block
  await BlockedIP.create({
    ipAddress: ip_address,
    reason: reason || '',
    blockedBy: blocked_by || 'Admin',
  });
  
  res.json({
    success: true,
    message: `IP ${ip_address} заблокирован`,
  });
}));

// Unblock an IP address
router.post('/unblock-ip', asyncHandler(async (req, res) => {
  const { ip_address } = req.body;
  
  if (!ip_address) {
    throw createError('IP address is required', 400);
  }
  
  const blockedIP = await BlockedIP.findOne({
    where: { 
      ipAddress: ip_address,
      isActive: true,
    },
  });
  
  if (!blockedIP) {
    throw createError(`IP ${ip_address} не найден в списке заблокированных`, 404);
  }
  
  await blockedIP.update({ isActive: false });
  
  res.json({
    success: true,
    message: `IP ${ip_address} разблокирован`,
  });
}));

// Check if IP is blocked
router.post('/check-ip', asyncHandler(async (req, res) => {
  const { ip_address } = req.body;
  
  if (!ip_address) {
    throw createError('IP address is required', 400);
  }
  
  const blockedIP = await BlockedIP.findOne({
    where: {
      ipAddress: ip_address,
      isActive: true,
    },
  });
  
  res.json({
    success: true,
    ip_address,
    is_blocked: !!blockedIP,
  });
}));

// Delete application file by admin
router.delete('/files/:filename', asyncHandler(async (req, res) => {
  const { filename } = req.params;
  
  const deleted = await fileService.deleteApplicationFile(filename);
  
  if (deleted) {
    res.json({ 
      success: true, 
      message: 'Файл удален' 
    });
  } else {
    throw createError('Файл не найден', 404);
  }
}));

// Create database backup
router.post('/backup', asyncHandler(async (req, res) => {
  const fs = await import('fs');
  const path = await import('path');
  
  try {
    // Create backup filename
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const backupFilename = `app_backup_${timestamp}.db`;
    const backupPath = path.join(process.cwd(), 'backups', backupFilename);
    
    // Create backups directory if not exists
    const backupsDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }
    
    // Copy database file (for SQLite)
    const dbPath = path.join(process.cwd(), 'database.db');
    if (fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, backupPath);
    }
    
    res.json({
      success: true,
      message: 'Резервная копия создана',
      filename: backupFilename,
    });
  } catch (error) {
    throw createError('Ошибка создания резервной копии', 500);
  }
}));

// Clear all applications from database
router.post('/clear-db', asyncHandler(async (req, res) => {
  await Application.destroy({ where: {} });
  
  res.json({
    success: true,
    message: 'База данных очищена',
  });
}));

// Clear all application files
router.post('/clear-files', asyncHandler(async (req, res) => {
  await fileService.clearAllFiles();
  
  res.json({
    success: true,
    message: 'Все файлы удалены',
  });
}));

// Check database status
router.get('/db-status', asyncHandler(async (req, res) => {
  try {
    await sequelize.authenticate();
    const count = await Application.count();
    
    res.json({
      success: true,
      message: `База данных работает, ${count} заявок`,
    });
  } catch (error) {
    throw createError('Ошибка базы данных', 500);
  }
}));

// Check filesystem status
router.get('/fs-status', asyncHandler(async (req, res) => {
  const fs = await import('fs');
  const path = await import('path');
  
  try {
    const directories = [
      'applications',
      'uploads',
      'uploads/signatures',
      'uploads/photos',
      'uploads/certificates',
    ];
    
    for (const directory of directories) {
      const dirPath = path.join(process.cwd(), directory);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      
      // Test write access
      const testFile = path.join(dirPath, 'test.txt');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
    }
    
    res.json({
      success: true,
      message: 'Файловая система доступна',
    });
  } catch (error) {
    throw createError('Ошибка файловой системы', 500);
  }
}));

export default router;
