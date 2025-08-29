import fs from 'fs';
import path from 'path';
import { Application } from '../models';

class FileService {
  ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`📁 Created directory: ${dirPath}`);
    }
  }

  async saveApplicationToFile(application: Application): Promise<string> {
    try {
      // Create applications directory if it doesn't exist
      const applicationsDir = path.join(process.cwd(), 'applications');
      this.ensureDirectoryExists(applicationsDir);

      // Generate filename
      const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
      const filename = `application_${application.id}_${timestamp}.txt`;
      const filepath = path.join(applicationsDir, filename);

      // Format categories
      const categories = [];
      if (application.categoryA) categories.push('A');
      if (application.categoryB) categories.push('B');
      if (application.categoryC) categories.push('C');
      if (application.categoryD) categories.push('D');
      const categoriesStr = categories.length > 0 ? categories.join(', ') : 'Не выбрано';

      // Format payment information
      let paymentText;
      if (application.paymentType === 'partial' && application.paidAmount && application.remainingAmount) {
        paymentText = `${application.paidAmount.toLocaleString()} ₽ (30%, остаток ${application.remainingAmount.toLocaleString()} ₽ при получении)`;
      } else {
        paymentText = `${application.totalAmount.toLocaleString()} ₽ (100%)`;
      }

      // Prepare application data
      const applicationData = `
=== ЗАЯВКА №${application.id} ===
Дата и время: ${application.createdAt.toLocaleString('ru-RU')}
IP адрес: ${application.ipAddress}

=== ЛИЧНЫЕ ДАННЫЕ ===
ФИО: ${application.fullName}
Паспорт: ${application.passportNumber}
Телефон: ${application.phone}

=== ВЫБРАННЫЕ КАТЕГОРИИ ===
${categoriesStr}

=== ДОКУМЕНТЫ ===
Медицинская справка: ${application.hasMedical}
Образование: ${application.hasSchool}

=== ОПЛАТА ===
Тип оплаты: ${application.paymentType === 'partial' ? 'Частичная (30%)' : 'Полная (100%)'}
Оплаченная сумма: ${paymentText}

=== ДОСТАВКА ===
Способ доставки: ${application.deliveryMethod || 'Не указано'}
Адрес доставки: ${application.deliveryAddress || 'Не указано'}

=== ФАЙЛЫ ===
Статус файлов: ${application.personalPhotoPath ? 'Загружены' : 'Не загружены'}
Название фото: ${application.personalPhotoPath ? path.basename(application.personalPhotoPath) : 'Нет файла'}
Подпись: ${application.signaturePath ? path.basename(application.signaturePath) : 'Нет файла'}
Мед. справка: ${application.medCertificatePath ? path.basename(application.medCertificatePath) : 'Нет файла'}

=== СТАТУС ===
Статус оплаты: ${application.paymentStatus}
Подтверждение оплаты: ${application.paymentConfirmed ? 'Оплачено' : 'Не оплачено'}
`;

      // Write to file
      fs.writeFileSync(filepath, applicationData, 'utf8');

      console.log(`✅ Application ${application.id} saved to file: ${filepath}`);
      return filepath;
    } catch (error) {
      console.error(`❌ Error saving application to file:`, error);
      throw error;
    }
  }

  async listApplicationFiles(): Promise<Array<{ filename: string; size: number; created: string; modified: string }>> {
    const applicationsDir = path.join(process.cwd(), 'applications');
    
    if (!fs.existsSync(applicationsDir)) {
      return [];
    }

    const files = fs.readdirSync(applicationsDir)
      .filter(filename => filename.endsWith('.txt'))
      .map(filename => {
        const filepath = path.join(applicationsDir, filename);
        const stats = fs.statSync(filepath);
        return {
          filename,
          size: stats.size,
          created: stats.birthtime.toLocaleString('ru-RU'),
          modified: stats.mtime.toLocaleString('ru-RU'),
        };
      })
      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

    return files;
  }

  async deleteApplicationFile(filename: string): Promise<boolean> {
    try {
      const applicationsDir = path.join(process.cwd(), 'applications');
      const filepath = path.join(applicationsDir, filename);
      
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        console.log(`🗑️ Deleted file: ${filepath}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`❌ Error deleting file:`, error);
      return false;
    }
  }

  async getApplicationFile(filename: string): Promise<string | null> {
    try {
      const applicationsDir = path.join(process.cwd(), 'applications');
      const filepath = path.join(applicationsDir, filename);
      
      if (fs.existsSync(filepath)) {
        return filepath;
      }
      return null;
    } catch (error) {
      console.error(`❌ Error getting file:`, error);
      return null;
    }
  }

  async clearAllFiles(): Promise<void> {
    const applicationsDir = path.join(process.cwd(), 'applications');
    const uploadsDir = path.join(process.cwd(), 'uploads');

    // Clear applications directory
    if (fs.existsSync(applicationsDir)) {
      fs.rmSync(applicationsDir, { recursive: true, force: true });
      this.ensureDirectoryExists(applicationsDir);
    }

    // Clear uploads directory
    if (fs.existsSync(uploadsDir)) {
      fs.rmSync(uploadsDir, { recursive: true, force: true });
      this.ensureDirectoryExists(uploadsDir);
      this.ensureDirectoryExists(path.join(uploadsDir, 'signatures'));
      this.ensureDirectoryExists(path.join(uploadsDir, 'photos'));
      this.ensureDirectoryExists(path.join(uploadsDir, 'certificates'));
    }

    console.log('🗑️ All files cleared');
  }
}

export const fileService = new FileService();
