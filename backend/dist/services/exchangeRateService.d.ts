declare class ExchangeRateService {
    private fallbackRate;
    getUsdToRubRate(): Promise<number>;
    getCryptoRates(): Promise<{
        btc: number;
        ton: number;
        usdt: number;
    }>;
}
export declare const exchangeRateService: ExchangeRateService;
export {};
//# sourceMappingURL=exchangeRateService.d.ts.map