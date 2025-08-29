"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorHandler_1 = require("../middleware/errorHandler");
const fileService_1 = require("../services/fileService");
const router = express_1.default.Router();
// List all application files
router.get('/files', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    try {
        const files = await fileService_1.fileService.listApplicationFiles();
        res.json({
            files,
            count: files.length,
        });
    }
    catch (error) {
        res.json({
            files: [],
            count: 0,
            message: 'Папка с файлами заявок не найдена',
        });
    }
}));
// Download application file
router.get('/files/:filename', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { filename } = req.params;
    const filepath = await fileService_1.fileService.getApplicationFile(filename);
    if (!filepath) {
        throw (0, errorHandler_1.createError)('Файл не найден', 404);
    }
    res.download(filepath, filename);
}));
exports.default = router;
//# sourceMappingURL=uploads.js.map