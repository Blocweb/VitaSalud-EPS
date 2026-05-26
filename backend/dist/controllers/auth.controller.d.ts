import { Request, Response } from 'express';
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const register: (req: Request, res: Response) => Promise<void>;
export declare const verifyToken: (req: Request, res: Response) => Promise<void>;
declare const _default: {
    login: (req: Request, res: Response) => Promise<void>;
    register: (req: Request, res: Response) => Promise<void>;
    verifyToken: (req: Request, res: Response) => Promise<void>;
};
export default _default;
//# sourceMappingURL=auth.controller.d.ts.map