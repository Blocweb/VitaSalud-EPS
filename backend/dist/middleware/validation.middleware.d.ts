import { Request, Response, NextFunction } from 'express';
export declare const validate: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateLogin: import("express-validator").ValidationChain[];
export declare const validateRegister: import("express-validator").ValidationChain[];
export declare const validatePatient: import("express-validator").ValidationChain[];
export declare const validateAppointment: import("express-validator").ValidationChain[];
declare const _default: {
    validate: (req: Request, res: Response, next: NextFunction) => void;
    validateLogin: import("express-validator").ValidationChain[];
    validateRegister: import("express-validator").ValidationChain[];
    validatePatient: import("express-validator").ValidationChain[];
    validateAppointment: import("express-validator").ValidationChain[];
};
export default _default;
//# sourceMappingURL=validation.middleware.d.ts.map