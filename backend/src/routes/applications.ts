import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Application, UserSession } from '../models';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { checkIPBlocking, getClientIP } from '../middleware/ipBlocking';
import { config } from '../config/config';
import { telegramService } from '../services/telegramService';
import { fileService } from '../services/fileService';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = '';
    
    if (file.fieldname === 'signature') {
      uploadPath = path.join(config.upload.uploadDir, 'signatures');
    } else if (file.fieldname === 'personal_photo') {
      uploadPath = path.join(config.upload.uploadDir, 'photos');
    } else if (file.fieldname === 'med_certificate') {
      uploadPath = path.join(config.upload.uploadDir, 'certificates');
    }
    
    fileService.ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const extension = path.extname(file.originalname);
    const filename = `${timestamp}_${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'));
    }
  },
});

// Helper function to manage user sessions
const getOrCreateSession = async (ipAddress: string, userAgent?: string): Promise<UserSession> => {
  // Clean old sessions (older than 30 minutes)
  const cutoffTime = new Date(Date.now() - 30 * 60 * 1000);
  await UserSession.destroy({
    where: {
      lastActivity: {
        [require('sequelize').Op.lt]: cutoffTime,
      },
    },
  });

  // Try to find existing active session for this IP
  let session = await UserSession.findOne({
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
  } else {
    // Create new session
    const sessionId = uuidv4();
    session = await UserSession.create({
      ipAddress,
      sessionId,
      userAgent: userAgent || '',
    });
    return session;
  }
};

// Get user data based on IP address
router.get('/user-data', checkIPBlocking, asyncHandler(async (req, res) => {
  const ipAddress = getClientIP(req);
  
  // Create or update user session
  await getOrCreateSession(ipAddress, req.headers['user-agent']);
  
  const application = await Application.findOne({
    where: { ipAddress },
    order: [['createdAt', 'DESC']],
  });
  
  if (application) {
    res.json({
      hasApplication: true,
      data: application.toJSON(),
      message: application.paymentConfirmed ? 'Ваша заявка находится в обработке' : undefined,
    });
  } else {
    res.json({
      hasApplication: false,
      data: null,
    });
  }
}));

// Update user activity timestamp
router.post('/user-activity', checkIPBlocking, asyncHandler(async (req, res) => {
  const ipAddress = getClientIP(req);
  
  // Update or create session
  await getOrCreateSession(ipAddress, req.headers['user-agent']);
  
  res.json({ success: true });
}));

// Create new application with file uploads
router.post('/', checkIPBlocking, upload.fields([
  { name: 'signature', maxCount: 1 },
  { name: 'personal_photo', maxCount: 1 },
  { name: 'med_certificate', maxCount: 1 },
]), asyncHandler(async (req, res) => {
  const ipAddress = getClientIP(req);
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  
  // Validate required files
  if (!files.signature || !files.personal_photo) {
    throw createError('Required files missing or invalid format', 400);
  }
  
  // Extract form data
  const {
    full_name,
    passport_number,
    phone,
    medical,
    school,
    total_amount,
    delivery_method,
    delivery_address,
    city,
    categories,
  } = req.body;
  
  // Validate required fields
  if (!full_name || !passport_number || !phone || !medical || !school || !total_amount) {
    throw createError('Missing required fields', 400);
  }
  
  // Validate delivery information if method is selected
  if (delivery_method && !delivery_address) {
    throw createError('Адрес доставки обязателен при выборе способа доставки', 400);
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
  const signaturePath = path.relative(config.upload.uploadDir, files.signature[0].path);
  const personalPhotoPath = path.relative(config.upload.uploadDir, files.personal_photo[0].path);
  const medCertificatePath = files.med_certificate 
    ? path.relative(config.upload.uploadDir, files.med_certificate[0].path) 
    : undefined;
  
  // Check if user already has an application
  const existingApplication = await Application.findOne({
    where: { ipAddress },
    order: [['createdAt', 'DESC']],
  });
  
  if (existingApplication) {
    if (existingApplication.paymentConfirmed) {
      throw createError('У вас уже есть активная заявка в обработке', 400);
    } else {
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
  const application = await Application.create({
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
router.post('/:id/payment', checkIPBlocking, asyncHandler(async (req, res) => {
  const applicationId = parseInt(req.params.id);
  const { payment_type = 'full' } = req.body;
  const clientIP = getClientIP(req);
  
  console.log(`💳 Payment confirmation attempt for application ${applicationId} from IP ${clientIP}`);
  
  const application = await Application.findByPk(applicationId);
  if (!application) {
    throw createError('Заявка не найдена', 404);
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
  const updateData: any = {
    paymentConfirmed: true,
    paymentStatus: 'processing',
    paymentType: payment_type,
  };
  
  // Calculate paid and remaining amounts
  if (payment_type === 'partial') {
    updateData.paidAmount = Math.floor(application.totalAmount * 0.3);
    updateData.remainingAmount = application.totalAmount - updateData.paidAmount;
  } else {
    updateData.paidAmount = application.totalAmount;
    updateData.remainingAmount = 0;
  }
  
  await application.update(updateData);
  
  console.log(`✅ Payment status updated for application ${applicationId}`);
  
  // Save application to file
  try {
    await fileService.saveApplicationToFile(application);
    console.log(`📄 Application ${applicationId} saved to file`);
  } catch (error) {
    console.error('Error saving application to file:', error);
  }
  
  // Send Telegram notification
  try {
    await telegramService.sendApplicationNotification(application);
    console.log(`📱 Telegram notification sent for application ${applicationId}`);
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
  }
  
  res.json({
    success: true,
    message: 'Оплата успешно подтверждена',
    data: application.toJSON(),
  });
}));

// Get application by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const applicationId = parseInt(req.params.id);
  
  const application = await Application.findByPk(applicationId);
  if (!application) {
    throw createError('Заявка не найдена', 404);
  }
  
  res.json(application.toJSON());
}));

// Get latest application for current user
router.get('/latest', checkIPBlocking, asyncHandler(async (req, res) => {
  const clientIP = getClientIP(req);
  
  console.log(`🔍 Looking for latest application for IP: ${clientIP}`);
  
  const application = await Application.findOne({
    where: { ipAddress: clientIP },
    order: [['createdAt', 'DESC']],
  });
  
  if (!application) {
    throw createError('Заявка не найдена', 404);
  }
  
  console.log(`✅ Found application ${application.id} for IP ${clientIP}`);
  
  res.json({
    success: true,
    data: application.toJSON(),
  });
}));

export default router;
