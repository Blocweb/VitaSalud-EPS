import { Request, Response } from 'express';
export declare const getAppointments: (req: Request, res: Response) => Promise<void>;
export declare const getAppointmentById: (req: Request, res: Response) => Promise<void>;
export declare const getAppointmentsByPatient: (req: Request, res: Response) => Promise<void>;
export declare const getAppointmentsByDoctor: (req: Request, res: Response) => Promise<void>;
export declare const createAppointment: (req: Request, res: Response) => Promise<void>;
export declare const updateAppointment: (req: Request, res: Response) => Promise<void>;
export declare const cancelAppointment: (req: Request, res: Response) => Promise<void>;
declare const _default: {
    getAppointments: (req: Request, res: Response) => Promise<void>;
    getAppointmentById: (req: Request, res: Response) => Promise<void>;
    getAppointmentsByPatient: (req: Request, res: Response) => Promise<void>;
    getAppointmentsByDoctor: (req: Request, res: Response) => Promise<void>;
    createAppointment: (req: Request, res: Response) => Promise<void>;
    updateAppointment: (req: Request, res: Response) => Promise<void>;
    cancelAppointment: (req: Request, res: Response) => Promise<void>;
};
export default _default;
//# sourceMappingURL=appointments.controller.d.ts.map