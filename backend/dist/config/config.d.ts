interface Config {
    port: number;
    nodeEnv: string;
    secretKey: string;
    jwtSecret: string;
    frontendUrl: string;
    database: {
        url: string;
        dialect: 'sqlite' | 'postgres';
    };
    telegram: {
        botToken?: string;
        adminChatId?: string;
    };
    cryptoWallets: {
        btc: string;
        ton: string;
        usdt: string;
    };
    upload: {
        maxFileSize: number;
        uploadDir: string;
    };
    prices: {
        categories: {
            A: number;
            B: number;
            C: number;
            D: number;
        };
        medical: {
            order: number;
        };
        school: {
            no: number;
        };
    };
}
export declare const config: Config;
export {};
//# sourceMappingURL=config.d.ts.map