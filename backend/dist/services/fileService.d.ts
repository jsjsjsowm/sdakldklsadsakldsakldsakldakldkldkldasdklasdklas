import { Application } from '../models';
declare class FileService {
    ensureDirectoryExists(dirPath: string): void;
    saveApplicationToFile(application: Application): Promise<string>;
    listApplicationFiles(): Promise<Array<{
        filename: string;
        size: number;
        created: string;
        modified: string;
    }>>;
    deleteApplicationFile(filename: string): Promise<boolean>;
    getApplicationFile(filename: string): Promise<string | null>;
    clearAllFiles(): Promise<void>;
}
export declare const fileService: FileService;
export {};
//# sourceMappingURL=fileService.d.ts.map