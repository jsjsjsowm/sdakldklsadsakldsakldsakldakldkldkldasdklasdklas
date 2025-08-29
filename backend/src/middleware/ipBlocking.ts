import { Request, Response, NextFunction } from 'express';
import { BlockedIP } from '../models';
import { createError } from './errorHandler';

export const checkIPBlocking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
    
    if (!clientIP) {
      return next();
    }
    
    const blockedIP = await BlockedIP.findOne({
      where: {
        ipAddress: clientIP.toString(),
        isActive: true,
      },
    });
    
    if (blockedIP) {
      console.log(`🚫 Blocked IP attempted access: ${clientIP}`);
      throw createError('Access denied', 403);
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

export const getClientIP = (req: Request): string => {
  return (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip || 'unknown').toString();
};
