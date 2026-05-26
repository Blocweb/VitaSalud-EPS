"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.register = exports.login = void 0;
const database_1 = require("../config/database");
const jwt_1 = require("../utils/jwt");
const password_1 = require("../utils/password");
const errors_1 = require("../utils/errors");
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new errors_1.AppError(400, 'Email and password are required');
        }
        const result = await (0, database_1.query)(`SELECT u.id, u.email, u.password_hash, u.first_name, u.last_name, r.name as role, u.status
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.email = $1 AND u.deleted_at IS NULL`, [email]);
        if (result.rows.length === 0) {
            throw new errors_1.AppError(401, 'Invalid credentials');
        }
        const user = result.rows[0];
        if (user.account_locked_until && new Date(user.account_locked_until) > new Date()) {
            throw new errors_1.AppError(403, 'Account is locked. Please try again later.');
        }
        const passwordMatch = await (0, password_1.comparePassword)(password, user.password_hash);
        if (!passwordMatch) {
            await (0, database_1.query)(`UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE id = $1`, [user.id]);
            throw new errors_1.AppError(401, 'Invalid credentials');
        }
        await (0, database_1.query)(`UPDATE users SET failed_login_attempts = 0, last_login = CURRENT_TIMESTAMP WHERE id = $1`, [user.id]);
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
                status: user.status,
            },
        });
    }
    catch (error) {
        const appError = (0, errors_1.handleError)(error);
        res.status(appError.statusCode).json({
            success: false,
            message: appError.message,
        });
    }
};
exports.login = login;
const register = async (req, res) => {
    let client;
    try {
        const { email, password, first_name, last_name, phone, date_of_birth, gender, address, city, state, insurance_provider, } = req.body;
        if (!email || !password || !first_name || !last_name) {
            throw new errors_1.AppError(400, 'Missing required fields');
        }
        client = await (0, database_1.getClient)();
        await client.query('BEGIN');
        const existingUser = await client.query(`SELECT id FROM users WHERE email = $1`, [email]);
        if (existingUser.rows.length > 0) {
            throw new errors_1.AppError(409, 'Email already registered');
        }
        const passwordHash = await (0, password_1.hashPassword)(password);
        const roleResult = await client.query(`SELECT id FROM roles WHERE name = 'patient' LIMIT 1`);
        const roleId = roleResult.rows[0]?.id;
        if (!roleId) {
            throw new errors_1.AppError(500, 'Patient role is not configured');
        }
        const result = await client.query(`INSERT INTO users (username, email, password_hash, role_id, first_name, last_name, phone, status, email_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
       RETURNING id, email, first_name, last_name, status`, [
            email.split('@')[0],
            email,
            passwordHash,
            roleId,
            first_name,
            last_name,
            phone || null,
            'active',
        ]);
        const newUser = result.rows[0];
        // Siempre crear el registro de paciente vinculado al usuario
        // Esto garantiza que patientsApi.me() siempre encuentre el perfil
        const patientResult = await client.query(`INSERT INTO patients (
        user_id, first_name, last_name, date_of_birth, gender,
        phone, email, address, city, state, insurance_provider, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, TRUE)
      RETURNING *`, [
            newUser.id,
            first_name,
            last_name,
            date_of_birth || null,
            gender || null,
            phone || null,
            email,
            address || null,
            city || null,
            state || null,
            insurance_provider || null,
        ]);
        const patient = patientResult.rows[0];
        await client.query('COMMIT');
        const token = (0, jwt_1.generateToken)({
            id: newUser.id,
            email: newUser.email,
            role: 'patient',
        });
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                role: 'patient',
                status: newUser.status,
            },
            patient,
        });
    }
    catch (error) {
        if (client) {
            await client.query('ROLLBACK').catch(() => undefined);
        }
        const appError = (0, errors_1.handleError)(error);
        res.status(appError.statusCode).json({
            success: false,
            message: appError.message,
        });
    }
    finally {
        client?.release();
    }
};
exports.register = register;
const verifyToken = async (req, res) => {
    try {
        if (!req.user) {
            throw new errors_1.AppError(401, 'No user found');
        }
        res.status(200).json({
            success: true,
            message: 'Token is valid',
            user: req.user,
        });
    }
    catch (error) {
        const appError = (0, errors_1.handleError)(error);
        res.status(appError.statusCode).json({
            success: false,
            message: appError.message,
        });
    }
};
exports.verifyToken = verifyToken;
exports.default = {
    login: exports.login,
    register: exports.register,
    verifyToken: exports.verifyToken,
};
//# sourceMappingURL=auth.controller.js.map