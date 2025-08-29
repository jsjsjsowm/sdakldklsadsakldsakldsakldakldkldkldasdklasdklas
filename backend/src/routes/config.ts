import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { config } from '../config/config';
import { exchangeRateService } from '../services/exchangeRateService';
import { telegramService } from '../services/telegramService';

const router = express.Router();

// Get configuration data for the frontend
router.get('/', asyncHandler(async (req, res) => {
  res.json({
    prices: config.prices,
    walletAddress: config.cryptoWallets.usdt, // For backward compatibility
    cryptoWallets: config.cryptoWallets,
  });
}));

// Get current exchange rate
router.get('/exchange-rate', asyncHandler(async (req, res) => {
  try {
    const rate = await exchangeRateService.getUsdToRubRate();
    res.json({
      success: true,
      rate,
      source: 'ЦБ РФ',
      timestamp: Math.floor(Date.now() / 1000),
    });
  } catch (error) {
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
router.get('/crypto-wallets', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    wallets: config.cryptoWallets,
  });
}));

// Get current crypto exchange rates
router.get('/crypto-rates', asyncHandler(async (req, res) => {
  try {
    const rates = await exchangeRateService.getCryptoRates();
    res.json({
      success: true,
      rates,
    });
  } catch (error) {
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
router.post('/test-bot', asyncHandler(async (req, res) => {
  try {
    const result = await telegramService.testBot();
    if (result) {
      res.json({ success: 'Test message sent' });
    } else {
      res.status(400).json({ error: 'Bot not configured or failed to send message' });
    }
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}));

export default router;
