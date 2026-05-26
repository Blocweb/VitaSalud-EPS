"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAppointment = exports.validatePatient = exports.validateRegister = exports.validateLogin = exports.validate = void 0;
const express_validator_1 = require("express-validator");
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array(),
        });
        return;
    }
    next();
};
exports.validate = validate;
exports.validateLogin = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 6 }),
];
exports.validateRegister = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 8 }),
    (0, express_validator_1.body)('first_name').trim().notEmpty(),
    (0, express_validator_1.body)('last_name').trim().notEmpty(),
];
exports.validatePatient = [
    (0, express_validator_1.body)('first_name').trim().notEmpty(),
    (0, express_validator_1.body)('last_name').trim().notEmpty(),
    (0, express_validator_1.body)('date_of_birth').isISO8601(),
    (0, express_validator_1.body)('gender').isIn(['male', 'female', 'other']),
    (0, express_validator_1.body)('phone').matches(/^\+?[0-9]{10,15}$/),
];
exports.validateAppointment = [
    (0, express_validator_1.body)('patient_id').isUUID(),
    (0, express_validator_1.body)('doctor_id').isUUID(),
    (0, express_validator_1.body)('appointment_date').isISO8601(),
    (0, express_validator_1.body)('appointment_time').matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
    (0, express_validator_1.body)('appointment_type').notEmpty(),
];
exports.default = {
    validate: exports.validate,
    validateLogin: exports.validateLogin,
    validateRegister: exports.validateRegister,
    validatePatient: exports.validatePatient,
    validateAppointment: exports.validateAppointment,
};
//# sourceMappingURL=validation.middleware.js.map