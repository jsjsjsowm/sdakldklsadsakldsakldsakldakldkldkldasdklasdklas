"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exchangeRateService = void 0;
const axios_1 = __importDefault(require("axios"));
class ExchangeRateService {
    constructor() {
        this.fallbackRate = 90;
    }
    async getUsdToRubRate() {
        try {
            // First try: CBR API
            const cbrResponse = await axios_1.default.get('https://www.cbr-xml-daily.ru/daily_json.js', {
                timeout: 5000,
            });
            if (cbrResponse.data?.Valute?.USD?.Value) {
                const rate = parseFloat(cbrResponse.data.Valute.USD.Value);
                if (rate >= 60 && rate <= 120) { // Sanity check
                    console.log(`✅ USD/RUB rate from CBR: ${rate}`);
                    return Math.round(rate * 100) / 100;
                }
            }
        }
        catch (error) {
            console.warn('⚠️ CBR API failed:', error instanceof Error ? error.message : 'Unknown error');
        }
        try {
            // Second try: Exchange Rates API
            const apiResponse = await axios_1.default.get('https://api.exchangerate-api.com/v4/latest/USD', {
                timeout: 5000,
            });
            if (apiResponse.data?.rates?.RUB) {
                const rate = parseFloat(apiResponse.data.rates.RUB);
                if (rate >= 60 && rate <= 120) { // Sanity check
                    console.log(`✅ USD/RUB rate from Exchange Rates API: ${rate}`);
                    return Math.round(rate * 100) / 100;
                }
            }
        }
        catch (error) {
            console.warn('⚠️ Exchange Rates API failed:', error instanceof Error ? error.message : 'Unknown error');
        }
        console.log(`⚠️ Using fallback USD/RUB rate: ${this.fallbackRate}`);
        return this.fallbackRate;
    }
    async getCryptoRates() {
        const fallbackRates = {
            btc: 65000,
            ton: 2.5,
            usdt: 1.0,
        };
        try {
            const response = await axios_1.default.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,the-open-network,tether&vs_currencies=usd', { timeout: 10000 });
            const data = response.data;
            const rates = {
                btc: data.bitcoin?.usd || fallbackRates.btc,
                ton: data['the-open-network']?.usd || fallbackRates.ton,
                usdt: data.tether?.usd || fallbackRates.usdt,
            };
            console.log('✅ Crypto rates fetched successfully');
            return rates;
        }
        catch (error) {
            console.warn('⚠️ Failed to fetch crypto rates, using fallback values');
            return fallbackRates;
        }
    }
}
exports.exchangeRateService = new ExchangeRateService();
//# sourceMappingURL=exchangeRateService.js.map