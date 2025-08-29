"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.telegramService = void 0;
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const config_1 = require("../config/config");
class TelegramService {
    constructor() {
        if (config_1.config.telegram.botToken && config_1.config.telegram.adminChatId) {
            this.bot = new node_telegram_bot_api_1.default(config_1.config.telegram.botToken, { polling: false });
            this.adminChatId = config_1.config.telegram.adminChatId;
            console.log('✅ Telegram bot configured');
        }
        else {
            console.log('⚠️ Telegram bot not configured');
        }
    }
    async testBot() {
        if (!this.bot || !this.adminChatId) {
            console.log('❌ Bot not configured');
            return false;
        }
        try {
            await this.bot.sendMessage(this.adminChatId, '🧪 Тестовое уведомление от сервера!\n\nБот работает корректно.', { parse_mode: 'HTML' });
            console.log('✅ Test message sent successfully');
            return true;
        }
        catch (error) {
            console.error('❌ Failed to send test message:', error);
            return false;
        }
    }
    async sendApplicationNotification(application) {
        if (!this.bot || !this.adminChatId) {
            console.log('⚠️ Telegram bot not configured, skipping notification');
            return;
        }
        try {
            const message = this.formatApplicationMessage(application);
            await this.bot.sendMessage(this.adminChatId, message, {
                parse_mode: 'HTML',
            });
            console.log(`✅ Telegram notification sent for application ${application.id}`);
            // Send files if available
            await this.sendApplicationFiles(application);
        }
        catch (error) {
            console.error(`❌ Failed to send Telegram notification for application ${application.id}:`, error);
        }
    }
    formatApplicationMessage(application) {
        // Format categories
        const categories = [];
        if (application.categoryA)
            categories.push('A');
        if (application.categoryB)
            categories.push('B');
        if (application.categoryC)
            categories.push('C');
        if (application.categoryD)
            categories.push('D');
        // Format medical and school
        const medicalText = application.hasMedical === 'order' ? 'Заказать справку' : 'Есть справка';
        const schoolText = application.hasSchool === 'no' ? 'Нет образования' : 'Есть образование';
        // Format payment information
        let paymentText;
        if (application.paymentType === 'partial' && application.paidAmount && application.remainingAmount) {
            paymentText = `${application.paidAmount.toLocaleString()} ₽ (30%, остаток ${application.remainingAmount.toLocaleString()} ₽ при получении)`;
        }
        else {
            paymentText = `${application.totalAmount.toLocaleString()} ₽ (100%)`;
        }
        return `
🚨 <b>НОВАЯ ЗАЯВКА #${application.id}</b>

📅 <b>Дата и время:</b> ${application.createdAt.toLocaleString('ru-RU')}
🌐 <b>IP адрес:</b> ${application.ipAddress}

👤 <b>Личные данные:</b>
• ФИО: <code>${application.fullName}</code>
• Паспорт: <code>${application.passportNumber}</code>
• Телефон: <code>${application.phone}</code>

🚗 <b>Категории:</b> ${categories.length > 0 ? categories.join(', ') : 'Не выбраны'}
🏥 <b>Медицинская справка:</b> ${medicalText}
🎓 <b>Образование:</b> ${schoolText}

💰 <b>Оплата:</b> ${paymentText}

🚚 <b>Доставка:</b>
• Способ: ${application.deliveryMethod || 'Не выбран'}
• Адрес: ${application.deliveryAddress || 'Не указан'}

📎 <b>Файлы:</b>
• Подпись: ${application.signaturePath ? '✅' : '❌'}
• Фото: ${application.personalPhotoPath ? '✅' : '❌'}
• Мед. справка: ${application.medCertificatePath ? '✅' : '❌'}
    `.trim();
    }
    async sendApplicationFiles(application) {
        if (!this.bot || !this.adminChatId)
            return;
        const baseUrl = config_1.config.frontendUrl.replace(/\/$/, '');
        try {
            // Send signature
            if (application.signaturePath) {
                const fileUrl = `${baseUrl}/uploads/${application.signaturePath}`;
                await this.bot.sendPhoto(this.adminChatId, fileUrl, {
                    caption: '✍️ Подпись заявителя',
                });
            }
            // Send personal photo
            if (application.personalPhotoPath) {
                const fileUrl = `${baseUrl}/uploads/${application.personalPhotoPath}`;
                await this.bot.sendPhoto(this.adminChatId, fileUrl, {
                    caption: '📸 Фото заявителя',
                });
            }
            // Send medical certificate
            if (application.medCertificatePath) {
                const fileUrl = `${baseUrl}/uploads/${application.medCertificatePath}`;
                await this.bot.sendDocument(this.adminChatId, fileUrl, {
                    caption: '🏥 Медицинская справка',
                });
            }
        }
        catch (error) {
            console.error('Error sending application files to Telegram:', error);
        }
    }
}
exports.telegramService = new TelegramService();
//# sourceMappingURL=telegramService.js.map