"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader ||
            !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "No token provided"
            });
            return;
        }
        const token = authHeader.substring(7);
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!decoded) {
            res.status(401).json({
                success: false,
                message: "Invalid token"
            });
            return;
        }
        req.user = decoded;
        next();
    }
    catch {
        res.status(401).json({
            success: false,
            message: "Authentication failed"
        });
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "No user found"
            });
            return;
        }
        if (req.user.role === "admin") {
            next();
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: "Access denied"
            });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
exports.default = {
    authenticate: exports.authenticate,
    authorize: exports.authorize
};
//# sourceMappingURL=auth.middleware.js.map