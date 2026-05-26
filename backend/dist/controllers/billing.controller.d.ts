import { Request, Response } from 'express';
export declare const getBilling: (req: Request, res: Response) => Promise<void>;
export declare const getBillingById: (req: Request, res: Response) => Promise<void>;
export declare const getBillingByPatient: (req: Request, res: Response) => Promise<void>;
export declare const getPendingBilling: (req: Request, res: Response) => Promise<void>;
export declare const createBilling: (req: Request, res: Response) => Promise<void>;
export declare const recordPayment: (req: Request, res: Response) => Promise<void>;
export declare const deleteBilling: (req: Request, res: Response) => Promise<void>;
declare const _default: {
    getBilling: (req: Request, res: Response) => Promise<void>;
    getBillingById: (req: Request, res: Response) => Promise<void>;
    getBillingByPatient: (req: Request, res: Response) => Promise<void>;
    getPendingBilling: (req: Request, res: Response) => Promise<void>;
    createBilling: (req: Request, res: Response) => Promise<void>;
    recordPayment: (req: Request, res: Response) => Promise<void>;
    deleteBilling: (req: Request, res: Response) => Promise<void>;
};
export default _default;
//# sourceMappingURL=billing.controller.d.ts.map