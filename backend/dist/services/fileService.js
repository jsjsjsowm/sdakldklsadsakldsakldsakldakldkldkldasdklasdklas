"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class FileService {
    ensureDirectoryExists(dirPath) {
        if (!fs_1.default.existsSync(dirPath)) {
            fs_1.default.mkdirSync(dirPath, { recursive: true });
            console.log(`📁 Created directory: ${dirPath}`);
        }
    }
    async saveApplicationToFile(application) {
        try {
            // Create applications directory if it doesn't exist
            const applicationsDir = path_1.default.join(process.cwd(), 'applications');
            this.ensureDirectoryExists(applicationsDir);
            // Generate filename
            const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
            const filename = `application_${application.id}_${timestamp}.txt`;
            const filepath = path_1.default.join(applicationsDir, filename);
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
            const categoriesStr = categories.length > 0 ? categories.join(', ') : 'Не выбрано';
            // Format payment information
            let paymentText;
            if (application.paymentType === 'partial' && application.paidAmount && application.remainingAmount) {
                paymentText = `${application.paidAmount.toLocaleString()} ₽ (30%, остаток ${application.remainingAmount.toLocaleString()} ₽ при получении)`;
            }
            else {
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
Название фото: ${application.personalPhotoPath ? path_1.default.basename(application.personalPhotoPath) : 'Нет файла'}
Подпись: ${application.signaturePath ? path_1.default.basename(application.signaturePath) : 'Нет файла'}
Мед. справка: ${application.medCertificatePath ? path_1.default.basename(application.medCertificatePath) : 'Нет файла'}

=== СТАТУС ===
Статус оплаты: ${application.paymentStatus}
Подтверждение оплаты: ${application.paymentConfirmed ? 'Оплачено' : 'Не оплачено'}
`;
            // Write to file
            fs_1.default.writeFileSync(filepath, applicationData, 'utf8');
            console.log(`✅ Application ${application.id} saved to file: ${filepath}`);
            return filepath;
        }
        catch (error) {
            console.error(`❌ Error saving application to file:`, error);
            throw error;
        }
    }
    async listApplicationFiles() {
        const applicationsDir = path_1.default.join(process.cwd(), 'applications');
        if (!fs_1.default.existsSync(applicationsDir)) {
            return [];
        }
        const files = fs_1.default.readdirSync(applicationsDir)
            .filter(filename => filename.endsWith('.txt'))
            .map(filename => {
            const filepath = path_1.default.join(applicationsDir, filename);
            const stats = fs_1.default.statSync(filepath);
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
    async deleteApplicationFile(filename) {
        try {
            const applicationsDir = path_1.default.join(process.cwd(), 'applications');
            const filepath = path_1.default.join(applicationsDir, filename);
            if (fs_1.default.existsSync(filepath)) {
                fs_1.default.unlinkSync(filepath);
                console.log(`🗑️ Deleted file: ${filepath}`);
                return true;
            }
            return false;
        }
        catch (error) {
            console.error(`❌ Error deleting file:`, error);
            return false;
        }
    }
    async getApplicationFile(filename) {
        try {
            const applicationsDir = path_1.default.join(process.cwd(), 'applications');
            const filepath = path_1.default.join(applicationsDir, filename);
            if (fs_1.default.existsSync(filepath)) {
                return filepath;
            }
            return null;
        }
        catch (error) {
            console.error(`❌ Error getting file:`, error);
            return null;
        }
    }
    async clearAllFiles() {
        const applicationsDir = path_1.default.join(process.cwd(), 'applications');
        const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
        // Clear applications directory
        if (fs_1.default.existsSync(applicationsDir)) {
            fs_1.default.rmSync(applicationsDir, { recursive: true, force: true });
            this.ensureDirectoryExists(applicationsDir);
        }
        // Clear uploads directory
        if (fs_1.default.existsSync(uploadsDir)) {
            fs_1.default.rmSync(uploadsDir, { recursive: true, force: true });
            this.ensureDirectoryExists(uploadsDir);
            this.ensureDirectoryExists(path_1.default.join(uploadsDir, 'signatures'));
            this.ensureDirectoryExists(path_1.default.join(uploadsDir, 'photos'));
            this.ensureDirectoryExists(path_1.default.join(uploadsDir, 'certificates'));
        }
        console.log('🗑️ All files cleared');
    }
}
exports.fileService = new FileService();
//# sourceMappingURL=fileService.js.map