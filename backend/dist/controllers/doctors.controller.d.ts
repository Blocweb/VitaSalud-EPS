import { Request, Response } from 'express';
export declare const getDoctors: (req: Request, res: Response) => Promise<void>;
export declare const getDoctorById: (req: Request, res: Response) => Promise<void>;
export declare const getDoctorsBySpecialization: (req: Request, res: Response) => Promise<void>;
export declare const updateDoctor: (req: Request, res: Response) => Promise<void>;
declare const _default: {
    getDoctors: (req: Request, res: Response) => Promise<void>;
    getDoctorById: (req: Request, res: Response) => Promise<void>;
    getDoctorsBySpecialization: (req: Request, res: Response) => Promise<void>;
    updateDoctor: (req: Request, res: Response) => Promise<void>;
};
export default _default;
//# sourceMappingURL=doctors.controller.d.ts.map