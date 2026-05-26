import { Request, Response } from 'express';
export declare const getPatients: (req: Request, res: Response) => Promise<void>;
export declare const getPatientById: (req: Request, res: Response) => Promise<void>;
export declare const getCurrentPatient: (req: Request, res: Response) => Promise<void>;
export declare const createPatient: (req: Request, res: Response) => Promise<void>;
export declare const updateCurrentPatient: (req: Request, res: Response) => Promise<void>;
export declare const updatePatient: (req: Request, res: Response) => Promise<void>;
export declare const deletePatient: (req: Request, res: Response) => Promise<void>;
declare const _default: {
    getPatients: (req: Request, res: Response) => Promise<void>;
    getPatientById: (req: Request, res: Response) => Promise<void>;
    getCurrentPatient: (req: Request, res: Response) => Promise<void>;
    createPatient: (req: Request, res: Response) => Promise<void>;
    updateCurrentPatient: (req: Request, res: Response) => Promise<void>;
    updatePatient: (req: Request, res: Response) => Promise<void>;
    deletePatient: (req: Request, res: Response) => Promise<void>;
};
export default _default;
//# sourceMappingURL=patients.controller.d.ts.map