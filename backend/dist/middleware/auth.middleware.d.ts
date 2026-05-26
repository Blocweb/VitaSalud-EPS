import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: string;
            };
        }
    }
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => void;
export declare const authorize: (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
declare const _default: {
    authenticate: (req: Request, res: Response, next: NextFunction) => void;
    authorize: (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
};
export default _default;
//# sourceMappingURL=auth.middleware.d.ts.map