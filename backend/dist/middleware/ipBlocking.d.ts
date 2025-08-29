import { Request, Response, NextFunction } from 'express';
export declare const checkIPBlocking: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getClientIP: (req: Request) => string;
//# sourceMappingURL=ipBlocking.d.ts.map