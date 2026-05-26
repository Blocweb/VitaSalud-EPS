import { Request, Response } from 'express';
export declare const getLabTests: (req: Request, res: Response) => Promise<void>;
export declare const getLabTestById: (req: Request, res: Response) => Promise<void>;
export declare const getLabTestsByPatient: (req: Request, res: Response) => Promise<void>;
export declare const createLabTest: (req: Request, res: Response) => Promise<void>;
export declare const updateLabTestResults: (req: Request, res: Response) => Promise<void>;
export declare const updateLabTestStatus: (req: Request, res: Response) => Promise<void>;
export declare const deleteLabTest: (req: Request, res: Response) => Promise<void>;
declare const _default: {
    getLabTests: (req: Request, res: Response) => Promise<void>;
    getLabTestById: (req: Request, res: Response) => Promise<void>;
    getLabTestsByPatient: (req: Request, res: Response) => Promise<void>;
    createLabTest: (req: Request, res: Response) => Promise<void>;
    updateLabTestResults: (req: Request, res: Response) => Promise<void>;
    updateLabTestStatus: (req: Request, res: Response) => Promise<void>;
    deleteLabTest: (req: Request, res: Response) => Promise<void>;
};
export default _default;
//# sourceMappingURL=lab-tests.controller.d.ts.map