"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorHandler_1 = require("../middleware/errorHandler");
const config_1 = require("../config/config");
const exchangeRateService_1 = require("../services/exchangeRateService");
const telegramService_1 = require("../services/telegramService");
const router = express_1.default.Router();
// Get configuration data for the frontend
router.get('/', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    res.json({
        prices: config_1.config.prices,
        walletAddress: config_1.config.cryptoWallets.usdt, // For backward compatibility
        cryptoWallets: config_1.config.cryptoWallets,
    });
}));
// Get current exchange rate
router.get('/exchange-rate', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    try {
        const rate = await exchangeRateService_1.exchangeRateService.getUsdToRubRate();
        res.json({
            success: true,
            rate,
            source: 'ЦБ РФ',
            timestamp: Math.floor(Date.now() / 1000),
        });
    }
    catch (error) {
        // Return fallback rate if service fails
        res.json({
            success: true,
            rate: 90,
            source: 'Резервное значение',
            timestamp: Math.floor(Date.now() / 1000),
        });
    }
}));
// Get crypto wallet addresses
router.get('/crypto-wallets', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    res.json({
        success: true,
        wallets: config_1.config.cryptoWallets,
    });
}));
// Get current crypto exchange rates
router.get('/crypto-rates', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    try {
        const rates = await exchangeRateService_1.exchangeRateService.getCryptoRates();
        res.json({
            success: true,
            rates,
        });
    }
    catch (error) {
        // Return fallback rates if service fails
        res.json({
            success: true,
            rates: {
                btc: 65000,
                ton: 2.5,
                usdt: 1.0,
            },
        });
    }
}));
// Test Telegram bot
router.post('/test-bot', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    try {
        const result = await telegramService_1.telegramService.testBot();
        if (result) {
            res.json({ success: 'Test message sent' });
        }
        else {
            res.status(400).json({ error: 'Bot not configured or failed to send message' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
}));
exports.default = router;
//# sourceMappingURL=config.js.map