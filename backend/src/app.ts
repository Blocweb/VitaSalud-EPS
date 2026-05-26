import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler.middleware';

// Import routes
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import patientsRoutes from './routes/patients.routes';
import doctorsRoutes from './routes/doctors.routes';
import departmentsRoutes from './routes/departments.routes';
import appointmentsRoutes from './routes/appointments.routes';
import medicalRecordsRoutes from './routes/medical-records.routes';
import roomsRoutes from './routes/rooms.routes';
import prescriptionsRoutes from './routes/prescriptions.routes';
import inventoryRoutes from './routes/inventory.routes';
import billingRoutes from './routes/billing.routes';
import labTestsRoutes from './routes/lab-tests.routes';

const app = express();

// Middleware
app.use(cors({
  origin: env.cors.origin,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API version prefix
const apiPrefix = env.api.prefix;

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Routes
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/users`, usersRoutes);
app.use(`${apiPrefix}/patients`, patientsRoutes);
app.use(`${apiPrefix}/doctors`, doctorsRoutes);
app.use(`${apiPrefix}/departments`, departmentsRoutes);
app.use(`${apiPrefix}/appointments`, appointmentsRoutes);
app.use(`${apiPrefix}/medical-records`, medicalRecordsRoutes);
app.use(`${apiPrefix}/rooms`, roomsRoutes);
app.use(`${apiPrefix}/prescriptions`, prescriptionsRoutes);
app.use(`${apiPrefix}/inventory`, inventoryRoutes);
app.use(`${apiPrefix}/billing`, billingRoutes);
app.use(`${apiPrefix}/lab-tests`, labTestsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = env.server.port;
app.listen(PORT, () => {
  console.log(`🏥 Hospital Backend Server`);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API Prefix: ${apiPrefix}`);
  console.log(`🌍 Environment: ${env.server.nodeEnv}`);
  console.log(`✅ Ready to accept requests`);
});

export default app;
