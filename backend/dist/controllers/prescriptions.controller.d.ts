import { Request, Response } from 'express';
export declare const getPrescriptions: (req: Request, res: Response) => Promise<void>;
export declare const getPrescriptionById: (req: Request, res: Response) => Promise<void>;
export declare const getPrescriptionsByPatient: (req: Request, res: Response) => Promise<void>;
export declare const createPrescription: (req: Request, res: Response) => Promise<void>;
export declare const dispensePrescription: (req: Request, res: Response) => Promise<void>;
export declare const deletePrescription: (req: Request, res: Response) => Promise<void>;
declare const _default: {
    getPrescriptions: (req: Request, res: Response) => Promise<void>;
    getPrescriptionById: (req: Request, res: Response) => Promise<void>;
    getPrescriptionsByPatient: (req: Request, res: Response) => Promise<void>;
    createPrescription: (req: Request, res: Response) => Promise<void>;
    dispensePrescription: (req: Request, res: Response) => Promise<void>;
    deletePrescription: (req: Request, res: Response) => Promise<void>;
};
export default _default;
//# sourceMappingURL=prescriptions.controller.d.ts.map