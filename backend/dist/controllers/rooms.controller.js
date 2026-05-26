"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoom = exports.updateRoom = exports.createRoom = exports.getAvailableRooms = exports.getRoomById = exports.getRooms = void 0;
const database_1 = require("../config/database");
const errors_1 = require("../utils/errors");
const getRooms = async (req, res) => {
    try {
        const result = await (0, database_1.query)(`SELECT r.id, r.room_number, r.room_type, r.status, r.floor_number,
              r.capacity, r.daily_rate, r.has_ac, r.has_bathroom, r.has_tv,
              d.name as department_name
       FROM rooms r
       LEFT JOIN departments d ON r.department_id = d.id
       WHERE r.deleted_at IS NULL
       ORDER BY r.room_number`);
        res.status(200).json({
            success: true,
            data: result.rows,
            total: result.rows.length,
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
exports.getRooms = getRooms;
const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await (0, database_1.query)(`SELECT * FROM rooms WHERE id = $1 AND deleted_at IS NULL`, [id]);
        if (result.rows.length === 0) {
            throw new errors_1.AppError(404, 'Room not found');
        }
        res.status(200).json({
            success: true,
            data: result.rows[0],
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
exports.getRoomById = getRoomById;
const getAvailableRooms = async (req, res) => {
    try {
        const result = await (0, database_1.query)(`SELECT r.id, r.room_number, r.room_type, r.floor_number,
              r.capacity, r.daily_rate, d.name as department_name
       FROM rooms r
       LEFT JOIN departments d ON r.department_id = d.id
       WHERE r.status = 'available' AND r.deleted_at IS NULL
       ORDER BY r.room_number`);
        res.status(200).json({
            success: true,
            data: result.rows,
            total: result.rows.length,
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
exports.getAvailableRooms = getAvailableRooms;
const createRoom = async (req, res) => {
    try {
        const { room_number, room_type, department_id, floor_number, capacity, daily_rate, has_ac, has_bathroom, has_tv } = req.body;
        if (!room_number || !room_type || !floor_number) {
            throw new errors_1.AppError(400, 'Missing required fields');
        }
        const result = await (0, database_1.query)(`INSERT INTO rooms (room_number, room_type, department_id, floor_number, capacity, daily_rate, has_ac, has_bathroom, has_tv, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'available')
       RETURNING *`, [room_number, room_type, department_id || null, floor_number, capacity || 1, daily_rate || 0, has_ac !== false, has_bathroom !== false, has_tv || false]);
        res.status(201).json({
            success: true,
            message: 'Room created successfully',
            data: result.rows[0],
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
exports.createRoom = createRoom;
const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, daily_rate, has_ac, has_bathroom, has_tv } = req.body;
        const result = await (0, database_1.query)(`UPDATE rooms SET 
        status = COALESCE($1, status),
        daily_rate = COALESCE($2, daily_rate),
        has_ac = COALESCE($3, has_ac),
        has_bathroom = COALESCE($4, has_bathroom),
        has_tv = COALESCE($5, has_tv)
       WHERE id = $6 AND deleted_at IS NULL
       RETURNING *`, [status, daily_rate, has_ac, has_bathroom, has_tv, id]);
        if (result.rows.length === 0) {
            throw new errors_1.AppError(404, 'Room not found');
        }
        res.status(200).json({
            success: true,
            message: 'Room updated successfully',
            data: result.rows[0],
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
exports.updateRoom = updateRoom;
const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;
        await (0, database_1.query)(`UPDATE rooms SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`, [id]);
        res.status(200).json({
            success: true,
            message: 'Room deleted successfully',
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
exports.deleteRoom = deleteRoom;
exports.default = {
    getRooms: exports.getRooms,
    getRoomById: exports.getRoomById,
    getAvailableRooms: exports.getAvailableRooms,
    createRoom: exports.createRoom,
    updateRoom: exports.updateRoom,
    deleteRoom: exports.deleteRoom,
};
//# sourceMappingURL=rooms.controller.js.map