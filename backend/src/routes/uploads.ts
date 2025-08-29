import express from 'express';
import path from 'path';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { fileService } from '../services/fileService';

const router = express.Router();

// List all application files
router.get('/files', asyncHandler(async (req, res) => {
  try {
    const files = await fileService.listApplicationFiles();
    res.json({
      files,
      count: files.length,
    });
  } catch (error) {
    res.json({
      files: [],
      count: 0,
      message: 'Папка с файлами заявок не найдена',
    });
  }
}));

// Download application file
router.get('/files/:filename', asyncHandler(async (req, res) => {
  const { filename } = req.params;
  
  const filepath = await fileService.getApplicationFile(filename);
  
  if (!filepath) {
    throw createError('Файл не найден', 404);
  }
  
  res.download(filepath, filename);
}));

export default router;
