"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.createError = exports.errorHandler = void 0;
const errorHandler = (error, req, res, next) => {
    let { statusCode = 500, message } = error;
    // Log error for debugging
    console.error('Error:', {
        message: error.message,
        stack: error.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
    });
    // Handle specific error types
    if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation error';
    }
    else if (error.name === 'UnauthorizedError') {
        statusCode = 401;
        message = 'Unauthorized';
    }
    else if (error.name === 'SequelizeUniqueConstraintError') {
        statusCode = 409;
        message = 'Resource already exists';
    }
    else if (error.name === 'SequelizeValidationError') {
        statusCode = 400;
        message = 'Invalid input data';
    }
    // Send error response
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
};
exports.errorHandler = errorHandler;
const createError = (message, statusCode = 500) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
};
exports.createError = createError;
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=errorHandler.js.map