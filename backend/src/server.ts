import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

// Centralized Error Handling
app.use(errorHandler);

export default app; // export for testing

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`CareBridge Backend running on http://localhost:${PORT}`);
  });
}
