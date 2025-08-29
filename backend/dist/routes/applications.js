"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const models_1 = require("../models");
const errorHandler_1 = require("../middleware/errorHandler");
const ipBlocking_1 = require("../middleware/ipBlocking");
const config_1 = require("../config/config");
const telegramService_1 = require("../services/telegramService");
const fileService_1 = require("../services/fileService");
const router = express_1.default.Router();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = '';
        if (file.fieldname === 'signature') {
            uploadPath = path_1.default.join(config_1.config.upload.uploadDir, 'signatures');
        }
        else if (file.fieldname === 'personal_photo') {
            uploadPath = path_1.default.join(config_1.config.upload.uploadDir, 'photos');
        }
        else if (file.fieldname === 'med_certificate') {
            uploadPath = path_1.default.join(config_1.config.upload.uploadDir, 'certificates');
        }
        fileService_1.fileService.ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
        const extension = path_1.default.extname(file.originalname);
        const filename = `${timestamp}_${file.originalname}`;
        cb(null, filename);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: config_1.config.upload.maxFileSize,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'));
        }
    },
});
// Helper function to manage user sessions
const getOrCreateSession = async (ipAddress, userAgent) => {
    // Clean old sessions (older than 30 minutes)
    const cutoffTime = new Date(Date.now() - 30 * 60 * 1000);
    await models_1.UserSession.destroy({
        where: {
            lastActivity: {
                [require('sequelize').Op.lt]: cutoffTime,
            },
        },
    });
    // Try to find existing active session for this IP
    let session = await models_1.UserSession.findOne({
        where: {
            ipAddress,
            isActive: true,
        },
    });
    if (session) {
        // Update last activity
        session.lastActivity = new Date();
        await session.save();
        return session;
    }
    else {
        // Create new session
        const sessionId = (0, uuid_1.v4)();
        session = await models_1.UserSession.create({
            ipAddress,
            sessionId,
            userAgent: userAgent || '',
        });
        return session;
    }
};
// Get user data based on IP address
router.get('/user-data', ipBlocking_1.checkIPBlocking, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const ipAddress = (0, ipBlocking_1.getClientIP)(req);
    // Create or update user session
    await getOrCreateSession(ipAddress, req.headers['user-agent']);
    const application = await models_1.Application.findOne({
        where: { ipAddress },
        order: [['createdAt', 'DESC']],
    });
    if (application) {
        res.json({
            hasApplication: true,
            data: application.toJSON(),
            message: application.paymentConfirmed ? 'Ваша заявка находится в обработке' : undefined,
        });
    }
    else {
        res.json({
            hasApplication: false,
            data: null,
        });
    }
}));
// Update user activity timestamp
router.post('/user-activity', ipBlocking_1.checkIPBlocking, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const ipAddress = (0, ipBlocking_1.getClientIP)(req);
    // Update or create session
    await getOrCreateSession(ipAddress, req.headers['user-agent']);
    res.json({ success: true });
}));
// Create new application with file uploads
router.post('/', ipBlocking_1.checkIPBlocking, upload.fields([
    { name: 'signature', maxCount: 1 },
    { name: 'personal_photo', maxCount: 1 },
    { name: 'med_certificate', maxCount: 1 },
]), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const ipAddress = (0, ipBlocking_1.getClientIP)(req);
    const files = req.files;
    // Validate required files
    if (!files.signature || !files.personal_photo) {
        throw (0, errorHandler_1.createError)('Required files missing or invalid format', 400);
    }
    // Extract form data
    const { full_name, passport_number, phone, medical, school, total_amount, delivery_method, delivery_address, city, categories, } = req.body;
    // Validate required fields
    if (!full_name || !passport_number || !phone || !medical || !school || !total_amount) {
        throw (0, errorHandler_1.createError)('Missing required fields', 400);
    }
    // Validate delivery information if method is selected
    if (delivery_method && !delivery_address) {
        throw (0, errorHandler_1.createError)('Адрес доставки обязателен при выборе способа доставки', 400);
    }
    // Parse categories
    const categoriesArray = Array.isArray(categories) ? categories : (categories ? [categories] : []);
    const categoryFlags = {
        A: categoriesArray.includes('A'),
        B: categoriesArray.includes('B'),
        C: categoriesArray.includes('C'),
        D: categoriesArray.includes('D'),
    };
    // Get file paths
    const signaturePath = path_1.default.relative(config_1.config.upload.uploadDir, files.signature[0].path);
    const personalPhotoPath = path_1.default.relative(config_1.config.upload.uploadDir, files.personal_photo[0].path);
    const medCertificatePath = files.med_certificate
        ? path_1.default.relative(config_1.config.upload.uploadDir, files.med_certificate[0].path)
        : undefined;
    // Check if user already has an application
    const existingApplication = await models_1.Application.findOne({
        where: { ipAddress },
        order: [['createdAt', 'DESC']],
    });
    if (existingApplication) {
        if (existingApplication.paymentConfirmed) {
            throw (0, errorHandler_1.createError)('У вас уже есть активная заявка в обработке', 400);
        }
        else {
            // Update existing draft application
            await existingApplication.update({
                fullName: full_name,
                passportNumber: passport_number,
                phone,
                hasMedical: medical,
                hasSchool: school,
                totalAmount: parseInt(total_amount),
                deliveryMethod: delivery_method || null,
                deliveryAddress: delivery_address || null,
                city: city || null,
                signaturePath,
                personalPhotoPath,
                medCertificatePath,
                categoryA: categoryFlags.A,
                categoryB: categoryFlags.B,
                categoryC: categoryFlags.C,
                categoryD: categoryFlags.D,
            });
            console.log(`📝 Updated draft application ${existingApplication.id}`);
            return res.json({
                success: true,
                message: 'Черновик заявки обновлен. Подтвердите оплату для завершения.',
                applicationId: existingApplication.id,
                data: existingApplication.toJSON(),
            });
        }
    }
    // Create new application
    const application = await models_1.Application.create({
        ipAddress,
        city: city || null,
        fullName: full_name,
        passportNumber: passport_number,
        phone,
        deliveryMethod: delivery_method || null,
        deliveryAddress: delivery_address || null,
        signaturePath,
        personalPhotoPath,
        medCertificatePath,
        categoryA: categoryFlags.A,
        categoryB: categoryFlags.B,
        categoryC: categoryFlags.C,
        categoryD: categoryFlags.D,
        hasMedical: medical,
        hasSchool: school,
        totalAmount: parseInt(total_amount),
        paymentStatus: 'pending',
        paymentConfirmed: false,
        paymentType: 'full',
    });
    console.log(`📝 Created draft application ${application.id}`);
    res.status(201).json({
        success: true,
        message: 'Черновик заявки создан. Подтвердите оплату для завершения.',
        applicationId: application.id,
        data: application.toJSON(),
    });
}));
// Update payment status for an application
router.post('/:id/payment', ipBlocking_1.checkIPBlocking, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const applicationId = parseInt(req.params.id);
    const { payment_type = 'full' } = req.body;
    const clientIP = (0, ipBlocking_1.getClientIP)(req);
    console.log(`💳 Payment confirmation attempt for application ${applicationId} from IP ${clientIP}`);
    const application = await models_1.Application.findByPk(applicationId);
    if (!application) {
        throw (0, errorHandler_1.createError)('Заявка не найдена', 404);
    }
    // Check IP address (can be temporarily disabled for testing)
    if (application.ipAddress !== clientIP) {
        console.log(`⚠️ IP mismatch: application ${application.ipAddress}, client ${clientIP}`);
        // Uncomment the line below to enforce IP checking
        // throw createError('Unauthorized', 403);
    }
    // Check if payment is already confirmed
    if (application.paymentConfirmed) {
        console.log(`⚠️ Payment for application ${applicationId} already confirmed`);
        return res.json({
            success: true,
            message: 'Оплата уже подтверждена',
            data: application.toJSON(),
        });
    }
    console.log(`💰 Confirming payment for application ${applicationId}`);
    // Update payment information
    const updateData = {
        paymentConfirmed: true,
        paymentStatus: 'processing',
        paymentType: payment_type,
    };
    // Calculate paid and remaining amounts
    if (payment_type === 'partial') {
        updateData.paidAmount = Math.floor(application.totalAmount * 0.3);
        updateData.remainingAmount = application.totalAmount - updateData.paidAmount;
    }
    else {
        updateData.paidAmount = application.totalAmount;
        updateData.remainingAmount = 0;
    }
    await application.update(updateData);
    console.log(`✅ Payment status updated for application ${applicationId}`);
    // Save application to file
    try {
        await fileService_1.fileService.saveApplicationToFile(application);
        console.log(`📄 Application ${applicationId} saved to file`);
    }
    catch (error) {
        console.error('Error saving application to file:', error);
    }
    // Send Telegram notification
    try {
        await telegramService_1.telegramService.sendApplicationNotification(application);
        console.log(`📱 Telegram notification sent for application ${applicationId}`);
    }
    catch (error) {
        console.error('Error sending Telegram notification:', error);
    }
    res.json({
        success: true,
        message: 'Оплата успешно подтверждена',
        data: application.toJSON(),
    });
}));
// Get application by ID
router.get('/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const applicationId = parseInt(req.params.id);
    const application = await models_1.Application.findByPk(applicationId);
    if (!application) {
        throw (0, errorHandler_1.createError)('Заявка не найдена', 404);
    }
    res.json(application.toJSON());
}));
// Get latest application for current user
router.get('/latest', ipBlocking_1.checkIPBlocking, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const clientIP = (0, ipBlocking_1.getClientIP)(req);
    console.log(`🔍 Looking for latest application for IP: ${clientIP}`);
    const application = await models_1.Application.findOne({
        where: { ipAddress: clientIP },
        order: [['createdAt', 'DESC']],
    });
    if (!application) {
        throw (0, errorHandler_1.createError)('Заявка не найдена', 404);
    }
    console.log(`✅ Found application ${application.id} for IP ${clientIP}`);
    res.json({
        success: true,
        data: application.toJSON(),
    });
}));
exports.default = router;
//# sourceMappingURL=applications.js.map