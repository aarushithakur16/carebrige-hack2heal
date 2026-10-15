import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/authRoutes';
import documentRoutes from './routes/documentRoutes';
import carePlanRoutes from './routes/carePlanRoutes';
import medicationRoutes from './routes/medicationRoutes';
import taskRoutes from './routes/taskRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import auditRoutes from './routes/auditRoutes';
import { errorHandler } from './middleware/errorMiddleware';
import { checkDatabaseHealth } from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', async (req, res) => {
  const dbStatus = await checkDatabaseHealth();
  res.status(200).json({
    status: 'ok',
    service: 'CareBridge Backend',
    database: dbStatus ? 'connected' : 'disconnected'
  });
});

// Mount Routes
app.use('/auth', authRoutes);
app.use('/documents', documentRoutes);
app.use('/patients', carePlanRoutes);
app.use('/medications', medicationRoutes);
app.use('/', taskRoutes); // mounts /tasks and /checkins
app.use('/', appointmentRoutes); // mounts /appointments and /tests
app.use('/', auditRoutes); // mounts /audit-logs

// Serve Frontend in unified production build if frontend/dist exists
const possibleDistPaths = [
  path.resolve(process.cwd(), '../frontend/dist'),
  path.resolve(process.cwd(), 'frontend/dist'),
  path.join(__dirname, '../../frontend/dist')
];

const frontendDist = possibleDistPaths.find(p => fs.existsSync(p));

if (frontendDist) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    const apiPrefixes = ['/auth', '/documents', '/patients', '/medications', '/tasks', '/checkins', '/appointments', '/tests', '/audit-logs', '/health'];
    if (apiPrefixes.some(prefix => req.path.startsWith(prefix))) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Centralized Error Handling
app.use(errorHandler);

export default app; // export for testing

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`CareBridge Unified Server running on http://localhost:${PORT}`);
  });
}
