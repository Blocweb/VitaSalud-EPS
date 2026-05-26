import { Request, Response } from 'express';
export declare const getMedicalRecords: (req: Request, res: Response) => Promise<void>;
export declare const getMedicalRecordById: (req: Request, res: Response) => Promise<void>;
export declare const getMedicalRecordsByPatient: (req: Request, res: Response) => Promise<void>;
export declare const createMedicalRecord: (req: Request, res: Response) => Promise<void>;
export declare const updateMedicalRecord: (req: Request, res: Response) => Promise<void>;
export declare const deleteMedicalRecord: (req: Request, res: Response) => Promise<void>;
declare const _default: {
    getMedicalRecords: (req: Request, res: Response) => Promise<void>;
    getMedicalRecordById: (req: Request, res: Response) => Promise<void>;
    getMedicalRecordsByPatient: (req: Request, res: Response) => Promise<void>;
    createMedicalRecord: (req: Request, res: Response) => Promise<void>;
    updateMedicalRecord: (req: Request, res: Response) => Promise<void>;
    deleteMedicalRecord: (req: Request, res: Response) => Promise<void>;
};
export default _default;
//# sourceMappingURL=medical-records.controller.d.ts.map