"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInventoryItem = exports.updateInventoryItem = exports.createInventoryItem = exports.getLowStockItems = exports.getInventoryById = exports.getInventory = void 0;
const database_1 = require("../config/database");
const errors_1 = require("../utils/errors");
const getInventory = async (req, res) => {
    try {
        const result = await (0, database_1.query)(`SELECT id, item_code, name, category, manufacturer, unit_of_measure,
              unit_price, quantity_in_stock, reorder_level, expiry_date,
              requires_prescription, is_active, created_at
       FROM inventory
       WHERE deleted_at IS NULL
       ORDER BY name`);
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
exports.getInventory = getInventory;
const getInventoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await (0, database_1.query)(`SELECT * FROM inventory WHERE id = $1 AND deleted_at IS NULL`, [id]);
        if (result.rows.length === 0) {
            throw new errors_1.AppError(404, 'Inventory item not found');
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
exports.getInventoryById = getInventoryById;
const getLowStockItems = async (req, res) => {
    try {
        const result = await (0, database_1.query)(`SELECT id, item_code, name, category, quantity_in_stock, reorder_level,
              CASE 
                WHEN expiry_date IS NOT NULL AND expiry_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'Expiring Soon'
                WHEN quantity_in_stock <= reorder_level THEN 'Low Stock'
                ELSE 'OK'
              END AS alert_status
       FROM inventory
       WHERE (quantity_in_stock <= reorder_level 
          OR (expiry_date IS NOT NULL AND expiry_date <= CURRENT_DATE + INTERVAL '30 days'))
         AND is_active = TRUE
         AND deleted_at IS NULL
       ORDER BY quantity_in_stock ASC`);
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
exports.getLowStockItems = getLowStockItems;
const createInventoryItem = async (req, res) => {
    try {
        const { item_code, name, category, manufacturer, unit_of_measure, unit_price, quantity_in_stock, reorder_level, expiry_date } = req.body;
        if (!item_code || !name || !category) {
            throw new errors_1.AppError(400, 'Missing required fields');
        }
        const result = await (0, database_1.query)(`INSERT INTO inventory (item_code, name, category, manufacturer, unit_of_measure, unit_price, quantity_in_stock, reorder_level, expiry_date, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE)
       RETURNING *`, [item_code, name, category, manufacturer || null, unit_of_measure || 'unit', unit_price || 0, quantity_in_stock || 0, reorder_level || 10, expiry_date || null]);
        res.status(201).json({
            success: true,
            message: 'Inventory item created successfully',
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
exports.createInventoryItem = createInventoryItem;
const updateInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity_in_stock, unit_price, reorder_level, expiry_date } = req.body;
        const result = await (0, database_1.query)(`UPDATE inventory SET 
        quantity_in_stock = COALESCE($1, quantity_in_stock),
        unit_price = COALESCE($2, unit_price),
        reorder_level = COALESCE($3, reorder_level),
        expiry_date = COALESCE($4, expiry_date)
       WHERE id = $5 AND deleted_at IS NULL
       RETURNING *`, [quantity_in_stock, unit_price, reorder_level, expiry_date, id]);
        if (result.rows.length === 0) {
            throw new errors_1.AppError(404, 'Inventory item not found');
        }
        res.status(200).json({
            success: true,
            message: 'Inventory item updated successfully',
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
exports.updateInventoryItem = updateInventoryItem;
const deleteInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;
        await (0, database_1.query)(`UPDATE inventory SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`, [id]);
        res.status(200).json({
            success: true,
            message: 'Inventory item deleted successfully',
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
exports.deleteInventoryItem = deleteInventoryItem;
exports.default = {
    getInventory: exports.getInventory,
    getInventoryById: exports.getInventoryById,
    getLowStockItems: exports.getLowStockItems,
    createInventoryItem: exports.createInventoryItem,
    updateInventoryItem: exports.updateInventoryItem,
    deleteInventoryItem: exports.deleteInventoryItem,
};
//# sourceMappingURL=inventory.controller.js.map