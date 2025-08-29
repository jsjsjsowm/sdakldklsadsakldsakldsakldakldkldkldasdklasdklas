"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientIP = exports.checkIPBlocking = void 0;
const models_1 = require("../models");
const errorHandler_1 = require("./errorHandler");
const checkIPBlocking = async (req, res, next) => {
    try {
        const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
        if (!clientIP) {
            return next();
        }
        const blockedIP = await models_1.BlockedIP.findOne({
            where: {
                ipAddress: clientIP.toString(),
                isActive: true,
            },
        });
        if (blockedIP) {
            console.log(`🚫 Blocked IP attempted access: ${clientIP}`);
            throw (0, errorHandler_1.createError)('Access denied', 403);
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.checkIPBlocking = checkIPBlocking;
const getClientIP = (req) => {
    return (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip || 'unknown').toString();
};
exports.getClientIP = getClientIP;
//# sourceMappingURL=ipBlocking.js.map