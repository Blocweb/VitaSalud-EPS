import { Request, Response, NextFunction } from 'express';
export declare const errorHandler: (error: any, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const asyncHandler: (fn: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
declare const _default: {
    errorHandler: (error: any, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
    asyncHandler: (fn: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
};
export default _default;
//# sourceMappingURL=errorHandler.middleware.d.ts.map