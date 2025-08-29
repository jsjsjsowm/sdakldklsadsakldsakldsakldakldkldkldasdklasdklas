"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const errorHandler_1 = require("../middleware/errorHandler");
const fileService_1 = require("../services/fileService");
const database_1 = require("../config/database");
const router = express_1.default.Router();
// Get admin statistics
router.get('/stats', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const allApplications = await models_1.Application.findAll();
    const total = allApplications.length;
    const paid = allApplications.filter(app => app.paymentConfirmed).length;
    const pending = total - paid;
    const revenue = allApplications
        .filter(app => app.paymentConfirmed)
        .reduce((sum, app) => sum + app.totalAmount, 0);
    // Get online users count (sessions active in last 30 minutes)
    const cutoffTime = new Date(Date.now() - 30 * 60 * 1000);
    const onlineUsers = await models_1.UserSession.count({
        where: {
            lastActivity: {
                [sequelize_1.Op.gte]: cutoffTime,
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
router.get('/applications', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const applications = await models_1.Application.findAll({
        order: [['createdAt', 'DESC']],
    });
    res.json({
        success: true,
        applications: applications.map(app => app.toJSON()),
    });
}));
// Delete application by admin
router.delete('/applications/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const applicationId = parseInt(req.params.id);
    const application = await models_1.Application.findByPk(applicationId);
    if (!application) {
        throw (0, errorHandler_1.createError)('Заявка не найдена', 404);
    }
    await application.destroy();
    res.json({
        success: true,
        message: 'Заявка удалена'
    });
}));
// Get list of blocked IP addresses
router.get('/blocked-ips', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const blockedIPs = await models_1.BlockedIP.findAll({
        where: { isActive: true },
        order: [['blockedAt', 'DESC']],
    });
    res.json({
        success: true,
        blocked_ips: blockedIPs.map(ip => ip.toJSON()),
    });
}));
// Block an IP address
router.post('/block-ip', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { ip_address, reason, blocked_by } = req.body;
    if (!ip_address) {
        throw (0, errorHandler_1.createError)('IP address is required', 400);
    }
    // Check if already blocked
    const existing = await models_1.BlockedIP.findOne({
        where: { ipAddress: ip_address },
    });
    if (existing) {
        if (existing.isActive) {
            throw (0, errorHandler_1.createError)(`IP ${ip_address} уже заблокирован`, 400);
        }
        else {
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
    await models_1.BlockedIP.create({
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
router.post('/unblock-ip', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { ip_address } = req.body;
    if (!ip_address) {
        throw (0, errorHandler_1.createError)('IP address is required', 400);
    }
    const blockedIP = await models_1.BlockedIP.findOne({
        where: {
            ipAddress: ip_address,
            isActive: true,
        },
    });
    if (!blockedIP) {
        throw (0, errorHandler_1.createError)(`IP ${ip_address} не найден в списке заблокированных`, 404);
    }
    await blockedIP.update({ isActive: false });
    res.json({
        success: true,
        message: `IP ${ip_address} разблокирован`,
    });
}));
// Check if IP is blocked
router.post('/check-ip', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { ip_address } = req.body;
    if (!ip_address) {
        throw (0, errorHandler_1.createError)('IP address is required', 400);
    }
    const blockedIP = await models_1.BlockedIP.findOne({
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
router.delete('/files/:filename', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { filename } = req.params;
    const deleted = await fileService_1.fileService.deleteApplicationFile(filename);
    if (deleted) {
        res.json({
            success: true,
            message: 'Файл удален'
        });
    }
    else {
        throw (0, errorHandler_1.createError)('Файл не найден', 404);
    }
}));
// Create database backup
router.post('/backup', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const fs = await Promise.resolve().then(() => __importStar(require('fs')));
    const path = await Promise.resolve().then(() => __importStar(require('path')));
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
    }
    catch (error) {
        throw (0, errorHandler_1.createError)('Ошибка создания резервной копии', 500);
    }
}));
// Clear all applications from database
router.post('/clear-db', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await models_1.Application.destroy({ where: {} });
    res.json({
        success: true,
        message: 'База данных очищена',
    });
}));
// Clear all application files
router.post('/clear-files', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await fileService_1.fileService.clearAllFiles();
    res.json({
        success: true,
        message: 'Все файлы удалены',
    });
}));
// Check database status
router.get('/db-status', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    try {
        await database_1.sequelize.authenticate();
        const count = await models_1.Application.count();
        res.json({
            success: true,
            message: `База данных работает, ${count} заявок`,
        });
    }
    catch (error) {
        throw (0, errorHandler_1.createError)('Ошибка базы данных', 500);
    }
}));
// Check filesystem status
router.get('/fs-status', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const fs = await Promise.resolve().then(() => __importStar(require('fs')));
    const path = await Promise.resolve().then(() => __importStar(require('path')));
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
    }
    catch (error) {
        throw (0, errorHandler_1.createError)('Ошибка файловой системы', 500);
    }
}));
exports.default = router;
//# sourceMappingURL=admin.js.map