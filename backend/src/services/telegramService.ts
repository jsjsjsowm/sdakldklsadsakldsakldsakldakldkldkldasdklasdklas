import TelegramBot from 'node-telegram-bot-api';
import { config } from '../config/config';
import { Application } from '../models';

class TelegramService {
  private bot?: TelegramBot;
  private adminChatId?: string;

  constructor() {
    if (config.telegram.botToken && config.telegram.adminChatId) {
      this.bot = new TelegramBot(config.telegram.botToken, { polling: false });
      this.adminChatId = config.telegram.adminChatId;
      console.log('✅ Telegram bot configured');
    } else {
      console.log('⚠️ Telegram bot not configured');
    }
  }

  async testBot(): Promise<boolean> {
    if (!this.bot || !this.adminChatId) {
      console.log('❌ Bot not configured');
      return false;
    }

    try {
      await this.bot.sendMessage(
        this.adminChatId,
        '🧪 Тестовое уведомление от сервера!\n\nБот работает корректно.',
        { parse_mode: 'HTML' }
      );
      console.log('✅ Test message sent successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to send test message:', error);
      return false;
    }
  }

  async sendApplicationNotification(application: Application): Promise<void> {
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
    } catch (error) {
      console.error(`❌ Failed to send Telegram notification for application ${application.id}:`, error);
    }
  }

  private formatApplicationMessage(application: Application): string {
    // Format categories
    const categories = [];
    if (application.categoryA) categories.push('A');
    if (application.categoryB) categories.push('B');
    if (application.categoryC) categories.push('C');
    if (application.categoryD) categories.push('D');

    // Format medical and school
    const medicalText = application.hasMedical === 'order' ? 'Заказать справку' : 'Есть справка';
    const schoolText = application.hasSchool === 'no' ? 'Нет образования' : 'Есть образование';

    // Format payment information
    let paymentText;
    if (application.paymentType === 'partial' && application.paidAmount && application.remainingAmount) {
      paymentText = `${application.paidAmount.toLocaleString()} ₽ (30%, остаток ${application.remainingAmount.toLocaleString()} ₽ при получении)`;
    } else {
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

  private async sendApplicationFiles(application: Application): Promise<void> {
    if (!this.bot || !this.adminChatId) return;

    const baseUrl = config.frontendUrl.replace(/\/$/, '');

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
    } catch (error) {
      console.error('Error sending application files to Telegram:', error);
    }
  }
}

export const telegramService = new TelegramService();
