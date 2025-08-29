import { Application } from '../models';
declare class TelegramService {
    private bot?;
    private adminChatId?;
    constructor();
    testBot(): Promise<boolean>;
    sendApplicationNotification(application: Application): Promise<void>;
    private formatApplicationMessage;
    private sendApplicationFiles;
}
export declare const telegramService: TelegramService;
export {};
//# sourceMappingURL=telegramService.d.ts.map