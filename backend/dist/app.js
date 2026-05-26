"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const errorHandler_middleware_1 = require("./middleware/errorHandler.middleware");
// Import routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const patients_routes_1 = __importDefault(require("./routes/patients.routes"));
const doctors_routes_1 = __importDefault(require("./routes/doctors.routes"));
const departments_routes_1 = __importDefault(require("./routes/departments.routes"));
const appointments_routes_1 = __importDefault(require("./routes/appointments.routes"));
const medical_records_routes_1 = __importDefault(require("./routes/medical-records.routes"));
const rooms_routes_1 = __importDefault(require("./routes/rooms.routes"));
const prescriptions_routes_1 = __importDefault(require("./routes/prescriptions.routes"));
const inventory_routes_1 = __importDefault(require("./routes/inventory.routes"));
const billing_routes_1 = __importDefault(require("./routes/billing.routes"));
const lab_tests_routes_1 = __importDefault(require("./routes/lab-tests.routes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: env_1.env.cors.origin,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// API version prefix
const apiPrefix = env_1.env.api.prefix;
// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
// Routes
app.use(`${apiPrefix}/auth`, auth_routes_1.default);
app.use(`${apiPrefix}/users`, users_routes_1.default);
app.use(`${apiPrefix}/patients`, patients_routes_1.default);
app.use(`${apiPrefix}/doctors`, doctors_routes_1.default);
app.use(`${apiPrefix}/departments`, departments_routes_1.default);
app.use(`${apiPrefix}/appointments`, appointments_routes_1.default);
app.use(`${apiPrefix}/medical-records`, medical_records_routes_1.default);
app.use(`${apiPrefix}/rooms`, rooms_routes_1.default);
app.use(`${apiPrefix}/prescriptions`, prescriptions_routes_1.default);
app.use(`${apiPrefix}/inventory`, inventory_routes_1.default);
app.use(`${apiPrefix}/billing`, billing_routes_1.default);
app.use(`${apiPrefix}/lab-tests`, lab_tests_routes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path,
    });
});
// Error handler middleware (must be last)
app.use(errorHandler_middleware_1.errorHandler);
// Start server
const PORT = env_1.env.server.port;
app.listen(PORT, () => {
    console.log(`🏥 Hospital Backend Server`);
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 API Prefix: ${apiPrefix}`);
    console.log(`🌍 Environment: ${env_1.env.server.nodeEnv}`);
    console.log(`✅ Ready to accept requests`);
});
exports.default = app;
//# sourceMappingURL=app.js.map